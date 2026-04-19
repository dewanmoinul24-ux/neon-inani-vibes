import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RequireSuperAdmin } from "@/components/admin/RequireRole";
import { Check, X, Calendar, User, Phone, Mail, MapPin, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCurrency } from "@/hooks/useCurrency";
import { useState } from "react";

const AdminQueueInner = () => {
  const queryClient = useQueryClient();
  const { formatPrice } = useCurrency();
  const [actingId, setActingId] = useState<string | null>(null);

  const { data: pending, isLoading } = useQuery({
    queryKey: ["admin-pending-reservations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experience_reservations")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateStatus = async (id: string, status: "confirmed" | "rejected") => {
    setActingId(id);
    const { error } = await supabase
      .from("experience_reservations")
      .update({ status })
      .eq("id", id);
    setActingId(null);

    if (error) {
      toast.error(`Failed to ${status === "confirmed" ? "confirm" : "reject"} reservation`);
      return;
    }
    toast.success(
      status === "confirmed" ? "Reservation confirmed" : "Reservation rejected"
    );
    queryClient.invalidateQueries({ queryKey: ["admin-pending-reservations"] });
    queryClient.invalidateQueries({ queryKey: ["admin-reservations-all"] });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-neon-cyan" />
      </div>
    );
  }

  if (!pending?.length) {
    return (
      <div className="glass rounded-xl p-12 text-center neon-border-blue">
        <Check className="w-12 h-12 mx-auto mb-3 text-neon-cyan" />
        <h2 className="font-display text-xl font-bold text-foreground mb-2">
          All caught up
        </h2>
        <p className="font-body text-sm text-muted-foreground">
          No pending reservation requests right now.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pending.map((r) => {
        const isActing = actingId === r.id;
        return (
          <div
            key={r.id}
            className="glass rounded-xl p-5 md:p-6 neon-border-pink transition-all hover:scale-[1.005]"
          >
            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-ui text-[10px] uppercase tracking-widest text-neon-pink mb-1">
                      {r.experience_type} {r.category && `• ${r.category}`}
                    </p>
                    <h3 className="font-display text-lg md:text-xl font-bold text-foreground">
                      {r.experience_title}
                    </h3>
                  </div>
                  <span className="px-2 py-1 rounded-full text-[10px] font-ui uppercase tracking-wider bg-neon-orange/15 text-neon-orange border border-neon-orange/40 shrink-0">
                    Pending
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm font-body">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-3.5 h-3.5" />
                    <span className="text-foreground">{r.guest_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="text-foreground truncate">{r.guest_email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" />
                    <span className="text-foreground">{r.guest_phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-foreground">
                      {new Date(r.preferred_date).toLocaleDateString()}
                      {r.preferred_time && ` • ${r.preferred_time}`}
                    </span>
                  </div>
                  {r.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-foreground">{r.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-foreground">
                      Requested {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {r.special_requests && (
                  <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border/40">
                    <p className="text-[10px] font-ui uppercase tracking-widest text-muted-foreground mb-1">
                      Special requests
                    </p>
                    <p className="text-sm font-body text-foreground">{r.special_requests}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-stretch lg:items-end gap-3 lg:min-w-[180px]">
                <div className="text-right">
                  <p className="text-[10px] font-ui uppercase tracking-widest text-muted-foreground">
                    Total ({r.quantity}× {formatPrice(Number(r.unit_price))})
                  </p>
                  <p className="font-display text-xl font-bold gradient-neon-text">
                    {formatPrice(Number(r.total_price))}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(r.id, "rejected")}
                    disabled={isActing}
                    className="flex-1 lg:flex-none px-4 py-2 rounded-lg font-ui text-xs uppercase tracking-widest border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, "confirmed")}
                    disabled={isActing}
                    className="flex-1 lg:flex-none px-4 py-2 rounded-lg font-ui text-xs uppercase tracking-widest gradient-neon text-primary-foreground hover:scale-105 transition-transform disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {isActing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}{" "}
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const AdminQueue = () => (
  <RequireSuperAdmin>
    <AdminLayout
      title="Approval Queue"
      subtitle="Pending experience reservation requests awaiting your decision"
    >
      <AdminQueueInner />
    </AdminLayout>
  </RequireSuperAdmin>
);

export default AdminQueue;

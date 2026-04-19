import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RequireSuperAdmin } from "@/components/admin/RequireRole";
import {
  Check,
  X,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useCurrency } from "@/hooks/useCurrency";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";

const AdminQueueInner = () => {
  const queryClient = useQueryClient();
  const { formatPrice } = useCurrency();
  const [actingId, setActingId] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const {
    data: pending,
    isLoading,
    isFetching,
    dataUpdatedAt,
    refetch,
  } = useQuery({
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

  // Tick every 30s so the relative timestamp stays fresh
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const { pullDistance, isRefreshing, progress } = usePullToRefresh({
    onRefresh: async () => {
      await refetch();
      toast.success("Queue updated");
    },
  });

  const lastUpdatedLabel = dataUpdatedAt
    ? formatDistanceToNow(new Date(dataUpdatedAt), { addSuffix: true })
    : "just now";
  // Reference `now` so this re-renders on the interval tick
  void now;


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

  const handleManualRefresh = async () => {
    await refetch();
    toast.success("Queue updated");
  };

  return (
    <>
      {/* Pull-to-refresh visual indicator (mobile) */}
      <div
        className="md:hidden fixed top-12 left-0 right-0 z-40 flex items-center justify-center pointer-events-none transition-transform"
        style={{
          transform: `translateY(${pullDistance > 0 ? pullDistance - 40 : -40}px)`,
          opacity: pullDistance > 0 || isRefreshing ? 1 : 0,
        }}
        aria-hidden={pullDistance === 0 && !isRefreshing}
      >
        <div className="glass rounded-full px-3 py-2 flex items-center gap-2 neon-border-pink shadow-lg">
          <RefreshCw
            className={`w-3.5 h-3.5 text-neon-cyan ${isRefreshing ? "animate-spin" : ""}`}
            style={{
              transform: isRefreshing ? undefined : `rotate(${progress * 270}deg)`,
              transition: isRefreshing ? undefined : "transform 0.05s linear",
            }}
          />
          <span className="font-ui text-[10px] uppercase tracking-widest text-foreground">
            {isRefreshing
              ? "Refreshing…"
              : progress >= 1
                ? "Release to refresh"
                : "Pull to refresh"}
          </span>
        </div>
      </div>

      {/* Last updated bar */}
      <div className="glass rounded-xl px-3 md:px-4 py-2.5 mb-3 md:mb-4 flex items-center justify-between gap-2 border border-border/40">
        <div className="flex items-center gap-2 min-w-0">
          <Clock className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
          <span className="font-ui text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground truncate">
            Updated {lastUpdatedLabel}
          </span>
          {pending && (
            <span className="font-ui text-[10px] md:text-xs uppercase tracking-widest text-neon-pink shrink-0">
              • {pending.length} pending
            </span>
          )}
        </div>
        <button
          onClick={handleManualRefresh}
          disabled={isFetching}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/40 text-foreground hover:border-primary/40 hover:bg-muted/30 transition-colors disabled:opacity-50"
          aria-label="Refresh queue"
        >
          <RefreshCw
            className={`w-3 h-3 text-neon-cyan ${isFetching ? "animate-spin" : ""}`}
          />
          <span className="font-ui text-[10px] uppercase tracking-widest hidden sm:inline">
            Refresh
          </span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neon-cyan" />
        </div>
      ) : !pending?.length ? (
        <div className="glass rounded-xl p-12 text-center neon-border-blue">
          <Check className="w-12 h-12 mx-auto mb-3 text-neon-cyan" />
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            All caught up
          </h2>
          <p className="font-body text-sm text-muted-foreground">
            No pending reservation requests right now.
          </p>
          <p className="font-body text-xs text-muted-foreground mt-2 md:hidden">
            Pull down to check for new requests.
          </p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {pending.map((r) => {
            const isActing = actingId === r.id;
            return (
              <div
                key={r.id}
                className="glass rounded-xl p-4 md:p-6 neon-border-pink transition-all hover:scale-[1.005]"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <p className="font-ui text-[9px] md:text-[10px] uppercase tracking-widest text-neon-pink mb-1 truncate">
                          {r.experience_type} {r.category && `• ${r.category}`}
                        </p>
                        <h3 className="font-display text-base md:text-xl font-bold text-foreground leading-tight break-words">
                          {r.experience_title}
                        </h3>
                      </div>
                      <span className="px-2 py-1 rounded-full text-[9px] md:text-[10px] font-ui uppercase tracking-wider bg-neon-orange/15 text-neon-orange border border-neon-orange/40 shrink-0">
                        Pending
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 md:gap-y-2 text-xs md:text-sm font-body">
                      <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                        <User className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-foreground truncate">{r.guest_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-foreground truncate">{r.guest_email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-foreground truncate">{r.guest_phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-foreground truncate">
                          {new Date(r.preferred_date).toLocaleDateString()}
                          {r.preferred_time && ` • ${r.preferred_time}`}
                        </span>
                      </div>
                      {r.location && (
                        <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-foreground truncate">{r.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-foreground truncate">
                          Requested {new Date(r.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {r.special_requests && (
                      <div className="mt-3 p-2.5 md:p-3 rounded-lg bg-muted/30 border border-border/40">
                        <p className="text-[9px] md:text-[10px] font-ui uppercase tracking-widest text-muted-foreground mb-1">
                          Special requests
                        </p>
                        <p className="text-xs md:text-sm font-body text-foreground break-words">{r.special_requests}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 lg:min-w-[180px] pt-3 lg:pt-0 border-t lg:border-t-0 border-border/30">
                    <div className="text-left lg:text-right">
                      <p className="text-[9px] md:text-[10px] font-ui uppercase tracking-widest text-muted-foreground">
                        Total ({r.quantity}× {formatPrice(Number(r.unit_price))})
                      </p>
                      <p className="font-display text-lg md:text-xl font-bold gradient-neon-text">
                        {formatPrice(Number(r.total_price))}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(r.id, "rejected")}
                        disabled={isActing}
                        className="px-3 md:px-4 py-2 rounded-lg font-ui text-[11px] md:text-xs uppercase tracking-widest border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                      <button
                        onClick={() => updateStatus(r.id, "confirmed")}
                        disabled={isActing}
                        className="px-3 md:px-4 py-2 rounded-lg font-ui text-[11px] md:text-xs uppercase tracking-widest gradient-neon text-primary-foreground hover:scale-105 transition-transform disabled:opacity-50 flex items-center justify-center gap-1.5"
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
      )}
    </>
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

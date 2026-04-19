import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RequireSuperAdmin } from "@/components/admin/RequireRole";
import { useCurrency } from "@/hooks/useCurrency";
import { Loader2, Search } from "lucide-react";

type UnifiedRow = {
  id: string;
  source: "Hotel" | "Experience";
  title: string;
  guest: string;
  email: string;
  date: string;
  total: number;
  status: string;
  created_at: string;
};

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    pending: "bg-neon-orange/15 text-neon-orange border-neon-orange/40",
    confirmed: "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/40",
    rejected: "bg-destructive/15 text-destructive border-destructive/40",
    cancelled: "bg-muted text-muted-foreground border-border",
  };
  return map[status] ?? "bg-muted text-muted-foreground border-border";
};

const AdminBookingsInner = () => {
  const { formatPrice } = useCurrency();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  const { data: bookings, isLoading: l1 } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("id,hotel_name,guest_name,guest_email,check_in,total,status,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: reservations, isLoading: l2 } = useQuery({
    queryKey: ["admin-reservations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experience_reservations")
        .select(
          "id,experience_title,guest_name,guest_email,preferred_date,total_price,status,created_at"
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const rows: UnifiedRow[] = useMemo(() => {
    const b: UnifiedRow[] = (bookings ?? []).map((x) => ({
      id: x.id,
      source: "Hotel",
      title: x.hotel_name,
      guest: x.guest_name,
      email: x.guest_email,
      date: x.check_in,
      total: Number(x.total),
      status: x.status,
      created_at: x.created_at,
    }));
    const r: UnifiedRow[] = (reservations ?? []).map((x) => ({
      id: x.id,
      source: "Experience",
      title: x.experience_title,
      guest: x.guest_name,
      email: x.guest_email,
      date: x.preferred_date,
      total: Number(x.total_price),
      status: x.status,
      created_at: x.created_at,
    }));
    return [...b, ...r].sort(
      (a, z) => new Date(z.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [bookings, reservations]);

  const filtered = rows.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (sourceFilter !== "all" && r.source !== sourceFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !r.title.toLowerCase().includes(q) &&
        !r.guest.toLowerCase().includes(q) &&
        !r.email.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const isLoading = l1 || l2;

  return (
    <>
      <div className="glass rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by guest, email, or listing…"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-background/50 border border-border/40 font-body text-sm focus:outline-none focus:border-primary/60"
          />
        </div>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-background/50 border border-border/40 font-ui text-sm uppercase tracking-wider"
        >
          <option value="all">All sources</option>
          <option value="Hotel">Hotels</option>
          <option value="Experience">Experiences</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-background/50 border border-border/40 font-ui text-sm uppercase tracking-wider"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neon-cyan" />
        </div>
      ) : (
        <div className="glass rounded-xl overflow-hidden neon-border-blue">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 border-b border-border/40">
                <tr className="text-left font-ui text-[10px] uppercase tracking-widest text-muted-foreground">
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Listing</th>
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-muted-foreground font-body"
                    >
                      No bookings match the current filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr
                      key={`${r.source}-${r.id}`}
                      className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-ui uppercase tracking-wider border ${
                            r.source === "Hotel"
                              ? "text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10"
                              : "text-neon-pink border-neon-pink/40 bg-neon-pink/10"
                          }`}
                        >
                          {r.source}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-body text-foreground max-w-[200px] truncate">
                        {r.title}
                      </td>
                      <td className="px-4 py-3 font-body">
                        <div className="text-foreground">{r.guest}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                          {r.email}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-body text-muted-foreground whitespace-nowrap">
                        {new Date(r.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-display font-bold text-right text-foreground whitespace-nowrap">
                        {formatPrice(r.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-ui uppercase tracking-wider border ${statusBadge(
                            r.status
                          )}`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

const AdminBookings = () => (
  <RequireSuperAdmin>
    <AdminLayout title="All Bookings" subtitle="Unified view of hotel bookings and experience reservations">
      <AdminBookingsInner />
    </AdminLayout>
  </RequireSuperAdmin>
);

export default AdminBookings;

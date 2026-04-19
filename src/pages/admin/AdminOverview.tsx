import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RequireSuperAdmin } from "@/components/admin/RequireRole";
import { CalendarCheck, DollarSign, Inbox, Users, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCurrency } from "@/hooks/useCurrency";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent: string;
}

const KpiCard = ({ label, value, icon: Icon, accent }: KpiCardProps) => (
  <div className={`glass rounded-xl p-3 md:p-5 border ${accent} transition-all hover:scale-[1.02]`}>
    <div className="flex items-center justify-between mb-2 md:mb-3">
      <span className="font-ui text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground leading-tight">
        {label}
      </span>
      <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-neon-cyan shrink-0" />
    </div>
    <p className="font-display text-lg md:text-3xl font-bold text-foreground leading-tight break-words">{value}</p>
  </div>
);

const AdminOverviewInner = () => {
  const { formatPrice } = useCurrency();

  const { data: bookings } = useQuery({
    queryKey: ["admin-bookings-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("id,total,created_at,category,status");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: reservations } = useQuery({
    queryKey: ["admin-reservations-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experience_reservations")
        .select("id,total_price,created_at,status,experience_type");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: usersCount } = useQuery({
    queryKey: ["admin-profiles-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  const totalBookings = (bookings?.length ?? 0) + (reservations?.length ?? 0);
  const totalRevenue =
    (bookings?.reduce((sum, b) => sum + Number(b.total ?? 0), 0) ?? 0) +
    (reservations?.reduce((sum, r) => sum + Number(r.total_price ?? 0), 0) ?? 0);
  const pendingCount = reservations?.filter((r) => r.status === "pending").length ?? 0;

  // Last 7 days chart data
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const chartData = days.map((day) => {
    const label = new Date(day).toLocaleDateString("en", { weekday: "short" });
    const hotelCount =
      bookings?.filter((b) => b.created_at?.slice(0, 10) === day).length ?? 0;
    const expCount =
      reservations?.filter((r) => r.created_at?.slice(0, 10) === day).length ?? 0;
    return { day: label, Hotels: hotelCount, Experiences: expCount };
  });

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Total Bookings"
          value={totalBookings}
          icon={CalendarCheck}
          accent="neon-border-blue"
        />
        <KpiCard
          label="Revenue"
          value={formatPrice(totalRevenue)}
          icon={DollarSign}
          accent="neon-border-pink"
        />
        <KpiCard
          label="Pending Approvals"
          value={pendingCount}
          icon={Inbox}
          accent="neon-border-pink"
        />
        <KpiCard
          label="Registered Users"
          value={usersCount ?? 0}
          icon={Users}
          accent="neon-border-blue"
        />
      </div>

      <div className="glass rounded-xl p-6 neon-border-blue">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-neon-cyan" />
          <h2 className="font-display text-lg font-semibold text-foreground">
            Bookings — Last 7 days
          </h2>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="Hotels" fill="hsl(180 100% 55%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Experiences" fill="hsl(320 100% 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

const AdminOverview = () => (
  <RequireSuperAdmin>
    <AdminLayout title="Overview" subtitle="Platform performance at a glance">
      <AdminOverviewInner />
    </AdminLayout>
  </RequireSuperAdmin>
);

export default AdminOverview;

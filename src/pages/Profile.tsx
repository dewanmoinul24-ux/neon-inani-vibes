import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Calendar,
  Users,
  Loader2,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  CreditCard,
  Settings as SettingsIcon,
  Heart,
  Bell,
  Globe,
  Trash2,
  CheckCircle2,
  XCircle,
  Mail,
  Phone as PhoneIcon,
  MapPin,
  ChevronRight,
  Star,
  Sparkles,
  Hotel as HotelIcon,
  Car as CarIcon,
  Ticket,
  Clock as ClockIcon,
  Download,
  Hash,
  CircleDot,
  Wallet,
  CreditCard as CreditCardIcon,
} from "lucide-react";
import { format, isAfter, parseISO } from "date-fns";
import { addMinutes, formatDistanceToNowStrict } from "date-fns";
import { useCurrency } from "@/hooks/useCurrency";
import { CURRENCY_LABEL } from "@/lib/currency";
import { countCompletedTrips, getVibesTier } from "@/lib/vibesLevel";
import VibesLevelCard from "@/components/VibesLevelCard";
import { downloadReceiptPdf, buildReferenceCode } from "@/lib/receipt";

interface Booking {
  id: string;
  hotel_name: string;
  check_in: string;
  check_out: string;
  guests: number;
  total: number;
  status: string;
  created_at: string;
  category?: string;
}

interface ExperienceReservation {
  id: string;
  experience_id: string;
  experience_title: string;
  experience_type: string;
  category: string | null;
  organizer: string | null;
  location: string | null;
  preferred_date: string;
  preferred_time: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: string;
  special_requests: string | null;
  created_at: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  payment_status?: string | null;
  paid_at?: string | null;
  payment_method?: string | null;
}

type SectionKey =
  | "personal"
  | "security"
  | "payment"
  | "preferences"
  | "vibes"
  | "upcoming"
  | "history"
  | "reservations"
  | "saved"
  | "reviews"
  | "notifications";

const sections: {
  key: SectionKey;
  label: string;
  icon: React.ElementType;
  group: "manage" | "trips";
}[] = [
  { key: "personal", label: "Personal details", icon: UserIcon, group: "manage" },
  { key: "security", label: "Security", icon: ShieldCheck, group: "manage" },
  { key: "payment", label: "Payment methods", icon: CreditCard, group: "manage" },
  { key: "preferences", label: "Preferences", icon: SettingsIcon, group: "manage" },
  { key: "notifications", label: "Email notifications", icon: Bell, group: "manage" },
  { key: "vibes", label: "Vibes Level", icon: Sparkles, group: "trips" },
  { key: "upcoming", label: "Upcoming trips", icon: Calendar, group: "trips" },
  { key: "reservations", label: "My reservations", icon: Ticket, group: "trips" },
  { key: "history", label: "Trip history", icon: Calendar, group: "trips" },
  { key: "saved", label: "Saved", icon: Heart, group: "trips" },
  { key: "reviews", label: "My reviews", icon: Star, group: "trips" },
];

const Profile = () => {
  const { user, profile, loading, refreshProfile, signOut } = useAuth();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = (searchParams.get("tab") as SectionKey) || "personal";
  const [active, setActive] = useState<SectionKey>(initialTab);

  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [reservations, setReservations] = useState<ExperienceReservation[]>([]);
  const [reservationsLoading, setReservationsLoading] = useState(true);

  // Notification prefs (local-only for now)
  const [notif, setNotif] = useState({
    deals: true,
    bookingUpdates: true,
    newsletter: false,
  });

  useEffect(() => {
    if (!loading && !user) navigate("/");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  useEffect(() => {
    setSearchParams({ tab: active }, { replace: true });
  }, [active, setSearchParams]);

  const loadBookings = async () => {
    if (!user) return;
    setBookingsLoading(true);
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("check_in", { ascending: false });
    setBookings((data as Booking[]) || []);
    setBookingsLoading(false);
  };

  const loadReservations = async () => {
    if (!user) return;
    setReservationsLoading(true);
    const { data } = await supabase
      .from("experience_reservations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setReservations((data as ExperienceReservation[]) || []);
    setReservationsLoading(false);
  };

  useEffect(() => {
    if (user) {
      loadBookings();
      loadReservations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, phone })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Failed to update profile");
      return;
    }
    toast.success("Profile updated");
    refreshProfile();
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset email sent — check your inbox.");
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Cancel this booking? This action cannot be undone.")) return;
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id);
    if (error) {
      toast.error("Could not cancel booking");
      return;
    }
    toast.success("Booking cancelled");
    loadBookings();
  };

  const handleCancelReservation = async (id: string) => {
    if (!confirm("Cancel this reservation request?")) return;
    const { error } = await supabase
      .from("experience_reservations")
      .update({ status: "cancelled" })
      .eq("id", id);
    if (error) {
      toast.error("Could not cancel reservation");
      return;
    }
    toast.success("Reservation cancelled");
    loadReservations();
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/");
  };

  const today = new Date();
  const { upcoming, history } = useMemo(() => {
    const u: Booking[] = [];
    const h: Booking[] = [];
    bookings.forEach((b) => {
      if (b.status !== "cancelled" && isAfter(parseISO(b.check_out), today)) u.push(b);
      else h.push(b);
    });
    return { upcoming: u, history: h };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings]);

  const completedTrips = useMemo(() => countCompletedTrips(bookings), [bookings]);
  const vibesTier = useMemo(() => getVibesTier(completedTrips), [completedTrips]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = (profile?.display_name || user.email || "U").slice(0, 2).toUpperCase();
  const memberSince = user.created_at ? format(parseISO(user.created_at), "MMMM yyyy") : "—";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
        {/* Header strip */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 mb-8">
          <Avatar className="w-20 h-20 border-2 border-primary/60 neon-glow-pink">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-muted text-xl font-display">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="font-display text-2xl md:text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {profile?.display_name || "Traveler"}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground font-ui mt-1">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{user.email}</span>
              <span>Member since {memberSince}</span>
              <Badge
                variant="outline"
                className="border-neon-cyan/40 text-neon-cyan cursor-pointer hover:bg-neon-cyan/10"
                onClick={() => setActive("vibes")}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Vibes Level {vibesTier.level} · {vibesTier.name}
              </Badge>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="border-destructive/40 text-destructive hover:bg-destructive/10">
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="md:sticky md:top-24 self-start">
            <Card className="glass-strong border-primary/20 p-2">
              <SidebarGroup label="Manage account">
                {sections
                  .filter((s) => s.group === "manage")
                  .map((s) => (
                    <SidebarItem
                      key={s.key}
                      label={s.label}
                      Icon={s.icon}
                      active={active === s.key}
                      onClick={() => setActive(s.key)}
                    />
                  ))}
              </SidebarGroup>
              <SidebarGroup label="My trips">
                {sections
                  .filter((s) => s.group === "trips")
                  .map((s) => (
                    <SidebarItem
                      key={s.key}
                      label={s.label}
                      Icon={s.icon}
                      active={active === s.key}
                      onClick={() => setActive(s.key)}
                      badge={
                        s.key === "upcoming"
                          ? upcoming.length
                          : s.key === "history"
                          ? history.length
                          : s.key === "reservations"
                          ? reservations.filter((r) => r.status !== "cancelled").length
                          : undefined
                      }
                    />
                  ))}
              </SidebarGroup>
            </Card>
          </aside>

          {/* Content */}
          <section className="min-w-0">
            {active === "personal" && (
              <SectionShell
                title="Personal details"
                description="Update your info so we can personalise your trips and bookings."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Full name">
                    <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={100} />
                  </Field>
                  <Field label="Email address">
                    <Input value={user.email || ""} disabled />
                  </Field>
                  <Field label="Phone number">
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} placeholder="+880..." />
                  </Field>
                  <Field label="Country / Region">
                    <Input defaultValue="Bangladesh" disabled />
                  </Field>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={saving} className="gradient-neon text-primary-foreground">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save changes"}
                  </Button>
                </div>
              </SectionShell>
            )}

            {active === "security" && (
              <SectionShell
                title="Security"
                description="Keep your account safe — update your password regularly."
              >
                <Row icon={ShieldCheck} title="Password" description="Reset via email link.">
                  <Button variant="outline" onClick={handleResetPassword}>Send reset email</Button>
                </Row>
                <Row icon={Mail} title="Email verified" description="Used for sign-in & booking confirmations.">
                  <Badge className="bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                  </Badge>
                </Row>
                <Row icon={Trash2} title="Delete account" description="Permanently remove your account and data." danger>
                  <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10" onClick={() => toast.info("Contact support to delete your account.")}>
                    Request deletion
                  </Button>
                </Row>
              </SectionShell>
            )}

            {active === "payment" && (
              <SectionShell
                title="Payment methods"
                description="Save a card for faster checkout. Cards are stored securely."
              >
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                  <CreditCard className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="font-ui text-foreground mb-1">No payment methods saved</p>
                  <p className="text-sm text-muted-foreground font-body mb-4">
                    Add a card to skip filling in details every time you book.
                  </p>
                  <Button className="gradient-neon text-primary-foreground" onClick={() => toast.info("Card management coming soon.")}>
                    Add a card
                  </Button>
                </div>
              </SectionShell>
            )}

            {active === "preferences" && (
              <SectionShell
                title="Preferences"
                description="Pick the currency and language you'd like to see across the site."
              >
                <Field label="Currency">
                  <Select value={currency} onValueChange={(v) => setCurrency(v as "BDT" | "USD")}>
                    <SelectTrigger className="max-w-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BDT">৳ {CURRENCY_LABEL.BDT}</SelectItem>
                      <SelectItem value="USD">$ {CURRENCY_LABEL.USD}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1.5 font-ui">
                    All prices across hotels, vehicles & checkout will display in this currency.
                  </p>
                </Field>
                <Field label="Language">
                  <Select defaultValue="en" onValueChange={() => toast.info("Bangla coming soon.")}>
                    <SelectTrigger className="max-w-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">
                        <Globe className="w-3.5 h-3.5 inline mr-2" /> English
                      </SelectItem>
                      <SelectItem value="bn">
                        <Globe className="w-3.5 h-3.5 inline mr-2" /> বাংলা (coming soon)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </SectionShell>
            )}

            {active === "notifications" && (
              <SectionShell
                title="Email notifications"
                description="Choose what we email you about."
              >
                <NotifRow
                  title="Booking updates"
                  description="Confirmations, reminders, and changes to your trips."
                  checked={notif.bookingUpdates}
                  onChange={(v) => setNotif({ ...notif, bookingUpdates: v })}
                />
                <NotifRow
                  title="Deals & offers"
                  description="Personalised hotel & vehicle deals along Marine Drive."
                  checked={notif.deals}
                  onChange={(v) => setNotif({ ...notif, deals: v })}
                />
                <NotifRow
                  title="Newsletter"
                  description="Travel guides and stories from Cox's Bazar — monthly."
                  checked={notif.newsletter}
                  onChange={(v) => setNotif({ ...notif, newsletter: v })}
                />
              </SectionShell>
            )}

            {active === "vibes" && (
              <SectionShell
                title="Vibes Level"
                description="Earn perks the more you travel with InaniVibes — every completed trip moves you up."
              >
                <VibesLevelCard completedTrips={completedTrips} />
              </SectionShell>
            )}

            {active === "upcoming" && (
              <SectionShell title="Upcoming trips" description="Your confirmed bookings ahead.">
                <BookingList
                  bookings={upcoming}
                  loading={bookingsLoading}
                  formatPrice={formatPrice}
                  emptyText="No upcoming trips. Time to plan your next escape!"
                  emptyCta={
                    <Button className="gradient-neon text-primary-foreground" onClick={() => navigate("/hotels")}>
                      Browse hotels
                    </Button>
                  }
                  onCancel={handleCancelBooking}
                  showCancel
                />
              </SectionShell>
            )}

            {active === "reservations" && (
              <SectionShell
                title="My reservations"
                description="Your event tickets and adventure session requests. The Inani Vibes & event teams will confirm shortly."
              >
                <ReservationList
                  reservations={reservations}
                  loading={reservationsLoading}
                  formatPrice={formatPrice}
                  onCancel={handleCancelReservation}
                  onBrowse={() => navigate("/experiences")}
                />
              </SectionShell>
            )}

            {active === "history" && (
              <SectionShell title="Trip history" description="Past and cancelled bookings.">
                <BookingList
                  bookings={history}
                  loading={bookingsLoading}
                  formatPrice={formatPrice}
                  emptyText="No past trips yet."
                />
              </SectionShell>
            )}

            {active === "saved" && (
              <SectionShell title="Saved" description="Properties you bookmarked for later.">
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                  <Heart className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="font-ui text-foreground mb-1">Nothing saved yet</p>
                  <p className="text-sm text-muted-foreground font-body mb-4">
                    Tap the heart on any hotel to save it for later.
                  </p>
                  <Button variant="outline" onClick={() => navigate("/hotels")}>Explore hotels</Button>
                </div>
              </SectionShell>
            )}

            {active === "reviews" && (
              <SectionShell title="My reviews" description="Reviews you've left after your stays.">
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                  <Star className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="font-ui text-foreground mb-1">No reviews yet</p>
                  <p className="text-sm text-muted-foreground font-body">
                    After your stay, you'll be able to share how it went.
                  </p>
                </div>
              </SectionShell>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

/* ---------- Sub-components ---------- */

const SidebarGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="py-2">
    <p className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground font-ui">
      {label}
    </p>
    <div className="flex flex-col">{children}</div>
  </div>
);

const SidebarItem = ({
  label,
  Icon,
  active,
  onClick,
  badge,
}: {
  label: string;
  Icon: React.ElementType;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-ui transition-all text-left ${
      active
        ? "bg-primary/15 text-primary border border-primary/30"
        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
    }`}
  >
    <Icon className="w-4 h-4 shrink-0" />
    <span className="flex-1 truncate">{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
        {badge}
      </span>
    )}
    <ChevronRight className="w-3.5 h-3.5 opacity-40" />
  </button>
);

const SectionShell = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <Card className="p-6 md:p-8 glass-strong border-primary/20">
    <div className="mb-6">
      <h2 className="font-display text-xl md:text-2xl text-foreground">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground font-body mt-1">{description}</p>
      )}
    </div>
    <div className="space-y-4">{children}</div>
  </Card>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <Label className="text-xs uppercase tracking-widest text-muted-foreground font-ui mb-1.5 block">
      {label}
    </Label>
    {children}
  </div>
);

const Row = ({
  icon: Icon,
  title,
  description,
  children,
  danger,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
  danger?: boolean;
}) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
    <div className="flex items-start gap-3 min-w-0">
      <Icon className={`w-5 h-5 mt-0.5 ${danger ? "text-destructive" : "text-neon-cyan"}`} />
      <div className="min-w-0">
        <p className="font-ui text-sm text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground font-body">{description}</p>
      </div>
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const NotifRow = ({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
    <div>
      <p className="font-ui text-sm text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground font-body">{description}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

type BookingFilter = "all" | "hotel" | "vehicle";

const BookingList = ({
  bookings,
  loading,
  formatPrice,
  emptyText,
  emptyCta,
  onCancel,
  showCancel,
}: {
  bookings: Booking[];
  loading: boolean;
  formatPrice: (n: number) => string;
  emptyText: string;
  emptyCta?: React.ReactNode;
  onCancel?: (id: string) => void;
  showCancel?: boolean;
}) => {
  const [filter, setFilter] = useState<BookingFilter>("all");

  const counts = useMemo(
    () => ({
      all: bookings.length,
      hotel: bookings.filter((b) => (b.category ?? "hotel") === "hotel").length,
      vehicle: bookings.filter((b) => b.category === "vehicle").length,
    }),
    [bookings]
  );

  const filtered = useMemo(
    () =>
      filter === "all"
        ? bookings
        : bookings.filter((b) => (b.category ?? "hotel") === filter),
    [bookings, filter]
  );

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );

  const chips: { key: BookingFilter; label: string; Icon: React.ElementType }[] = [
    { key: "all", label: "All", Icon: Calendar },
    { key: "hotel", label: "Hotels", Icon: HotelIcon },
    { key: "vehicle", label: "Vehicles", Icon: CarIcon },
  ];

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        {chips.map(({ key, label, Icon }) => {
          const isActive = filter === key;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-ui uppercase tracking-widest border transition-colors ${
                isActive
                  ? "bg-primary/15 text-primary border-primary/40"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
              <span
                className={`ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <Calendar className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground font-ui mb-4">
            {filter === "all"
              ? emptyText
              : `No ${filter === "hotel" ? "hotel" : "vehicle"} bookings here.`}
          </p>
          {filter === "all" && emptyCta}
        </div>
      ) : (
        <BookingListItems
          bookings={filtered}
          formatPrice={formatPrice}
          onCancel={onCancel}
          showCancel={showCancel}
        />
      )}
    </>
  );
};

const BookingListItems = ({
  bookings,
  formatPrice,
  onCancel,
  showCancel,
}: {
  bookings: Booking[];
  formatPrice: (n: number) => string;
  onCancel?: (id: string) => void;
  showCancel?: boolean;
}) => {
  return (
    <div className="grid gap-3">
      {bookings.map((b) => {
        const cancelled = b.status === "cancelled";
        const isVehicle = b.category === "vehicle";
        const TypeIcon = isVehicle ? CarIcon : HotelIcon;
        return (
          <Card
            key={b.id}
            className="p-5 border-border hover:border-primary/40 transition-colors bg-card/40"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <Badge
                    variant="outline"
                    className={
                      isVehicle
                        ? "border-neon-pink/40 text-neon-pink"
                        : "border-neon-cyan/40 text-neon-cyan"
                    }
                  >
                    <TypeIcon className="w-3 h-3 mr-1" />
                    {isVehicle ? "Vehicle" : "Hotel"}
                  </Badge>
                  <h3 className="font-display text-base truncate">{b.hotel_name}</h3>
                  {cancelled ? (
                    <Badge variant="outline" className="border-destructive/40 text-destructive">
                      <XCircle className="w-3 h-3 mr-1" /> Cancelled
                    </Badge>
                  ) : (
                    <Badge className="bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Confirmed
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground font-ui">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {isVehicle ? "Pickup " : ""}
                    {format(parseISO(b.check_in), "MMM d")} – {format(parseISO(b.check_out), "MMM d, yyyy")}
                  </span>
                  {!isVehicle && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {b.guests} guest{b.guests > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 md:flex-col md:items-end">
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground font-ui uppercase tracking-widest">
                    Total
                  </p>
                  <p className="font-display text-lg text-primary">{formatPrice(b.total)}</p>
                </div>
                {showCancel && !cancelled && onCancel && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive/40 text-destructive hover:bg-destructive/10"
                    onClick={() => onCancel(b.id)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

const ReservationList = ({
  reservations,
  loading,
  formatPrice,
  onCancel,
  onBrowse,
}: {
  reservations: ExperienceReservation[];
  loading: boolean;
  formatPrice: (n: number) => string;
  onCancel: (id: string) => void;
  onBrowse: () => void;
}) => {
  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );

  if (reservations.length === 0)
    return (
      <div className="text-center py-12 border border-dashed border-border rounded-xl">
        <Ticket className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
        <p className="font-ui text-foreground mb-1">No reservation requests yet</p>
        <p className="text-sm text-muted-foreground font-body mb-4">
          Reserve a session or grab a ticket to an event — it'll show up here.
        </p>
        <Button className="gradient-neon text-primary-foreground" onClick={onBrowse}>
          Browse experiences
        </Button>
      </div>
    );

  return (
    <div className="grid gap-3">
      {reservations.map((r) => {
        const isEvent = r.experience_type === "event";
        const statusBadge = (() => {
          switch (r.status) {
            case "confirmed":
              return (
                <Badge className="bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Confirmed
                </Badge>
              );
            case "rejected":
              return (
                <Badge variant="outline" className="border-destructive/40 text-destructive">
                  <XCircle className="w-3 h-3 mr-1" /> Rejected
                </Badge>
              );
            case "cancelled":
              return (
                <Badge variant="outline" className="border-muted-foreground/40 text-muted-foreground">
                  <XCircle className="w-3 h-3 mr-1" /> Cancelled
                </Badge>
              );
            default:
              return (
                <Badge className="bg-neon-orange/15 text-neon-orange border-neon-orange/30 animate-pulse">
                  <ClockIcon className="w-3 h-3 mr-1" /> Pending confirmation
                </Badge>
              );
          }
        })();

        return (
          <Card
            key={r.id}
            className="p-5 border-border hover:border-primary/40 transition-colors bg-card/40"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <Badge
                    variant="outline"
                    className={
                      isEvent
                        ? "border-neon-pink/40 text-neon-pink"
                        : "border-neon-cyan/40 text-neon-cyan"
                    }
                  >
                    <Ticket className="w-3 h-3 mr-1" />
                    {isEvent ? "Event" : "Adventure"}
                  </Badge>
                  <h3 className="font-display text-base truncate">{r.experience_title}</h3>
                  {statusBadge}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground font-ui">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(parseISO(r.preferred_date), "MMM d, yyyy")}
                    {r.preferred_time ? ` · ${r.preferred_time}` : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {r.quantity} {isEvent ? "ticket" : "rider"}
                    {r.quantity > 1 ? "s" : ""}
                  </span>
                  {r.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {r.location}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] font-ui text-muted-foreground">
                  <Hash className="w-3 h-3 text-neon-cyan" />
                  <span className="uppercase tracking-widest">Ref</span>
                  <span className="font-mono text-foreground tracking-wider">
                    {buildReferenceCode(r.id)}
                  </span>
                </div>
                <ReservationTimeline status={r.status} createdAt={r.created_at} organizer={r.organizer} />
                <ReservationPayment reservation={r} formatPrice={formatPrice} />
              </div>
              <div className="flex items-center gap-3 md:flex-col md:items-end">
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground font-ui uppercase tracking-widest">
                    Total
                  </p>
                  <p className="font-display text-lg text-primary">{formatPrice(r.total_price)}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10"
                  onClick={() => {
                    downloadReceiptPdf({
                      referenceCode: buildReferenceCode(r.id),
                      experienceTitle: r.experience_title,
                      experienceType: r.experience_type,
                      category: r.category,
                      organizer: r.organizer,
                      location: r.location,
                      date: format(parseISO(r.preferred_date), "EEEE, MMMM d, yyyy"),
                      time: r.preferred_time,
                      quantity: r.quantity,
                      unitPrice: formatPrice(r.unit_price),
                      total: formatPrice(r.total_price),
                      guestName: r.guest_name || "—",
                      guestEmail: r.guest_email || "—",
                      guestPhone: r.guest_phone,
                      status: r.status,
                      createdAt: format(parseISO(r.created_at), "MMM d, yyyy · h:mm a"),
                      specialRequests: r.special_requests,
                    });
                  }}
                >
                  <Download className="w-3.5 h-3.5" /> Receipt
                </Button>
                {(r.status === "pending" || r.status === "confirmed") && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive/40 text-destructive hover:bg-destructive/10"
                    onClick={() => onCancel(r.id)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default Profile;

/* ---------- Reservation status timeline ---------- */

const ReservationTimeline = ({
  status,
  createdAt,
  organizer,
}: {
  status: string;
  createdAt: string;
  organizer: string | null;
}) => {
  const created = parseISO(createdAt);
  const expectedBy = addMinutes(created, 30);
  const now = new Date();
  const cancelled = status === "cancelled" || status === "rejected";
  const confirmed = status === "confirmed";

  const steps = [
    {
      key: "submitted",
      label: "Request submitted",
      sub: format(created, "MMM d · h:mm a"),
      done: true,
      active: false,
    },
    {
      key: "pending",
      label: cancelled ? "Cancelled" : "Pending confirmation",
      sub: cancelled
        ? "This request was closed."
        : confirmed
        ? "Confirmed by the team."
        : isAfter(now, expectedBy)
        ? `Expected within 30 min — running a little late`
        : `Expected by ${format(expectedBy, "h:mm a")} (${formatDistanceToNowStrict(expectedBy, { addSuffix: true })})`,
      done: confirmed || cancelled,
      active: !confirmed && !cancelled,
    },
    {
      key: "confirmed",
      label: confirmed ? "Confirmed" : "Awaiting confirmation",
      sub: confirmed
        ? `${organizer || "InaniVibes"} will share payment instructions next.`
        : `${organizer || "InaniVibes"} will email you to confirm.`,
      done: confirmed,
      active: false,
    },
  ];

  return (
    <ol className="mt-3 space-y-2.5 border-l border-border/60 pl-3.5 ml-1">
      {steps.map((s) => {
        const dotClass = cancelled && s.key !== "submitted"
          ? "bg-destructive/20 text-destructive border-destructive/40"
          : s.done
          ? "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/40"
          : s.active
          ? "bg-neon-orange/15 text-neon-orange border-neon-orange/40 animate-pulse"
          : "bg-muted text-muted-foreground border-border";
        const Icon = s.done ? CheckCircle2 : s.active ? CircleDot : ClockIcon;
        return (
          <li key={s.key} className="relative">
            <span
              className={`absolute -left-[19px] top-0.5 w-3.5 h-3.5 rounded-full border flex items-center justify-center ${dotClass}`}
            >
              <Icon className="w-2.5 h-2.5" />
            </span>
            <p className="text-xs font-ui text-foreground leading-tight">{s.label}</p>
            <p className="text-[11px] text-muted-foreground font-body leading-tight mt-0.5">
              {s.sub}
            </p>
          </li>
        );
      })}
    </ol>
  );
};

/* ---------- Reservation payment status ---------- */

const ReservationPayment = ({
  reservation,
  formatPrice,
}: {
  reservation: ExperienceReservation;
  formatPrice: (n: number) => string;
}) => {
  const cancelled = reservation.status === "cancelled" || reservation.status === "rejected";
  if (cancelled) return null;

  const paymentStatus = (reservation.payment_status || "unpaid") as
    | "unpaid"
    | "pending"
    | "paid";
  const reservationConfirmed = reservation.status === "confirmed";
  // Payment is "available" once the team has confirmed the reservation
  const paymentAvailable = reservationConfirmed && paymentStatus !== "paid";

  const config = (() => {
    if (paymentStatus === "paid") {
      return {
        label: "Paid",
        sub:
          reservation.paid_at
            ? `Received ${format(parseISO(reservation.paid_at), "MMM d, yyyy")}${
                reservation.payment_method ? ` · ${reservation.payment_method}` : ""
              }`
            : "Payment received — see you soon!",
        badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        Icon: CheckCircle2,
        accent: "border-emerald-500/30",
      };
    }
    if (paymentStatus === "pending") {
      return {
        label: "Payment processing",
        sub: "We're verifying your payment. This usually takes a few minutes.",
        badgeClass: "bg-neon-orange/15 text-neon-orange border-neon-orange/30 animate-pulse",
        Icon: ClockIcon,
        accent: "border-neon-orange/30",
      };
    }
    if (paymentAvailable) {
      return {
        label: "Pending payment",
        sub: "Your spot is confirmed. Complete payment to secure your booking.",
        badgeClass: "bg-neon-pink/15 text-neon-pink border-neon-pink/30",
        Icon: Wallet,
        accent: "border-neon-pink/30",
      };
    }
    return {
      label: "Pending payment",
      sub: "Payment opens once the team confirms your reservation.",
      badgeClass: "bg-muted text-muted-foreground border-border",
      Icon: Wallet,
      accent: "border-border",
    };
  })();

  const { Icon } = config;

  return (
    <div className={`mt-3 rounded-lg border ${config.accent} bg-card/60 p-3`}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2.5 min-w-0">
          <Icon className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={config.badgeClass}>
                {config.label}
              </Badge>
              <span className="text-xs text-muted-foreground font-ui">
                {formatPrice(reservation.total_price)}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-body leading-snug mt-1">
              {config.sub}
            </p>
          </div>
        </div>
        {paymentAvailable ? (
          <Button
            size="sm"
            className="gradient-neon text-primary-foreground font-ui text-xs uppercase tracking-widest neon-glow-pink hover:opacity-90"
            onClick={() =>
              toast.info("Online payment is coming soon — the team will share instructions by email.")
            }
          >
            <CreditCardIcon className="w-3.5 h-3.5" /> Pay now
          </Button>
        ) : paymentStatus === "unpaid" && !reservationConfirmed ? (
          <Button
            size="sm"
            variant="outline"
            disabled
            className="text-xs uppercase tracking-widest opacity-60"
          >
            <CreditCardIcon className="w-3.5 h-3.5" /> Pay (locked)
          </Button>
        ) : null}
      </div>
    </div>
  );
};

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar, MapPin, Users, Loader2, LogOut } from "lucide-react";
import { format, isAfter, parseISO } from "date-fns";

interface Booking {
  id: string;
  hotel_name: string;
  check_in: string;
  check_out: string;
  guests: number;
  total: number;
  status: string;
  created_at: string;
}

const Profile = () => {
  const { user, profile, loading, currency, setCurrency, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

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
    const loadBookings = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("check_in", { ascending: false });
      setBookings((data as Booking[]) || []);
      setBookingsLoading(false);
    };
    if (user) loadBookings();
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

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/");
  };

  const formatPrice = (bdt: number) => {
    if (currency === "USD") return `$${(bdt / 110).toFixed(2)}`;
    return `৳${bdt.toLocaleString()}`;
  };

  const today = new Date();
  const upcoming = bookings.filter((b) => isAfter(parseISO(b.check_in), today) || isAfter(parseISO(b.check_out), today));
  const past = bookings.filter((b) => !isAfter(parseISO(b.check_out), today));

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = (profile?.display_name || user.email || "U").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16 max-w-5xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10">
          <Avatar className="w-24 h-24 border-2 border-primary neon-glow-pink">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-muted text-2xl font-display">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="font-display text-3xl md:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {profile?.display_name || "Traveler"}
            </h1>
            <p className="text-muted-foreground font-ui">{user.email}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="border-destructive/50 text-destructive hover:bg-destructive/10">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">History</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <BookingList bookings={upcoming} loading={bookingsLoading} formatPrice={formatPrice} emptyText="No upcoming bookings yet. Time to plan your next escape!" />
          </TabsContent>

          <TabsContent value="past">
            <BookingList bookings={past} loading={bookingsLoading} formatPrice={formatPrice} emptyText="No past bookings." />
          </TabsContent>

          <TabsContent value="profile">
            <Card className="p-6 glass-strong border-primary/20">
              <h2 className="font-display text-xl mb-4">Edit Profile</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <Label>Display Name</Label>
                  <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={100} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} placeholder="+880..." />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={user.email || ""} disabled />
                </div>
                <Button onClick={handleSaveProfile} disabled={saving} className="gradient-neon text-primary-foreground">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6 glass-strong border-primary/20 max-w-md">
              <h2 className="font-display text-xl mb-4">Account Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label>Preferred Currency</Label>
                  <Select value={currency} onValueChange={(v) => setCurrency(v as "BDT" | "USD")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BDT">৳ BDT — Bangladeshi Taka</SelectItem>
                      <SelectItem value="USD">$ USD — US Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1 font-ui">All prices across the site will display in this currency.</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

const BookingList = ({ bookings, loading, formatPrice, emptyText }: { bookings: Booking[]; loading: boolean; formatPrice: (n: number) => string; emptyText: string }) => {
  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  if (bookings.length === 0) return <Card className="p-12 text-center glass-strong border-primary/20"><p className="text-muted-foreground font-ui">{emptyText}</p></Card>;
  return (
    <div className="grid gap-4">
      {bookings.map((b) => (
        <Card key={b.id} className="p-5 glass-strong border-primary/20 hover:border-primary/50 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-display text-lg">{b.hotel_name}</h3>
                <Badge variant={b.status === "confirmed" ? "default" : "secondary"} className="capitalize">{b.status}</Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-ui">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{format(parseISO(b.check_in), "MMM d")} – {format(parseISO(b.check_out), "MMM d, yyyy")}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" />{b.guests} guest{b.guests > 1 ? "s" : ""}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-ui uppercase tracking-widest">Total</p>
              <p className="font-display text-xl text-primary">{formatPrice(b.total)}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Profile;

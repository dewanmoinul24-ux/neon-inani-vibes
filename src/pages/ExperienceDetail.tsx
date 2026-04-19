import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Shirt,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Ticket,
  XCircle,
  Ban,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { getExperienceById } from "@/data/experiences";
import { useCurrency } from "@/hooks/useCurrency";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const formatEventDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const ExperienceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { formatPrice: format } = useCurrency();
  const { user, profile } = useAuth();

  const experience = useMemo(() => (id ? getExperienceById(id) : undefined), [id]);

  const [name, setName] = useState(profile?.display_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [quantity, setQuantity] = useState(1);
  const [preferredDate, setPreferredDate] = useState(experience?.date || "");
  const [preferredTime, setPreferredTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!experience) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20 text-center">
          <h1 className="font-display text-3xl mb-4">Experience not found</h1>
          <Button onClick={() => navigate("/experiences")}>Back to Experiences</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isEvent = experience.type === "event";
  const total = experience.priceBdt * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      toast({ title: "Missing details", description: "Please fill name, email and phone.", variant: "destructive" });
      return;
    }
    if (!isEvent && (!preferredDate || !preferredTime)) {
      toast({
        title: "Pick a slot",
        description: "Please select a preferred date and time for your session.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    // Reservation request only — UI confirmation, no DB persistence by design.
    setTimeout(() => {
      setSubmitting(false);
      toast({
        title: "Reservation requested! 🎉",
        description: `${experience.organizer} will confirm your spot via email within 30 minutes.`,
      });
    }, 700);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-16 md:pt-20">
        <div className="relative h-[45vh] md:h-[60vh] w-full overflow-hidden">
          <img
            src={experience.image}
            alt={experience.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/40 to-background" />

          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-10">
            <Link
              to="/experiences"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4 w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Experiences
            </Link>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-ui uppercase tracking-wider gradient-neon text-primary-foreground">
                {experience.category}
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-ui uppercase tracking-wider glass border border-neon-cyan/40 text-neon-cyan">
                {isEvent ? "Event" : "Adventure Sport"}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold gradient-neon-text max-w-4xl leading-tight py-[20px] lg:text-7xl">
              {experience.title}
            </h1>
            <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl">
              {experience.tagline}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick facts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <FactCard icon={<MapPin className="w-4 h-4" />} label="Location" value={experience.location} accent="pink" />
              {isEvent ? (
                <>
                  <FactCard icon={<Calendar className="w-4 h-4" />} label="Date" value={formatEventDate(experience.date!)} accent="cyan" />
                  <FactCard icon={<Clock className="w-4 h-4" />} label="Time" value={`${experience.startTime} – ${experience.endTime}`} accent="orange" />
                </>
              ) : (
                <>
                  <FactCard icon={<Clock className="w-4 h-4" />} label="Hours" value={experience.operatingHours!} accent="cyan" />
                  <FactCard icon={<Sparkles className="w-4 h-4" />} label="Duration" value={`${experience.durationMinutes} min`} accent="orange" />
                </>
              )}
              <FactCard
                icon={<Ticket className="w-4 h-4" />}
                label={isEvent ? "Ticket" : "Session"}
                value={format(experience.priceBdt)}
                accent="purple"
              />
            </div>

            {/* About */}
            <div className="glass rounded-xl p-6 border border-border/60">
              <h2 className="font-display text-2xl font-bold mb-3">About this {isEvent ? "event" : "experience"}</h2>
              <p className="text-muted-foreground leading-relaxed">{experience.description}</p>
              <a
                href={experience.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm text-neon-cyan hover:underline"
              >
                <MapPin className="w-4 h-4" /> View on Google Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Dress code & requirements */}
            <div className="grid md:grid-cols-2 gap-4">
              <InfoBlock
                icon={<Shirt className="w-4 h-4 text-neon-pink" />}
                title="Dress Code"
                items={experience.dressCode}
              />
              <InfoBlock
                icon={<ShieldCheck className="w-4 h-4 text-neon-cyan" />}
                title="Requirements"
                items={experience.requirements}
              />
            </div>

            {/* Do's & Don'ts */}
            <div className="grid md:grid-cols-2 gap-4">
              <InfoBlock
                icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                title="Do's"
                items={experience.dos}
                tone="positive"
              />
              <InfoBlock
                icon={<XCircle className="w-4 h-4 text-rose-400" />}
                title="Don'ts"
                items={experience.donts}
                tone="negative"
              />
            </div>

            {/* Restricted items */}
            <div className="glass rounded-xl p-6 border border-rose-500/30">
              <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-400" /> Restricted Items
              </h3>
              <div className="flex flex-wrap gap-2">
                {experience.restrictedItems.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 rounded-full text-xs bg-rose-500/10 border border-rose-500/30 text-rose-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Booking process */}
            <div className="glass rounded-xl p-6 border border-border/60">
              <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-neon-orange" /> Booking Process
              </h3>
              <ol className="space-y-3">
                {experience.bookingProcess.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 w-7 h-7 rounded-full gradient-neon text-primary-foreground font-display font-bold text-xs flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-sm text-muted-foreground pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right — booking form (sticky) */}
          <aside className="lg:col-span-1">
            <form
              onSubmit={handleSubmit}
              className="glass-strong rounded-xl p-6 border border-primary/40 lg:sticky lg:top-24 space-y-4"
            >
              <div>
                <p className="font-ui text-xs uppercase tracking-widest text-muted-foreground">
                  {isEvent ? "Reserve your ticket" : "Book a session"}
                </p>
                <p className="font-display text-3xl font-bold gradient-neon-text mt-1">
                  {format(experience.priceBdt)}
                  <span className="text-sm text-muted-foreground font-normal ml-1">
                    / {isEvent ? "ticket" : "session"}
                  </span>
                </p>
              </div>

              {!isEvent && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="date" className="text-xs">Preferred date *</Label>
                    <Input
                      id="date"
                      type="date"
                      required
                      min={new Date().toISOString().slice(0, 10)}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time" className="text-xs">Preferred time *</Label>
                    <Input
                      id="time"
                      type="time"
                      required
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="qty" className="text-xs">
                  {isEvent ? "Tickets" : "Riders / participants"}
                </Label>
                <Input
                  id="qty"
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>

              <div>
                <Label htmlFor="name" className="text-xs">Full name *</Label>
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <Label htmlFor="email" className="text-xs">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-xs">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  placeholder="+880 ..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="border-t border-border/60 pt-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-display text-2xl font-bold text-primary">{format(total)}</span>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full gradient-neon text-primary-foreground font-ui uppercase tracking-widest neon-glow-pink hover:opacity-90"
              >
                {submitting ? "Sending..." : "Request Reservation"}
              </Button>

              <div className="text-xs text-muted-foreground space-y-1.5 pt-1">
                <p className="flex items-center gap-2">
                  <Phone className="w-3 h-3" /> {experience.contactPhone}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Confirmation by email within 30 min
                </p>
                <p className="opacity-80">
                  Pay on arrival. Cash, card or bKash accepted.
                </p>
              </div>
            </form>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FactCard = ({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: "pink" | "cyan" | "orange" | "purple";
}) => {
  const colorMap = {
    pink: "text-neon-pink border-neon-pink/30",
    cyan: "text-neon-cyan border-neon-cyan/30",
    orange: "text-neon-orange border-neon-orange/30",
    purple: "text-neon-purple border-neon-purple/30",
  };
  return (
    <div className={`glass rounded-lg p-3 border ${colorMap[accent]}`}>
      <div className={`flex items-center gap-1.5 text-xs font-ui uppercase tracking-wider ${colorMap[accent]} mb-1`}>
        {icon} {label}
      </div>
      <p className="text-sm font-medium text-foreground line-clamp-2">{value}</p>
    </div>
  );
};

const InfoBlock = ({
  icon,
  title,
  items,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  tone?: "positive" | "negative";
}) => (
  <div className="glass rounded-xl p-6 border border-border/60">
    <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
      {icon} {title}
    </h3>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-muted-foreground">
          <span
            className={`shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full ${
              tone === "positive"
                ? "bg-emerald-400"
                : tone === "negative"
                  ? "bg-rose-400"
                  : "bg-primary"
            }`}
          />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default ExperienceDetail;

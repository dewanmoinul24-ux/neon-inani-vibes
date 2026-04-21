import { useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  ChevronLeft,
  Star,
  Languages,
  Clock,
  CalendarDays,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Camera,
  Compass,
} from "lucide-react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCurrency } from "@/hooks/useCurrency";
import { findExpertById, isDayAvailable, unavailableSlots } from "@/data/vibesExperts";
import BookingDialog from "@/components/vibes-experts/BookingDialog";
import { cn } from "@/lib/utils";

const accentTextMap = {
  cyan: "text-neon-cyan neon-text-cyan",
  pink: "text-neon-pink neon-text-pink",
  purple: "text-neon-purple",
} as const;

const accentBorderMap = {
  cyan: "neon-border-blue",
  pink: "neon-border-pink",
  purple: "neon-border-pink",
} as const;

const VibesExpertDetail = () => {
  const { id } = useParams<{ id: string }>();
  const expert = id ? findExpertById(id) : null;
  const { formatPrice } = useCurrency();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDuration, setBookingDuration] = useState<"hourly" | "daily">("daily");
  const [activeImage, setActiveImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  if (!expert) return <Navigate to="/vibes-experts" replace />;

  // Build a 14-day rolling window for availability calendar.
  const days = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 14 }, (_, i) => addDays(start, i));
  }, []);

  const taken = useMemo(
    () => unavailableSlots(expert.availabilitySeed, selectedDate, expert.timeSlots),
    [expert, selectedDate]
  );

  const TypeIcon = expert.type === "guide" ? Compass : Camera;
  const accentText = accentTextMap[expert.accent];
  const accentBorder = accentBorderMap[expert.accent];

  // Rating breakdown helpers
  const totalReviews = expert.reviewBreakdown.total;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-8">
          <Link
            to="/vibes-experts"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-ui text-xs sm:text-sm mb-4"
          >
            <ChevronLeft size={16} /> Back to Vibes Experts
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
            {/* Portrait + gallery */}
            <div className="space-y-3">
              <div className={cn("relative rounded-2xl overflow-hidden", accentBorder)}>
                <img
                  src={activeImage === 0 ? expert.portrait : expert.gallery[activeImage - 1]}
                  alt={expert.name}
                  className="w-full aspect-square object-cover"
                  width={800}
                  height={800}
                  fetchPriority="high"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass-strong border border-primary/40 font-ui text-[10px] uppercase tracking-widest text-foreground flex items-center gap-1.5">
                  <TypeIcon size={12} className={accentText} />
                  {expert.type === "guide" ? "Local Guide" : "Photographer"}
                </span>
              </div>
              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-2">
                {[expert.portrait, ...expert.gallery].map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "rounded-md overflow-hidden border transition-all",
                      activeImage === i ? "border-primary neon-glow-pink scale-[1.03]" : "border-border/60 opacity-70 hover:opacity-100"
                    )}
                  >
                    <img src={src} alt="" loading="lazy" className="w-full aspect-square object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Bio + key info */}
            <div className="space-y-4">
              <p className={cn("font-ui text-xs uppercase tracking-[0.3em]", accentText)}>
                {expert.tagline}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold gradient-neon-text leading-tight">
                {expert.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full glass border border-border">
                  <Star size={14} className="text-neon-pink fill-neon-pink" />
                  <span className="font-semibold text-foreground">{expert.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({expert.reviewCount} reviews)</span>
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full glass border border-border">
                  <ShieldCheck size={14} className="text-neon-cyan" />
                  <span className="text-foreground">{expert.experienceYears} yrs experience</span>
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full glass border border-border">
                  <Languages size={14} className="text-neon-purple" />
                  <span className="text-foreground">{expert.languages.join(" · ")}</span>
                </span>
              </div>
              <p className="text-muted-foreground font-body leading-relaxed">{expert.bio}</p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="glass rounded-lg p-3 border border-border/60">
                  <p className="text-[10px] font-ui uppercase tracking-widest text-muted-foreground">
                    Per hour
                  </p>
                  <p className="font-display text-xl font-bold text-foreground">
                    {formatPrice(expert.pricePerHour)}
                  </p>
                </div>
                <div className="glass rounded-lg p-3 border border-border/60">
                  <p className="text-[10px] font-ui uppercase tracking-widest text-muted-foreground">
                    Full day (8h)
                  </p>
                  <p className="font-display text-xl font-bold text-foreground">
                    {formatPrice(expert.pricePerDay)}
                  </p>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setBookingDuration("daily");
                    setBookingOpen(true);
                  }}
                  className="px-6 py-3 rounded-lg font-ui text-sm uppercase tracking-widest gradient-neon text-primary-foreground neon-glow-pink transition-transform hover:scale-105 flex items-center gap-2"
                >
                  <Sparkles size={14} /> Book full day
                </button>
                <button
                  onClick={() => {
                    setBookingDuration("hourly");
                    setBookingOpen(true);
                  }}
                  className="px-6 py-3 rounded-lg font-ui text-sm uppercase tracking-widest glass border border-border/60 text-foreground transition-all hover:scale-105 hover:gradient-neon hover:text-primary-foreground hover:neon-glow-pink hover:border-transparent"
                >
                  <Clock size={14} className="inline mr-1.5 -mt-0.5" /> Hourly
                </button>
              </div>
              <p className="text-xs text-muted-foreground font-ui">
                {expert.bookingAdvance}% advance required · Free cancellation up to 24h before
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <h2 className="font-display text-2xl sm:text-3xl font-bold gradient-neon-text mb-6">
          Services & packages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {expert.services.map((s) => (
            <div
              key={s.name}
              className="glass rounded-xl p-5 border border-border/60 hover:border-primary/60 transition-colors flex flex-col"
            >
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">{s.name}</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4 flex-1">
                {s.description}
              </p>
              <div className="flex items-end justify-between">
                <p className="font-display text-xl font-bold text-foreground">
                  {formatPrice(s.price)}
                  <span className="text-xs text-muted-foreground font-ui ml-1">
                    {s.unit === "package" ? "" : `/ ${s.unit}`}
                  </span>
                </p>
                <button
                  onClick={() => {
                    setBookingDuration(s.unit === "hour" ? "hourly" : "daily");
                    setBookingOpen(true);
                  }}
                  className="text-xs font-ui uppercase tracking-widest text-neon-cyan neon-text-cyan hover:text-foreground transition-colors"
                >
                  Book →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Availability */}
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <h2 className="font-display text-2xl sm:text-3xl font-bold gradient-neon-text mb-2">
          Pick an available slot
        </h2>
        <p className="text-sm text-muted-foreground font-body mb-6">
          Two-week rolling availability · times in Bangladesh standard time
        </p>

        {/* Day picker */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {days.map((d) => {
            const available = isDayAvailable(expert.availabilitySeed, d);
            const isSelected = isSameDay(d, selectedDate);
            return (
              <button
                key={d.toISOString()}
                disabled={!available}
                onClick={() => setSelectedDate(d)}
                className={cn(
                  "rounded-lg p-2 text-center transition-all border",
                  !available && "opacity-40 cursor-not-allowed glass border-border/40",
                  available && isSelected && "gradient-neon text-primary-foreground neon-glow-pink border-transparent",
                  available && !isSelected && "glass border-border/60 text-foreground hover:border-primary/60"
                )}
              >
                <p className="text-[10px] font-ui uppercase tracking-widest opacity-80">
                  {format(d, "EEE")}
                </p>
                <p className="font-display text-base font-bold">{format(d, "d")}</p>
                <p className="text-[10px] font-ui opacity-70">{format(d, "MMM")}</p>
              </button>
            );
          })}
        </div>

        {/* Slots */}
        <div className="glass rounded-xl p-5 border border-border/60">
          <p className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-3">
            {format(selectedDate, "EEEE, MMMM d")}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {expert.timeSlots.map((slot) => {
              const isTaken = taken.has(slot);
              return (
                <button
                  key={slot}
                  disabled={isTaken}
                  onClick={() => {
                    setBookingDuration("hourly");
                    setBookingOpen(true);
                  }}
                  className={cn(
                    "px-2 py-2 rounded-lg font-ui text-xs transition-all border",
                    isTaken && "opacity-40 line-through cursor-not-allowed glass border-border/40",
                    !isTaken && "glass border-border/60 text-foreground hover:gradient-neon hover:text-primary-foreground hover:border-transparent hover:neon-glow-pink"
                  )}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] font-ui text-muted-foreground">
            <Clock size={12} className="inline mr-1 -mt-0.5" />
            Faded slots are already booked. Click any open slot to start a booking.
          </p>
        </div>
      </section>

      {/* Ratings & testimonials */}
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <h2 className="font-display text-2xl sm:text-3xl font-bold gradient-neon-text mb-6">
          What guests say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rating breakdown */}
          <div className="glass rounded-xl p-5 border border-border/60 md:col-span-1">
            <div className="text-center mb-4">
              <p className="font-display text-5xl font-bold gradient-neon-text">{expert.rating.toFixed(1)}</p>
              <div className="flex items-center justify-center gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={cn(
                      i < Math.round(expert.rating) ? "text-neon-pink fill-neon-pink" : "text-muted-foreground"
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-ui">
                Based on {expert.reviewCount} reviews
              </p>
            </div>
            <div className="space-y-1.5">
              {expert.reviewBreakdown.distribution.map((count, i) => {
                const stars = 5 - i;
                const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2 text-xs">
                    <span className="w-4 text-muted-foreground">{stars}★</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full gradient-neon"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-muted-foreground tabular-nums">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Testimonials */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {expert.testimonials.map((t) => (
              <div
                key={t.name}
                className="glass rounded-xl p-4 border border-border/60"
              >
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={cn(
                        i < t.rating ? "text-neon-pink fill-neon-pink" : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 font-body leading-relaxed mb-3">
                  "{t.quote}"
                </p>
                <p className="text-xs font-ui text-foreground font-semibold">{t.name}</p>
                <p className="text-[10px] font-ui uppercase tracking-widest text-muted-foreground">
                  {t.trip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <div className="glass rounded-xl p-6 border border-border/60 max-w-3xl mx-auto">
          <h3 className="font-display text-lg font-semibold gradient-neon-text mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-neon-pink" /> Why book {expert.name.split(" ")[0]}
          </h3>
          <ul className="space-y-2">
            {expert.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm">
                <CheckCircle2 size={14} className="text-neon-cyan mt-0.5 shrink-0" />
                <span className="text-foreground/90">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sticky checkout CTA on mobile */}
      <div className="md:hidden sticky bottom-0 inset-x-0 z-30 glass-strong border-t border-border p-3">
        <button
          onClick={() => {
            setBookingDuration("daily");
            setBookingOpen(true);
          }}
          className="w-full px-4 py-3 rounded-lg font-ui text-sm uppercase tracking-widest gradient-neon text-primary-foreground neon-glow-pink flex items-center justify-center gap-2"
        >
          <CalendarDays size={14} /> Book {expert.name.split(" ")[0]} · {formatPrice(expert.pricePerDay)}
        </button>
      </div>

      <Footer />

      <BookingDialog
        expert={expert}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        initialDuration={bookingDuration}
      />
    </div>
  );
};

export default VibesExpertDetail;

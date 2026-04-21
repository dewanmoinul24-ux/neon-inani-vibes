import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Clock,
  CalendarDays,
  Camera,
  Compass,
  Star,
  Languages,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCurrency } from "@/hooks/useCurrency";
import { useParallax } from "@/hooks/useParallax";
import vibesExpertsBanner from "@/assets/vibes-experts-banner.jpg";
import { vibesExperts, type VibesExpert, type ExpertType } from "@/data/vibesExperts";
import BookingDialog from "@/components/vibes-experts/BookingDialog";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type TypeFilter = "all" | ExpertType;
type Duration = "hourly" | "daily";

const accentBorderMap: Record<VibesExpert["accent"], string> = {
  cyan: "neon-border-blue hover:neon-glow-cyan",
  pink: "neon-border-pink hover:neon-glow-pink",
  purple: "neon-border-pink hover:neon-glow-pink",
};

const accentTextMap: Record<VibesExpert["accent"], string> = {
  cyan: "text-neon-cyan",
  pink: "text-neon-pink",
  purple: "text-neon-purple",
};

const VibesExperts = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const bannerRef = useParallax<HTMLImageElement>(0.15, 0.03);

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [duration, setDuration] = useState<Duration>("daily");

  // Compute the price-range bounds for the active duration so the slider stays meaningful.
  const priceBounds = useMemo(() => {
    const prices = vibesExperts.map((e) => (duration === "hourly" ? e.pricePerHour : e.pricePerDay));
    return [Math.min(...prices), Math.max(...prices)] as const;
  }, [duration]);
  const [priceRange, setPriceRange] = useState<[number, number]>([priceBounds[0], priceBounds[1]]);

  // Reset range whenever duration changes (different scale).
  useMemo(() => {
    setPriceRange([priceBounds[0], priceBounds[1]]);
  }, [priceBounds]);

  const [bookingExpert, setBookingExpert] = useState<VibesExpert | null>(null);

  const visible = useMemo(() => {
    return vibesExperts.filter((e) => {
      if (typeFilter !== "all" && e.type !== typeFilter) return false;
      const startingPrice = duration === "hourly" ? e.pricePerHour : e.pricePerDay;
      return startingPrice >= priceRange[0] && startingPrice <= priceRange[1];
    });
  }, [typeFilter, duration, priceRange]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Banner */}
      <section className="relative pt-16 md:pt-20">
        <div className="relative h-[260px] sm:h-[320px] md:h-[420px] overflow-hidden">
          <img
            ref={bannerRef}
            src={vibesExpertsBanner}
            alt="Local guide and photographer on Cox's Bazar Marine Drive"
            className="w-full h-[115%] object-cover will-change-transform origin-center -translate-y-[5%]"
            width={1920}
            height={832}
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-background/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/35 to-transparent" />
          <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-0 right-0 container mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-foreground/90 hover:text-primary transition-colors font-ui text-xs sm:text-sm mb-3 sm:mb-4"
            >
              <ChevronLeft size={16} /> Back to Home
            </Link>
            <p
              className="font-ui text-xs sm:text-sm uppercase tracking-[0.3em] text-neon-cyan neon-text-cyan mb-2"
              style={{ textShadow: "0 0 14px hsl(180 100% 55% / 0.95), 0 2px 10px hsl(0 0% 0% / 0.95)" }}
            >
              Hire the locals
            </p>
            <h1
              className="font-display text-3xl sm:text-5xl md:text-7xl font-bold gradient-neon-text leading-[1.05] lg:text-6xl py-[10px]"
              style={{
                filter:
                  "drop-shadow(0 0 26px hsl(320 100% 60% / 0.55)) drop-shadow(0 6px 20px hsl(0 0% 0% / 0.98))",
              }}
            >
              Vibes Experts
            </h1>
            <p
              className="mt-3 sm:mt-4 max-w-xl font-body text-sm sm:text-base text-foreground/90 md:text-lg"
              style={{ textShadow: "0 2px 14px hsl(0 0% 0% / 0.98)" }}
            >
              Hire trusted local guides and pro photographers — by the hour or for the whole day. Make
              your Cox's Bazar trip unforgettable, on camera and off.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-8 sm:py-10">
        <div className="glass rounded-2xl p-5 sm:p-6 border border-border/60 max-w-5xl mx-auto space-y-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-neon-cyan" />
            <p className="font-ui text-xs sm:text-sm uppercase tracking-[0.3em] text-neon-blue neon-text-blue">
              Find your match
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Type filter */}
            <div>
              <p className="font-ui text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Expert type
              </p>
              <div className="flex flex-wrap gap-2">
                {([
                  { id: "all" as const, label: "All", icon: Sparkles },
                  { id: "guide" as const, label: "Guides", icon: Compass },
                  { id: "photographer" as const, label: "Photographers", icon: Camera },
                ]).map((opt) => {
                  const Icon = opt.icon;
                  const active = typeFilter === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setTypeFilter(opt.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-full font-ui text-xs uppercase tracking-widest transition-all flex items-center gap-1.5",
                        active
                          ? "gradient-neon text-primary-foreground neon-glow-pink"
                          : "glass border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50"
                      )}
                    >
                      <Icon size={12} /> {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duration */}
            <div>
              <p className="font-ui text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Pricing basis
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDuration("hourly")}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-lg font-ui text-xs uppercase tracking-widest transition-all",
                    duration === "hourly"
                      ? "gradient-neon text-primary-foreground neon-glow-pink"
                      : "glass border border-border/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Clock size={12} className="inline mr-1.5 -mt-0.5" /> Hourly
                </button>
                <button
                  onClick={() => setDuration("daily")}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-lg font-ui text-xs uppercase tracking-widest transition-all",
                    duration === "daily"
                      ? "gradient-neon text-primary-foreground neon-glow-pink"
                      : "glass border border-border/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <CalendarDays size={12} className="inline mr-1.5 -mt-0.5" /> Full day
                </button>
              </div>
            </div>

            {/* Price range */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-ui text-[10px] uppercase tracking-widest text-muted-foreground">
                  Starting price
                </p>
                <p className="text-[10px] font-ui text-foreground tabular-nums">
                  {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
                </p>
              </div>
              <Slider
                min={priceBounds[0]}
                max={priceBounds[1]}
                step={100}
                value={priceRange}
                onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
                className="mt-1"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground font-ui">
            Showing <span className="text-foreground font-medium">{visible.length}</span> of{" "}
            {vibesExperts.length} experts
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="container mx-auto px-4 pb-10">
        {visible.length === 0 ? (
          <div className="text-center py-16 max-w-md mx-auto">
            <p className="font-ui text-sm uppercase tracking-widest text-muted-foreground mb-3">
              No experts match those filters
            </p>
            <button
              onClick={() => {
                setTypeFilter("all");
                setPriceRange([priceBounds[0], priceBounds[1]]);
              }}
              className="px-5 py-2.5 rounded-lg font-ui text-sm uppercase tracking-widest gradient-neon text-primary-foreground neon-glow-pink"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
            {visible.map((e, i) => {
              const TypeIcon = e.type === "guide" ? Compass : Camera;
              const startingPrice = duration === "hourly" ? e.pricePerHour : e.pricePerDay;
              return (
                <div
                  key={e.id}
                  className={cn(
                    "glass rounded-xl overflow-hidden transition-all duration-500 hover:scale-[1.02] animate-slide-up flex flex-col",
                    accentBorderMap[e.accent]
                  )}
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  {/* Portrait */}
                  <button
                    type="button"
                    onClick={() => navigate(`/vibes-experts/${e.id}`)}
                    className="relative block w-full aspect-[4/3] overflow-hidden"
                    aria-label={`View ${e.name} profile`}
                  >
                    <img
                      src={e.portrait}
                      alt={e.name}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass-strong border border-primary/40 font-ui text-[10px] uppercase tracking-widest text-foreground flex items-center gap-1.5">
                      <TypeIcon size={12} className={accentTextMap[e.accent]} />
                      {e.type === "guide" ? "Guide" : "Photographer"}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full glass-strong border border-neon-pink/40 font-ui text-[10px] flex items-center gap-1">
                      <Star size={10} className="text-neon-pink fill-neon-pink" />
                      <span className="font-semibold text-foreground">{e.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({e.reviewCount})</span>
                    </span>
                  </button>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2 gap-3">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {e.name}
                        </h3>
                        <p className={cn("text-[11px] font-ui uppercase tracking-widest", accentTextMap[e.accent])}>
                          {e.tagline}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] uppercase tracking-widest font-ui text-muted-foreground">
                          From
                        </p>
                        <p className="font-display text-base font-bold text-foreground">
                          {formatPrice(startingPrice)}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-ui">
                          / {duration === "hourly" ? "hr" : "day"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {e.features.slice(0, 3).map((f) => (
                        <span
                          key={f}
                          className="px-2 py-0.5 rounded-full text-[10px] font-ui uppercase tracking-wider glass border border-border text-muted-foreground"
                        >
                          {f}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-1.5 text-xs mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Languages size={12} />
                        <span>{e.languages.join(" · ")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <ShieldCheck size={12} className="text-neon-cyan" />
                        <span>{e.experienceYears} yrs experience</span>
                      </div>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-2">
                      <button
                        onClick={() => navigate(`/vibes-experts/${e.id}`)}
                        className="px-3 py-2.5 rounded-lg font-ui text-[11px] uppercase tracking-widest glass border border-border/60 text-foreground transition-all hover:border-primary/60"
                      >
                        View profile
                      </button>
                      <button
                        onClick={() => setBookingExpert(e)}
                        className="px-3 py-2.5 rounded-lg font-ui text-[11px] uppercase tracking-widest gradient-neon text-primary-foreground transition-transform hover:scale-105 flex items-center justify-center gap-1.5"
                      >
                        Book <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Notes */}
      <section className="container mx-auto px-4 pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto glass rounded-xl p-5 sm:p-6 md:p-8 neon-border-blue">
          <h3 className="font-display text-lg font-semibold gradient-neon-text mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-neon-orange" /> Important Information
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground font-body">
            <li className="flex items-start gap-2">
              <CreditCard size={14} className="text-neon-cyan mt-0.5 shrink-0" />
              <span>
                <strong className="text-foreground">50% Advance Payment</strong> is required at the
                time of booking. Remaining balance is due on the day of service.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck size={14} className="text-neon-orange mt-0.5 shrink-0" />
              <span>
                All guides and photographers are <strong className="text-foreground">verified</strong>{" "}
                with valid IDs and pass our local background check.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Clock size={14} className="text-neon-cyan mt-0.5 shrink-0" />
              <span>
                <strong className="text-foreground">Whole Day = 8 hours</strong> from the agreed
                start time. Hourly bookings have a minimum of 1 hour.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Camera size={14} className="text-neon-cyan mt-0.5 shrink-0" />
              <span>
                Photographers deliver edited shots within{" "}
                <strong className="text-foreground">48 hours</strong> via a private online gallery.
              </span>
            </li>
          </ul>
        </div>
      </section>

      <Footer />

      <BookingDialog
        expert={bookingExpert}
        open={!!bookingExpert}
        onOpenChange={(o) => !o && setBookingExpert(null)}
        initialDuration={duration}
      />
    </div>
  );
};

export default VibesExperts;

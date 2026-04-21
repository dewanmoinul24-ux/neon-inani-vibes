import { useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCurrency } from "@/hooks/useCurrency";
import { useParallax } from "@/hooks/useParallax";
import vibesExpertsBanner from "@/assets/vibes-experts-banner.jpg";

type ExpertId = "guides" | "photographers";

interface Expert {
  id: ExpertId;
  name: string;
  tagline: string;
  description: string;
  icon: typeof Compass;
  pricePerHour: number;
  pricePerDay: number;
  bookingAdvance: number; // %
  features: string[];
  highlights: string[];
  accent: "cyan" | "pink";
}

const experts: Expert[] = [
  {
    id: "guides",
    name: "Local Guides",
    tagline: "Stories, shortcuts & secret spots",
    description:
      "Hand-picked Cox's Bazar locals who know every beach turn, hidden waterfall and sunset viewpoint. Fluent storytellers who turn a tour into an unforgettable vibe.",
    icon: Compass,
    pricePerHour: 500,
    pricePerDay: 3500,
    bookingAdvance: 50,
    features: ["English & Bangla", "Local Insider", "Custom Itinerary", "Group or Solo"],
    highlights: [
      "5+ years guiding Cox's Bazar",
      "Hidden viewpoints & food stops",
      "Safety briefings included",
    ],
    accent: "cyan",
  },
  {
    id: "photographers",
    name: "Photographers",
    tagline: "Pro shots of your coastline moments",
    description:
      "Professional photographers with DSLRs and drones, ready to capture sunset portraits, group shoots and reels along Marine Drive, Inani and Himchari.",
    icon: Camera,
    pricePerHour: 1200,
    pricePerDay: 8000,
    bookingAdvance: 50,
    features: ["DSLR + Drone", "Edited Photos", "Reels & Shorts", "Same-Day Delivery"],
    highlights: [
      "60+ edited photos per session",
      "Sunset & blue-hour specialists",
      "Online gallery within 48 hours",
    ],
    accent: "pink",
  },
];

const accentBorderMap: Record<Expert["accent"], string> = {
  cyan: "neon-border-blue hover:neon-glow-cyan",
  pink: "neon-border-pink hover:neon-glow-pink",
};

const accentTextMap: Record<Expert["accent"], string> = {
  cyan: "text-neon-cyan",
  pink: "text-neon-pink",
};

const VibesExperts = () => {
  const { formatPrice } = useCurrency();
  const bannerRef = useParallax<HTMLImageElement>(0.15, 0.03);
  const [rentalType, setRentalType] = useState<"hourly" | "daily">("daily");

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
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-ui text-xs sm:text-sm mb-3 sm:mb-4"
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

      {/* Rental Type Toggle */}
      <section className="container mx-auto py-6 sm:py-8">
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
          <button
            onClick={() => setRentalType("hourly")}
            className={`px-4 sm:px-6 py-2.5 min-h-[44px] rounded-lg font-ui text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 ${
              rentalType === "hourly"
                ? "gradient-neon text-primary-foreground neon-glow-pink"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock size={14} className="inline mr-1.5 sm:mr-2" /> Hourly
          </button>
          <button
            onClick={() => setRentalType("daily")}
            className={`px-4 sm:px-6 py-2.5 min-h-[44px] rounded-lg font-ui text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 ${
              rentalType === "daily"
                ? "gradient-neon text-primary-foreground neon-glow-pink"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarDays size={14} className="inline mr-1.5 sm:mr-2" /> Full Day
          </button>
        </div>
        <p className="text-center text-[11px] sm:text-xs md:text-sm font-ui text-neon-cyan neon-text-cyan -mt-6 sm:-mt-8 mb-8 sm:mb-12">
          <Clock size={12} className="inline mr-1.5 -mt-0.5" />
          Whole Day = 8 hours from start time
        </p>

        {/* Expert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
          {experts.map((e, i) => {
            const Icon = e.icon;
            const startingPrice = rentalType === "hourly" ? e.pricePerHour : e.pricePerDay;
            return (
              <div
                key={e.id}
                className={`glass rounded-xl overflow-hidden ${accentBorderMap[e.accent]} transition-all duration-500 hover:scale-[1.02] animate-slide-up flex flex-col`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {/* Card Header */}
                <div className="p-6 pb-4 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-full glass flex items-center justify-center">
                      <Icon size={28} className={accentTextMap[e.accent]} />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest font-ui text-muted-foreground">
                        Starting From
                      </p>
                      <p className="font-display text-xl font-bold text-foreground">
                        {formatPrice(startingPrice)}
                      </p>
                      <p className="text-xs text-muted-foreground font-ui">
                        per {rentalType === "hourly" ? "hour" : "day"}
                      </p>
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                    {e.name}
                  </h3>
                  <p className={`text-xs font-ui uppercase tracking-widest mb-3 ${accentTextMap[e.accent]}`}>
                    {e.tagline}
                  </p>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">
                    {e.description}
                  </p>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {e.features.map((f) => (
                      <span
                        key={f}
                        className="px-2 py-0.5 rounded-full text-[10px] font-ui uppercase tracking-wider glass border border-border text-muted-foreground"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2 text-sm">
                    {e.highlights.map((h) => (
                      <div key={h} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-neon-cyan mt-0.5 shrink-0" />
                        <span className="text-foreground/90">{h}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 pt-1">
                      {e.id === "guides" ? (
                        <>
                          <Languages size={14} className="text-muted-foreground" />
                          <span className="text-muted-foreground">Languages:</span>
                          <span className="text-foreground font-semibold">Bangla · English</span>
                        </>
                      ) : (
                        <>
                          <Star size={14} className="text-muted-foreground" />
                          <span className="text-muted-foreground">Avg rating:</span>
                          <span className="text-foreground font-semibold">4.9 / 5</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="border-t border-border p-4 bg-muted/20 space-y-3">
                  <p className="text-center text-xs font-ui uppercase tracking-widest text-neon-cyan neon-text-cyan font-semibold">
                    {e.bookingAdvance}% Booking Advance
                  </p>
                  <button
                    type="button"
                    className="w-full px-4 py-3 min-h-[44px] rounded-lg font-ui text-xs uppercase tracking-widest gradient-neon text-primary-foreground transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Sparkles size={14} /> Book {e.name} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notes Section */}
        <div className="max-w-3xl mx-auto mt-12 sm:mt-16 glass rounded-xl p-5 sm:p-6 md:p-8 neon-border-blue">
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
                All guides and photographers are <strong className="text-foreground">verified</strong>
                {" "}with valid IDs and pass our local background check.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Clock size={14} className="text-neon-cyan mt-0.5 shrink-0" />
              <span>
                <strong className="text-foreground">Whole Day = 8 hours</strong> from the agreed
                start time. Hourly bookings have a minimum of 1 hour. Overtime is charged at the
                hourly rate.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Camera size={14} className="text-neon-cyan mt-0.5 shrink-0" />
              <span>
                Photographers deliver edited shots within{" "}
                <strong className="text-foreground">48 hours</strong> via a private online gallery.
                Drone usage may require permits at restricted locations.
              </span>
            </li>
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VibesExperts;

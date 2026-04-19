import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Car,
  Truck,
  Bike,
  Fuel,
  Clock,
  Users,
  ShieldCheck,
  AlertTriangle,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  CreditCard,
  CalendarDays,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { vehicles } from "@/data/vehicles";
import vehiclesBanner from "@/assets/vehicles-banner.jpg";
import { useCurrency } from "@/hooks/useCurrency";
import { useVibes } from "@/hooks/useVibes";

const iconMap: Record<string, React.ElementType> = {
  Sedan: Car,
  JEEP: Truck,
  Auto: Car,
  CNG: Car,
  Scooter: Bike,
};

const accentMap: Record<string, string> = {
  pink: "neon-border-pink hover:neon-glow-pink",
  blue: "neon-border-blue hover:neon-glow-blue",
  cyan: "neon-border-blue hover:neon-glow-cyan",
  purple: "neon-border-pink hover:neon-glow-pink",
  orange: "neon-border-pink hover:neon-glow-pink",
};

const accentTextMap: Record<string, string> = {
  pink: "text-neon-pink",
  blue: "text-neon-blue",
  cyan: "text-neon-cyan",
  purple: "text-neon-purple",
  orange: "text-neon-orange",
};

const Vehicles = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { tier: vibesTier } = useVibes();
  const vehicleDiscountPct = Math.round(vibesTier.vehicleDiscount * 100);
  const [rentalType, setRentalType] = useState<"hourly" | "daily">("daily");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Banner */}
      <section className="relative pt-16 md:pt-20">
        <div className="relative h-[320px] md:h-[420px] overflow-hidden">
          <img
            src={vehiclesBanner}
            alt="Neon cars on Marine Drive Cox's Bazar"
            className="w-full h-full object-cover"
            width={1920}
            height={640}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
          <div className="absolute inset-0 bg-background/20" />
          <div className="absolute bottom-8 md:bottom-12 left-0 right-0 container mx-auto px-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-ui text-sm mb-4"
            >
              <ChevronLeft size={16} /> Back to Home
            </Link>
            <p
              className="font-ui text-sm uppercase tracking-[0.3em] text-neon-cyan neon-text-cyan mb-2"
              style={{ textShadow: "0 0 14px hsl(180 100% 55% / 0.95), 0 2px 8px hsl(0 0% 0% / 0.8)" }}
            >
              Ride the coast
            </p>
            <h1
              className="font-display text-5xl md:text-7xl font-bold gradient-neon-text leading-[1.05] lg:text-6xl"
              style={{
                filter:
                  "drop-shadow(0 0 24px hsl(180 100% 55% / 0.55)) drop-shadow(0 4px 16px hsl(0 0% 0% / 0.9))",
              }}
            >
              Vehicle Rental
            </h1>
            <p
              className="mt-4 max-w-xl font-body text-base text-foreground/90 md:text-lg"
              style={{ textShadow: "0 2px 12px hsl(0 0% 0% / 0.9)" }}
            >
              Explore Cox's Bazar at your own pace. From iconic Chander Garis to self-drive scooters —
              pick your ride and hit Marine Drive.
            </p>
          </div>
        </div>
      </section>

      {/* Rental Type Toggle */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setRentalType("hourly")}
            className={`px-6 py-2.5 rounded-lg font-ui text-sm uppercase tracking-widest transition-all duration-300 ${
              rentalType === "hourly"
                ? "gradient-neon text-primary-foreground neon-glow-pink"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock size={14} className="inline mr-2" /> Hourly
          </button>
          <button
            onClick={() => setRentalType("daily")}
            className={`px-6 py-2.5 rounded-lg font-ui text-sm uppercase tracking-widest transition-all duration-300 ${
              rentalType === "daily"
                ? "gradient-neon text-primary-foreground neon-glow-pink"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarDays size={14} className="inline mr-2" /> Full Day
          </button>
        </div>
        <p className="text-center text-xs md:text-sm font-ui text-neon-cyan neon-text-cyan -mt-8 mb-12">
          <Clock size={12} className="inline mr-1.5 -mt-0.5" />
          Whole Day = 8 hours from pickup time
        </p>

        {/* Vehicle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {vehicles.map((v, i) => {
            const Icon = iconMap[v.category] || Car;
            const startingPrice =
              rentalType === "hourly" ? v.pricePerHour : v.pricePerDay;

            return (
              <div
                key={v.id}
                className={`glass rounded-xl overflow-hidden ${accentMap[v.accentColor]} transition-all duration-500 hover:scale-[1.02] animate-slide-up flex flex-col relative`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {vehicleDiscountPct > 0 && (
                  <div className="absolute top-3 right-3 z-10 rounded-full px-2.5 py-1 flex items-center gap-1 gradient-neon text-primary-foreground neon-glow-pink">
                    <Sparkles size={12} />
                    <span className="font-ui text-[10px] uppercase tracking-wider font-bold">
                      Vibes perk: {vehicleDiscountPct}% off
                    </span>
                  </div>
                )}
                {/* Card Header */}
                <div className="p-6 pb-4 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-full glass flex items-center justify-center">
                      <Icon size={28} className={accentTextMap[v.accentColor]} />
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
                    {v.name}
                  </h3>
                  {v.nameLocal && (
                    <p className="text-xs text-muted-foreground mb-2">{v.nameLocal}</p>
                  )}
                  <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">
                    {v.description}
                  </p>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {v.features.map((f) => (
                      <span
                        key={f}
                        className="px-2 py-0.5 rounded-full text-[10px] font-ui uppercase tracking-wider glass border border-border text-muted-foreground"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Key Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-muted-foreground" />
                      <span className="text-muted-foreground">Seats:</span>
                      <span className="text-foreground font-semibold">{v.seats}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-muted-foreground" />
                      <span className="text-muted-foreground">Driver:</span>
                      <span className="text-foreground font-semibold flex items-center gap-1">
                        {v.driverIncluded ? (
                          <>
                            <CheckCircle2 size={12} className="text-neon-cyan" /> Included
                          </>
                        ) : (
                          <>
                            <XCircle size={12} className="text-neon-orange" /> Self-Drive
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel size={14} className="text-muted-foreground" />
                      <span className="text-muted-foreground">Fuel:</span>
                      <span className="text-foreground font-semibold flex items-center gap-1">
                        {v.fuelIncluded ? (
                          <>
                            <CheckCircle2 size={12} className="text-neon-cyan" /> Included
                          </>
                        ) : (
                          <>
                            <XCircle size={12} className="text-neon-orange" /> Not Included
                          </>
                        )}
                      </span>
                    </div>
                    {v.requiresLicense && (
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-neon-orange" />
                        <span className="text-neon-orange font-semibold text-xs">
                          Valid Driving License Required
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="border-t border-border p-4 bg-muted/20 space-y-3">
                  <p className="text-center text-xs font-ui uppercase tracking-widest text-neon-cyan neon-text-cyan font-semibold">
                    50% Booking Advance
                  </p>
                  <button
                    onClick={() => navigate(`/vehicles/${v.id}`)}
                    className="w-full px-4 py-2.5 rounded-lg font-ui text-xs uppercase tracking-widest gradient-neon text-primary-foreground transition-transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    Select <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notes Section */}
        <div className="max-w-3xl mx-auto mt-16 glass rounded-xl p-6 md:p-8 neon-border-blue">
          <h3 className="font-display text-lg font-semibold gradient-neon-text mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-neon-orange" /> Important Information
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground font-body">
            <li className="flex items-start gap-2">
              <CreditCard size={14} className="text-neon-cyan mt-0.5 shrink-0" />
              <span>
                <strong className="text-foreground">50% Advance Payment</strong> is required at the
                time of booking. Remaining balance is due at pickup.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck size={14} className="text-neon-orange mt-0.5 shrink-0" />
              <span>
                <strong className="text-foreground">Scooter / Motorcycle</strong> renters must
                present a valid driving license. Oil and fuel are NOT included.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Fuel size={14} className="text-neon-cyan mt-0.5 shrink-0" />
              <span>
                All other vehicles include fuel in the rental price. Driver tip is at your
                discretion.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Clock size={14} className="text-neon-cyan mt-0.5 shrink-0" />
              <span>
                <strong className="text-foreground">Whole Day = 8 hours</strong> from your pickup
                time. Hourly bookings have a minimum of 1 hour. Overtime is charged at the hourly rate.
              </span>
            </li>
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Vehicles;

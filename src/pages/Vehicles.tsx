import { useState } from "react";
import { Link } from "react-router-dom";
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
  Mail,
  Phone,
  FileText,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { vehicles, type Vehicle } from "@/data/vehicles";
import vehiclesBanner from "@/assets/vehicles-banner.jpg";
import { toast } from "@/components/ui/sonner";

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
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [rentalType, setRentalType] = useState<"hourly" | "daily">("daily");
  const [hours, setHours] = useState(4);
  const [days, setDays] = useState(1);
  const [showBooking, setShowBooking] = useState(false);

  // Booking form
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTotal = (v: Vehicle) => {
    return rentalType === "hourly" ? v.pricePerHour * hours : v.pricePerDay * days;
  };

  const getAdvance = (v: Vehicle) => {
    return Math.ceil(getTotal(v) * (v.bookingAdvance / 100));
  };

  const handleBook = async () => {
    if (!selectedVehicle || !guestName || !guestPhone || !pickupDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    // Simulate booking — can connect to DB later
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setShowBooking(false);
    setSelectedVehicle(null);
    toast.success("Booking confirmed! You'll receive a confirmation shortly.", {
      description: `${selectedVehicle.name} — Advance: ৳${getAdvance(selectedVehicle).toLocaleString()}`,
    });
    setGuestName("");
    setGuestPhone("");
    setGuestEmail("");
    setPickupDate("");
  };

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
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
          <div className="absolute bottom-8 md:bottom-12 left-0 right-0 container mx-auto px-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-ui text-sm mb-4"
            >
              <ChevronLeft size={16} /> Back to Home
            </Link>
            <p className="font-ui text-sm uppercase tracking-[0.3em] text-neon-cyan neon-text-cyan mb-2">
              Ride the coast
            </p>
            <h1 className="font-display text-3xl md:text-5xl font-bold gradient-neon-text">
              Vehicle Rental
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl font-body text-sm md:text-base">
              Explore Cox's Bazar at your own pace. From iconic Chander Garis to self-drive scooters —
              pick your ride and hit Marine Drive.
            </p>
          </div>
        </div>
      </section>

      {/* Rental Type Toggle */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-4 mb-10">
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

        {/* Duration Selector */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {rentalType === "hourly" ? (
            <div className="flex items-center gap-3 glass rounded-lg px-4 py-2">
              <button
                onClick={() => setHours(Math.max(1, hours - 1))}
                className="w-8 h-8 rounded-full glass flex items-center justify-center text-foreground hover:text-primary transition-colors"
              >
                −
              </button>
              <span className="font-display text-lg w-16 text-center">
                {hours} <span className="text-xs text-muted-foreground">hrs</span>
              </span>
              <button
                onClick={() => setHours(Math.min(12, hours + 1))}
                className="w-8 h-8 rounded-full glass flex items-center justify-center text-foreground hover:text-primary transition-colors"
              >
                +
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 glass rounded-lg px-4 py-2">
              <button
                onClick={() => setDays(Math.max(1, days - 1))}
                className="w-8 h-8 rounded-full glass flex items-center justify-center text-foreground hover:text-primary transition-colors"
              >
                −
              </button>
              <span className="font-display text-lg w-16 text-center">
                {days} <span className="text-xs text-muted-foreground">day{days > 1 ? "s" : ""}</span>
              </span>
              <button
                onClick={() => setDays(Math.min(30, days + 1))}
                className="w-8 h-8 rounded-full glass flex items-center justify-center text-foreground hover:text-primary transition-colors"
              >
                +
              </button>
            </div>
          )}
        </div>

        {/* Vehicle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {vehicles.map((v, i) => {
            const Icon = iconMap[v.category] || Car;
            const total = getTotal(v);
            const advance = getAdvance(v);

            return (
              <div
                key={v.id}
                className={`glass rounded-xl overflow-hidden ${accentMap[v.accentColor]} transition-all duration-500 hover:scale-[1.02] animate-slide-up`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-full glass flex items-center justify-center">
                      <Icon size={28} className={accentTextMap[v.accentColor]} />
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl font-bold text-foreground">
                        ৳{(rentalType === "hourly" ? v.pricePerHour : v.pricePerDay).toLocaleString()}
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
                <div className="border-t border-border p-4 bg-muted/20">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground font-ui">Total</p>
                      <p className="font-display text-lg font-bold text-foreground">
                        ৳{total.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-ui">Booking Advance (50%)</p>
                      <p className="font-display text-lg font-bold text-neon-cyan">
                        ৳{advance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedVehicle(v);
                      setShowBooking(true);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg font-ui text-xs uppercase tracking-widest gradient-neon text-primary-foreground transition-transform hover:scale-105"
                  >
                    Rent Now
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
                <strong className="text-foreground">50% Advance Payment</strong> is required at
                the time of booking. Remaining balance is due at pickup.
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
                Hourly bookings have a minimum of 1 hour. Overtime is charged at the hourly rate.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Booking Modal */}
      {showBooking && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowBooking(false)}
          />
          <div className="relative glass-strong rounded-2xl p-6 md:p-8 max-w-md w-full neon-border-pink animate-slide-up max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-xl font-bold gradient-neon-text mb-1">
              Book {selectedVehicle.name}
            </h3>
            <p className="text-xs text-muted-foreground font-ui mb-6">
              {rentalType === "hourly" ? `${hours} hour(s)` : `${days} day(s)`} —
              Total: ৳{getTotal(selectedVehicle).toLocaleString()} | Advance: ৳
              {getAdvance(selectedVehicle).toLocaleString()}
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider mb-1 block">
                  Full Name *
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg glass border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary bg-transparent"
                    placeholder="Your full name"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider mb-1 block">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg glass border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary bg-transparent"
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider mb-1 block">
                  Email (Optional)
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg glass border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary bg-transparent"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider mb-1 block">
                  Pickup Date *
                </label>
                <div className="relative">
                  <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg glass border border-border text-sm text-foreground focus:outline-none focus:border-primary bg-transparent"
                  />
                </div>
              </div>

              {selectedVehicle.requiresLicense && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-neon-orange/10 border border-neon-orange/30">
                  <FileText size={16} className="text-neon-orange mt-0.5 shrink-0" />
                  <p className="text-xs text-neon-orange">
                    You must present a valid driving license at pickup. Oil/fuel is not included
                    in the booking price.
                  </p>
                </div>
              )}

              <div className="pt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rental</span>
                  <span className="text-foreground">৳{getTotal(selectedVehicle).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t border-border pt-2">
                  <span className="text-neon-cyan">Advance Due (50%)</span>
                  <span className="text-neon-cyan">৳{getAdvance(selectedVehicle).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleBook}
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg font-ui text-sm uppercase tracking-widest gradient-neon text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Vehicles;

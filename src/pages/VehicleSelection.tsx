import { useEffect, useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  ChevronLeft,
  Star,
  Phone,
  MapPin,
  CalendarDays,
  Clock,
  User,
  Mail,
  ShieldCheck,
  Fuel,
  CheckCircle2,
  XCircle,
  Languages,
  BadgeCheck,
  Car,
  FileText,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { vehicles, type VehicleUnit } from "@/data/vehicles";
import vehiclesBanner from "@/assets/vehicles-banner.jpg";
import { toast } from "@/components/ui/sonner";
import { useCurrency } from "@/hooks/useCurrency";
import { useAuth } from "@/contexts/AuthContext";
import { useVibes } from "@/hooks/useVibes";
import { supabase } from "@/integrations/supabase/client";
import AuthModal from "@/components/AuthModal";
import { addDays, addHours, format } from "date-fns";

const accentTextMap: Record<string, string> = {
  pink: "text-neon-pink",
  blue: "text-neon-blue",
  cyan: "text-neon-cyan",
  purple: "text-neon-purple",
  orange: "text-neon-orange",
};

const accentBorderMap: Record<string, string> = {
  pink: "neon-border-pink",
  blue: "neon-border-blue",
  cyan: "neon-border-blue",
  purple: "neon-border-pink",
  orange: "neon-border-pink",
};

const VehicleSelection = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { formatPrice } = useCurrency();
  const { user, profile } = useAuth();
  const { tier: vibesTier } = useVibes();
  const vehicle = useMemo(() => vehicles.find((v) => v.id === categoryId), [categoryId]);

  const [rentalType, setRentalType] = useState<"hourly" | "daily">("daily");
  const [hours, setHours] = useState(4);
  const [days, setDays] = useState(1);

  const [selectedUnit, setSelectedUnit] = useState<VehicleUnit | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  // Booking form
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [pickupDateTime, setPickupDateTime] = useState(""); // datetime-local string
  const [licenseNo, setLicenseNo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill from logged-in user's profile.
  useEffect(() => {
    if (profile?.display_name && !guestName) setGuestName(profile.display_name);
    if (user?.email && !guestEmail) setGuestEmail(user.email);
    if (profile?.phone && !guestPhone) setGuestPhone(profile.phone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile]);

  if (!vehicle) {
    return <Navigate to="/vehicles" replace />;
  }

  const accentText = accentTextMap[vehicle.accentColor];
  const accentBorder = accentBorderMap[vehicle.accentColor];

  const unitPrice = rentalType === "hourly" ? vehicle.pricePerHour : vehicle.pricePerDay;
  const duration = rentalType === "hourly" ? hours : days;
  const subtotal = unitPrice * duration;
  const vibesDiscount = Math.round(subtotal * vibesTier.vehicleDiscount);
  const discountedSubtotal = subtotal - vibesDiscount;
  const platformFee = Math.round(discountedSubtotal * 0.02);
  const total = discountedSubtotal + platformFee;
  const advance = Math.ceil(total * (vehicle.bookingAdvance / 100));

  const openBooking = (unit: VehicleUnit) => {
    if (!user) {
      toast.info("Please sign in to confirm your booking.");
      setAuthOpen(true);
      return;
    }
    setSelectedUnit(unit);
    setShowBooking(true);
  };

  const handleConfirm = async () => {
    if (!selectedUnit) return;
    if (!guestName || !guestPhone) {
      toast.error("Please fill in your name and phone number");
      return;
    }
    if (!pickupDateTime) {
      toast.error("Pickup date & time is required");
      return;
    }
    if (vehicle.requiresLicense && !licenseNo) {
      toast.error("Driving license number is required for scooter / motorcycle rental");
      return;
    }
    setIsSubmitting(true);

    const pickup = new Date(pickupDateTime);
    // Daily rentals = 8 hours per "day" from pickup time (per the policy on /vehicles).
    const dropoff =
      rentalType === "hourly" ? addHours(pickup, hours) : addHours(pickup, days * 8);

    const { error } = await supabase.from("bookings").insert({
      category: "vehicle",
      hotel_id: vehicle.id,
      hotel_name: `${vehicle.name} — ${selectedUnit.modelName}`,
      guest_name: guestName,
      guest_email: guestEmail || (user?.email ?? ""),
      check_in: format(pickup, "yyyy-MM-dd"),
      check_out: format(dropoff, "yyyy-MM-dd"),
      guests: 1,
      rooms: [
        {
          modelName: selectedUnit.modelName,
          rentalType,
          duration,
          unitPrice,
          advance,
          licenseNo: licenseNo || null,
          pickupDateTime: pickup.toISOString(),
          dropoffDateTime: dropoff.toISOString(),
        },
      ],
      subtotal,
      tax_and_fees: platformFee - vibesDiscount,
      total,
      special_requests: vehicle.requiresLicense ? `License: ${licenseNo}` : null,
      user_id: user?.id ?? null,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error("Booking failed. Please try again.", { description: error.message });
      return;
    }

    setShowBooking(false);
    toast.success("Booking confirmed! Pay 50% advance to secure your ride.", {
      description: `${selectedUnit.modelName} — Advance Due: ${formatPrice(advance)}`,
    });
    setSelectedUnit(null);
    setPickupDateTime("");
    setLicenseNo("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Banner */}
      <section className="relative pt-16 md:pt-20">
        <div className="relative h-[260px] md:h-[340px] overflow-hidden">
          <img
            src={vehiclesBanner}
            alt="Neon cars on Marine Drive Cox's Bazar"
            className="w-full h-full object-cover"
            width={1920}
            height={640}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute bottom-8 md:bottom-10 left-0 right-0 container mx-auto px-4">
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-ui text-sm mb-3"
            >
              <ChevronLeft size={16} /> Back to Vehicles
            </Link>
            <p className={`font-ui text-xs uppercase tracking-[0.3em] ${accentText} mb-2`}>
              Choose your ride
            </p>
            <h1 className="font-display text-3xl md:text-5xl font-bold gradient-neon-text">
              {vehicle.name}
            </h1>
            {vehicle.nameLocal && (
              <p className="text-sm text-muted-foreground mt-1 font-body">{vehicle.nameLocal}</p>
            )}
          </div>
        </div>
      </section>

      {/* Rental Type & Duration */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setRentalType("hourly")}
            className={`px-5 py-2 rounded-lg font-ui text-xs uppercase tracking-widest transition-all ${
              rentalType === "hourly"
                ? "gradient-neon text-primary-foreground neon-glow-pink"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock size={14} className="inline mr-2" /> Hourly
          </button>
          <button
            onClick={() => setRentalType("daily")}
            className={`px-5 py-2 rounded-lg font-ui text-xs uppercase tracking-widest transition-all ${
              rentalType === "daily"
                ? "gradient-neon text-primary-foreground neon-glow-pink"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarDays size={14} className="inline mr-2" /> Full Day
          </button>

          <div className="flex items-center gap-3 glass rounded-lg px-4 py-1.5 ml-2">
            <button
              onClick={() =>
                rentalType === "hourly"
                  ? setHours(Math.max(1, hours - 1))
                  : setDays(Math.max(1, days - 1))
              }
              className="w-7 h-7 rounded-full glass flex items-center justify-center text-foreground hover:text-primary transition-colors"
            >
              −
            </button>
            <span className="font-display text-base w-20 text-center">
              {rentalType === "hourly" ? `${hours} hrs` : `${days} day${days > 1 ? "s" : ""}`}
            </span>
            <button
              onClick={() =>
                rentalType === "hourly"
                  ? setHours(Math.min(12, hours + 1))
                  : setDays(Math.min(30, days + 1))
              }
              className="w-7 h-7 rounded-full glass flex items-center justify-center text-foreground hover:text-primary transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Subtotal Strip */}
        <div className="max-w-3xl mx-auto glass rounded-xl p-4 md:p-5 mb-8 flex flex-wrap items-center justify-between gap-4 neon-border-blue">
          <div>
            <p className="text-[11px] uppercase tracking-widest font-ui text-muted-foreground">
              Estimated Total
            </p>
            <p className="font-display text-xl md:text-2xl font-bold gradient-neon-text">
              {formatPrice(total)}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest font-ui text-muted-foreground">
              50% Booking Advance
            </p>
            <p className="font-display text-lg md:text-xl font-bold text-neon-cyan neon-text-cyan">
              {formatPrice(advance)}
            </p>
          </div>
          <p className="text-xs text-muted-foreground max-w-[220px] font-body">
            Final amount confirmed at booking. Remaining balance due at pickup.
          </p>
        </div>

        {/* Units Grid */}
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
          Available {vehicle.requiresLicense ? "Vehicles" : "Vehicles & Drivers"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {vehicle.units.map((unit, i) => (
            <div
              key={unit.id}
              className={`glass rounded-2xl overflow-hidden ${accentBorder} transition-all duration-500 hover:scale-[1.01] animate-slide-up`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Vehicle Image */}
              <div className="relative h-52 md:h-60 overflow-hidden">
                <img
                  src={unit.image}
                  alt={unit.modelName}
                  loading="lazy"
                  width={1024}
                  height={640}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <p className={`text-[10px] font-ui uppercase tracking-widest ${accentText}`}>
                      {unit.year} • {unit.color}
                    </p>
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {unit.modelName}
                    </h3>
                  </div>
                  <span className="text-[10px] font-ui px-2 py-0.5 rounded-full glass border border-border text-muted-foreground">
                    {unit.registrationNo}
                  </span>
                </div>
              </div>

              {/* Driver / Owner Info */}
              <div className="p-5">
                {unit.driver ? (
                  <div className="flex items-center gap-4 mb-4 p-3 rounded-xl bg-muted/20 border border-border">
                    <img
                      src={unit.driver.photo}
                      alt={unit.driver.name}
                      loading="lazy"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary/40"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-display text-base font-semibold text-foreground truncate">
                          {unit.driver.name}
                        </p>
                        <BadgeCheck size={14} className="text-neon-cyan shrink-0" />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <Star size={11} className="text-neon-orange fill-neon-orange" />
                          <span className="text-foreground font-semibold">
                            {unit.driver.rating}
                          </span>
                        </span>
                        <span>{unit.driver.experienceYears} yrs exp.</span>
                        <span className="flex items-center gap-1">
                          <Languages size={11} />
                          {unit.driver.languages.join(", ")}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Phone size={10} /> {unit.driver.phone}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 p-3 rounded-xl bg-muted/20 border border-border space-y-1.5">
                    <div className="flex items-center gap-2">
                      <User size={14} className={accentText} />
                      <span className="text-xs font-ui uppercase tracking-wider text-muted-foreground">
                        Owner
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {unit.ownerName}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className={`${accentText} mt-0.5 shrink-0`} />
                      <div>
                        <span className="text-xs font-ui uppercase tracking-wider text-muted-foreground block">
                          Pickup Location
                        </span>
                        <span className="text-sm text-foreground">{unit.pickupLocation}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick specs */}
                <div className="flex flex-wrap gap-2 mb-4 text-[11px]">
                  <span className="px-2 py-1 rounded-full glass border border-border text-muted-foreground flex items-center gap-1">
                    <Car size={11} /> {vehicle.seats} seats
                  </span>
                  <span className="px-2 py-1 rounded-full glass border border-border text-muted-foreground flex items-center gap-1">
                    {vehicle.fuelIncluded ? (
                      <>
                        <CheckCircle2 size={11} className="text-neon-cyan" /> Fuel included
                      </>
                    ) : (
                      <>
                        <XCircle size={11} className="text-neon-orange" /> Fuel not included
                      </>
                    )}
                  </span>
                  {vehicle.requiresLicense && (
                    <span className="px-2 py-1 rounded-full bg-neon-orange/10 border border-neon-orange/30 text-neon-orange flex items-center gap-1">
                      <ShieldCheck size={11} /> License required
                    </span>
                  )}
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="text-[10px] font-ui uppercase tracking-widest text-muted-foreground">
                      Total ({rentalType === "hourly" ? `${hours}h` : `${days}d`})
                    </p>
                    <p className="font-display text-lg font-bold text-foreground">
                      {formatPrice(total)}
                    </p>
                    <p className="text-[10px] text-neon-cyan neon-text-cyan font-ui uppercase tracking-wider">
                      50% Advance {formatPrice(advance)}
                    </p>
                  </div>
                  <button
                    onClick={() => openBooking(unit)}
                    className="px-5 py-2.5 rounded-lg font-ui text-xs uppercase tracking-widest gradient-neon text-primary-foreground transition-transform hover:scale-105"
                  >
                    Rent Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Modal */}
      {showBooking && selectedUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowBooking(false)}
          />
          <div className="relative glass-strong rounded-2xl p-6 md:p-8 max-w-md w-full neon-border-pink animate-slide-up max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-xl font-bold gradient-neon-text mb-1">
              Booking Details
            </h3>
            <p className="text-xs text-muted-foreground font-ui mb-1">
              {selectedUnit.modelName} • {selectedUnit.registrationNo}
            </p>
            <p className="text-xs text-muted-foreground font-ui mb-5">
              {rentalType === "hourly" ? `${hours} hour(s)` : `${days} day(s)`} —{" "}
              <span className="text-foreground">Total {formatPrice(total)}</span> •{" "}
              <span className="text-neon-cyan">Advance {formatPrice(advance)}</span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider mb-1 block">
                  Full Name *
                </label>
                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
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
                  <Phone
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
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
                  <Mail
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
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
                  <CalendarDays
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg glass border border-border text-sm text-foreground focus:outline-none focus:border-primary bg-transparent"
                  />
                </div>
              </div>

              {vehicle.requiresLicense && (
                <>
                  <div>
                    <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider mb-1 block">
                      Driving License No. *
                    </label>
                    <div className="relative">
                      <FileText
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        type="text"
                        value={licenseNo}
                        onChange={(e) => setLicenseNo(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg glass border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary bg-transparent"
                        placeholder="DL-XXXXXXXXX"
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-neon-orange/10 border border-neon-orange/30">
                    <Fuel size={14} className="text-neon-orange mt-0.5 shrink-0" />
                    <p className="text-xs text-neon-orange">
                      Oil/fuel is NOT included. Pickup at:{" "}
                      <span className="font-semibold">{selectedUnit.pickupLocation}</span>
                    </p>
                  </div>
                </>
              )}

              <div className="pt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rental Subtotal</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                {vibesDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neon-cyan">
                      Vibes Lvl {vibesTier.level} discount ({Math.round(vibesTier.vehicleDiscount * 100)}%)
                    </span>
                    <span className="text-neon-cyan">−{formatPrice(vibesDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform fee (2%)</span>
                  <span className="text-foreground">{formatPrice(platformFee)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-border pt-2">
                  <span className="text-muted-foreground">Rental Total</span>
                  <span className="text-foreground">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t border-border pt-2">
                  <span className="text-neon-cyan neon-text-cyan">50% Booking Advance</span>
                  <span className="text-neon-cyan neon-text-cyan">
                    {formatPrice(advance)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg font-ui text-sm uppercase tracking-widest gradient-neon text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {isSubmitting ? "Processing..." : "Confirm & Pay 50% Advance"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
};

export default VehicleSelection;

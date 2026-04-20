import { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  Star,
  MapPin,
  Clock,
  ChevronLeft,
  Users,
  BedDouble,
  Maximize,
  Check,
  Info,
  ShieldCheck,
  CalendarDays,
  Minus,
  Plus,
  Loader2,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { hotels, getRoomGallery, type HotelRoom } from "@/data/hotels";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/hooks/useCurrency";
import { useVibes } from "@/hooks/useVibes";
import AuthModal from "@/components/AuthModal";
import StickyBookingBar from "@/components/StickyBookingBar";

const HotelDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const hotel = hotels.find((h) => h.id === id);
  const { user, profile } = useAuth();
  const { formatPrice } = useCurrency();
  const { tier: vibesTier } = useVibes();

  const [activeImage, setActiveImage] = useState(0);
  const [authOpen, setAuthOpen] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    searchParams.get("checkIn") ? new Date(searchParams.get("checkIn")!) : undefined
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    searchParams.get("checkOut") ? new Date(searchParams.get("checkOut")!) : undefined
  );
  const [guests, setGuests] = useState(
    Number(searchParams.get("guests")) || 2
  );
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom | null>(null);
  const [roomCount, setRoomCount] = useState(1);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Booking form state
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Room photo viewer modal
  const [photosRoom, setPhotosRoom] = useState<HotelRoom | null>(null);

  // Pre-fill from logged-in user's profile (only when fields are still blank).
  useEffect(() => {
    if (profile?.display_name && !guestName) setGuestName(profile.display_name);
    if (user?.email && !guestEmail) setGuestEmail(user.email);
    if (profile?.phone && !guestPhone) setGuestPhone(profile.phone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile]);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Hotel Not Found</h1>
          <Link to="/hotels">
            <Button variant="outline">Back to Hotels</Button>
          </Link>
        </div>
      </div>
    );
  }

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 1;
  const totalPrice = selectedRoom ? selectedRoom.price * nights * roomCount : 0;
  const vibesDiscount = Math.round(totalPrice * vibesTier.hotelDiscount);
  const discountedSubtotal = totalPrice - vibesDiscount;
  const taxes = Math.round(discountedSubtotal * 0.15);
  const platformFee = Math.round(discountedSubtotal * 0.02);
  const grandTotal = discountedSubtotal + taxes + platformFee;


  const handleBooking = async () => {
    if (!guestName || !guestEmail || !guestPhone) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates.");
      return;
    }
    if (!selectedRoom) {
      toast.error("Please select a room.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        category: "hotel",
        hotel_id: hotel.id,
        hotel_name: hotel.name,
        guest_name: guestName,
        guest_email: guestEmail,
        check_in: format(checkIn, "yyyy-MM-dd"),
        check_out: format(checkOut, "yyyy-MM-dd"),
        guests,
        rooms: [{ name: selectedRoom.name, count: roomCount, price: selectedRoom.price }],
        subtotal: totalPrice,
        tax_and_fees: taxes + platformFee - vibesDiscount,
        total: grandTotal,
        special_requests: specialRequests || null,
        user_id: user?.id ?? null,
      });

      if (error) throw error;

      toast.success("Booking confirmed! 🎉", {
        description: `${hotel.name} — ${selectedRoom.name} × ${roomCount} for ${nights} night${nights > 1 ? "s" : ""}. Confirmation sent to ${guestEmail}.`,
        duration: 6000,
      });
      setShowBookingForm(false);
    } catch (err: any) {
      toast.error("Booking failed. Please try again.", {
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Back nav */}
      <div className="pt-16 md:pt-24">
        <div className="container mx-auto">
          <Link
            to="/hotels"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-ui text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4"
          >
            <ChevronLeft size={16} /> Back to Hotels
          </Link>
        </div>
      </div>

      {/* Gallery — swipeable carousel on mobile, grid on desktop */}
      <section className="pb-6">
        <div className="container mx-auto">
          {/* Mobile carousel */}
          <div className="md:hidden">
            <Carousel opts={{ loop: true }} className="rounded-xl overflow-hidden">
              <CarouselContent>
                {hotel.gallery.map((img, i) => (
                  <CarouselItem key={i}>
                    <div className="h-56 sm:h-72 overflow-hidden">
                      <img
                        src={img}
                        alt={`${hotel.name} photo ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
            <div className="flex justify-center gap-1.5 mt-3">
              {hotel.gallery.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40"
                />
              ))}
            </div>
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid grid-cols-4 gap-3 rounded-xl overflow-hidden">
            <div className="col-span-3 h-[420px] overflow-hidden relative">
              <img
                src={hotel.gallery[activeImage]}
                alt={hotel.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
            <div className="flex flex-col gap-3">
              {hotel.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "flex-1 overflow-hidden rounded-lg transition-all duration-300",
                    activeImage === i ? "neon-border-pink neon-glow-pink" : "opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-12 lg:pb-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {hotel.name}
                    </h1>
                    <p className="flex items-center gap-1 text-muted-foreground font-body">
                      <MapPin size={16} /> {hotel.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 glass rounded-lg px-4 py-2">
                    <Star size={18} className="text-neon-orange fill-neon-orange" />
                    <span className="font-display text-lg font-bold text-foreground">{hotel.rating}</span>
                    <span className="text-muted-foreground text-sm">({hotel.reviewCount} reviews)</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {hotel.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-ui uppercase tracking-wider glass text-neon-cyan border border-neon-cyan/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="glass rounded-xl p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-3">About This Property</h2>
                <p className="text-muted-foreground font-body leading-relaxed">{hotel.description}</p>
              </div>

              {/* Amenities */}
              <div className="glass rounded-xl p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hotel.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-muted-foreground font-body text-sm">
                      <Check size={14} className="text-neon-cyan flex-shrink-0" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>

              {/* Check-in / Check-out */}
              <div className="glass rounded-xl p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">Check-in & Check-out</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg glass flex items-center justify-center">
                      <Clock size={18} className="text-neon-cyan" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-ui uppercase tracking-widest">Check-in</p>
                      <p className="text-foreground font-body font-semibold">{hotel.checkInTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg glass flex items-center justify-center">
                      <Clock size={18} className="text-neon-pink" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-ui uppercase tracking-widest">Check-out</p>
                      <p className="text-foreground font-body font-semibold">{hotel.checkOutTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rooms */}
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">Available Rooms</h2>
                <div className="space-y-4">
                  {hotel.rooms.map((room) => (
                    <div
                      key={room.id}
                      className={cn(
                        "glass rounded-xl p-5 transition-all duration-300 cursor-pointer",
                        selectedRoom?.id === room.id
                          ? "neon-border-pink neon-glow-pink"
                          : "border border-border hover:border-primary/30"
                      )}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-display text-base font-semibold text-foreground mb-1">
                            {room.name}
                          </h3>
                          <p className="text-muted-foreground text-sm font-body mb-3">{room.description}</p>
                          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-ui">
                            <span className="flex items-center gap-1">
                              <Users size={14} /> Up to {room.maxGuests} guests
                            </span>
                            <span className="flex items-center gap-1">
                              <BedDouble size={14} /> {room.bedType}
                            </span>
                            <span className="flex items-center gap-1">
                              <Maximize size={14} /> {room.size} sqft
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {room.amenities.map((a) => (
                              <span key={a} className="text-xs text-neon-cyan font-ui">
                                • {a}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-display text-xl font-bold text-primary">
                            {formatPrice(room.price)}
                          </p>
                          <p className="text-xs text-muted-foreground">per night</p>
                          <p className="text-xs text-neon-cyan mt-1">
                            {room.available} {room.available === 1 ? "room" : "rooms"} left
                          </p>
                          {selectedRoom?.id === room.id && (
                            <div className="mt-2 flex items-center gap-2 justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRoomCount(Math.max(1, roomCount - 1));
                                }}
                                aria-label="Decrease room count"
                                className="w-10 h-10 rounded-md glass flex items-center justify-center text-foreground hover:text-primary"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="font-ui text-sm text-foreground w-6 text-center">{roomCount}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRoomCount(Math.min(room.available, roomCount + 1));
                                }}
                                aria-label="Increase room count"
                                className="w-10 h-10 rounded-md glass flex items-center justify-center text-foreground hover:text-primary"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action row */}
                      <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Button
                          variant="outline"
                          className="h-11 sm:flex-1 font-ui text-xs uppercase tracking-widest"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPhotosRoom(room);
                          }}
                        >
                          <ImageIcon size={14} className="mr-2" />
                          Photos
                          <span className="ml-1.5 text-muted-foreground normal-case tracking-normal">
                            ({getRoomGallery(room).length})
                          </span>
                        </Button>
                        <Button
                          className="hidden sm:inline-flex h-11 sm:flex-1 gradient-neon text-primary-foreground font-ui text-xs uppercase tracking-widest neon-glow-pink hover:scale-[1.02] transition-transform"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoom(room);
                            if (!checkIn || !checkOut) {
                              toast.info("Please select your check-in & check-out dates first.");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                              return;
                            }
                            if (!user) {
                              toast.info("Please sign in to reserve.");
                              setAuthOpen(true);
                              return;
                            }
                            setShowBookingForm(true);
                          }}
                        >
                          Proceed
                          <ArrowRight size={14} className="ml-2" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policies */}
              <div className="glass rounded-xl p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">Hotel Policies</h2>
                <div className="space-y-3">
                  {Object.entries(hotel.policies).map(([key, value]) => (
                    <div key={key} className="flex gap-3">
                      <Info size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground font-ui uppercase tracking-widest capitalize">
                          {key}
                        </p>
                        <p className="text-foreground text-sm font-body">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Booking Sidebar (hidden on mobile, replaced by StickyBookingBar) */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-24 space-y-4">
                {/* Price Card */}
                <div className="glass-strong rounded-xl p-6 neon-border-pink">
                  <div className="mb-4">
                    <span className="font-display text-2xl font-bold text-primary">
                      {formatPrice(hotel.price)}
                    </span>
                    <span className="text-muted-foreground text-sm"> / night</span>
                  </div>

                  {/* Date selectors */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-1 block">
                        Check-in
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full text-left text-xs font-body h-9",
                              !checkIn && "text-muted-foreground"
                            )}
                          >
                            {checkIn ? format(checkIn, "MMM dd") : "Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkIn}
                            onSelect={setCheckIn}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-1 block">
                        Check-out
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full text-left text-xs font-body h-9",
                              !checkOut && "text-muted-foreground"
                            )}
                          >
                            {checkOut ? format(checkOut, "MMM dd") : "Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkOut}
                            onSelect={setCheckOut}
                            disabled={(date) => date < (checkIn || new Date())}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-1 block">
                      Guests
                    </label>
                    <div className="flex items-center gap-2 bg-muted border border-border rounded-md px-3 h-9">
                      <Users size={14} className="text-muted-foreground" />
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="bg-transparent text-foreground font-body text-sm flex-1 outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  {selectedRoom && (
                    <div className="space-y-2 mb-4 pt-4 border-t border-border">
                      <div className="flex justify-between text-sm font-body">
                        <span className="text-muted-foreground">
                          {selectedRoom.name} × {roomCount}
                        </span>
                        <span className="text-foreground">
                          {formatPrice(selectedRoom.price * roomCount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-body">
                        <span className="text-muted-foreground">
                          {nights} night{nights > 1 ? "s" : ""}
                        </span>
                        <span className="text-foreground">{formatPrice(totalPrice)}</span>
                      </div>
                      {vibesDiscount > 0 && (
                        <div className="flex justify-between text-sm font-body">
                          <span className="text-neon-cyan">
                            Vibes Lvl {vibesTier.level} discount ({Math.round(vibesTier.hotelDiscount * 100)}%)
                          </span>
                          <span className="text-neon-cyan">−{formatPrice(vibesDiscount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-body">
                        <span className="text-muted-foreground">Taxes & fees (15%)</span>
                        <span className="text-foreground">{formatPrice(taxes)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-body">
                        <span className="text-muted-foreground">Platform fee (2%)</span>
                        <span className="text-foreground">{formatPrice(platformFee)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-border">
                        <span className="font-display text-base font-bold text-foreground">Total</span>
                        <span className="font-display text-base font-bold text-primary">
                          {formatPrice(grandTotal)}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full gradient-neon text-primary-foreground font-ui uppercase tracking-widest h-12 text-sm neon-glow-pink hover:scale-[1.02] transition-transform"
                    onClick={() => {
                      if (!selectedRoom) {
                        toast.error("Please select a room first.");
                        return;
                      }
                      if (!user) {
                        toast.info("Please sign in to confirm your booking.");
                        setAuthOpen(true);
                        return;
                      }
                      setShowBookingForm(true);
                    }}
                  >
                    <CalendarDays size={16} className="mr-2" />
                    Reserve Now
                  </Button>

                  <div className="flex items-center gap-2 mt-3 justify-center">
                    <ShieldCheck size={14} className="text-neon-cyan" />
                    <span className="text-xs text-muted-foreground font-ui">
                      Free cancellation available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingForm && selectedRoom && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm sm:p-4">
          <div className="glass-strong rounded-t-2xl sm:rounded-xl p-5 sm:p-6 md:p-8 w-full sm:max-w-lg neon-border-pink animate-slide-up max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-foreground">Complete Your Booking</h2>
              <button
                onClick={() => setShowBookingForm(false)}
                aria-label="Close booking form"
                className="w-11 h-11 -mr-2 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors text-lg"
              >
                ✕
              </button>
            </div>

            {/* Summary */}
            <div className="glass rounded-lg p-4 mb-6">
              <p className="font-display text-sm font-semibold text-foreground">{hotel.name}</p>
              <p className="text-xs text-muted-foreground font-body">{selectedRoom.name} × {roomCount}</p>
              <div className="flex justify-between mt-2 text-sm font-body">
                <span className="text-muted-foreground">
                  {checkIn ? format(checkIn, "MMM dd") : "—"} → {checkOut ? format(checkOut, "MMM dd, yyyy") : "—"}
                </span>
                <span className="text-primary font-display font-bold">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Guest Details */}
            <div className="space-y-4">
              <div>
                <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-1 block">
                  Full Name *
                </label>
                <Input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="John Doe"
                  autoComplete="name"
                  className="bg-muted border-border font-body h-11"
                />
              </div>
              <div>
                <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-1 block">
                  Email Address *
                </label>
                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="bg-muted border-border font-body h-11"
                />
              </div>
              <div>
                <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-1 block">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+880 1XXX-XXXXXX"
                  className="bg-muted border-border font-body h-11"
                />
              </div>
              <div>
                <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-1 block">
                  Special Requests
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Early check-in, extra pillows, etc."
                  rows={3}
                  className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <Button
              className="w-full mt-6 gradient-neon text-primary-foreground font-ui uppercase tracking-widest h-12 text-sm neon-glow-pink hover:scale-[1.02] transition-transform"
              onClick={handleBooking}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><Loader2 size={16} className="mr-2 animate-spin" /> Processing...</>
              ) : (
                <>Confirm Booking — {formatPrice(grandTotal)}</>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-3 font-body">
              By confirming, you agree to the hotel's cancellation policy and terms of service.
            </p>
          </div>
        </div>
      )}

      {/* Mobile sticky CTA bar (hidden on desktop) */}
      {!showBookingForm && (
        <StickyBookingBar
          priceLabel={
            selectedRoom
              ? `${formatPrice(grandTotal)}`
              : `From ${formatPrice(hotel.price)}`
          }
          subLabel={
            selectedRoom
              ? `${selectedRoom.name} · ${nights} night${nights > 1 ? "s" : ""}`
              : "per night"
          }
          ctaLabel={selectedRoom ? "Reserve" : "Select Room"}
          onCta={() => {
            if (!selectedRoom) {
              const roomsEl = document.querySelector("h2.font-display + div .glass");
              roomsEl?.scrollIntoView({ behavior: "smooth", block: "center" });
              toast.info("Pick a room to continue");
              return;
            }
            if (!user) {
              toast.info("Please sign in to confirm your booking.");
              setAuthOpen(true);
              return;
            }
            setShowBookingForm(true);
          }}
        />
      )}

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />

      {/* Room Photos modal */}
      <Dialog open={!!photosRoom} onOpenChange={(open) => !open && setPhotosRoom(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-background border-border">
          <DialogTitle className="sr-only">
            {photosRoom?.name} photos
          </DialogTitle>
          {photosRoom && (
            <div>
              <div className="px-5 pt-5 pb-3">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {photosRoom.name}
                </h3>
                <p className="text-xs text-muted-foreground font-ui uppercase tracking-widest mt-0.5">
                  {getRoomGallery(photosRoom).length} photos
                </p>
              </div>
              <Carousel opts={{ loop: true }} className="w-full">
                <CarouselContent>
                  {getRoomGallery(photosRoom).map((img, i) => (
                    <CarouselItem key={i}>
                      <div className="aspect-[4/3] sm:aspect-[16/10] bg-muted overflow-hidden">
                        <img
                          src={img}
                          alt={`${photosRoom.name} photo ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
              <div className="p-4 flex justify-end">
                <Button
                  className="gradient-neon text-primary-foreground font-ui text-xs uppercase tracking-widest h-11"
                  onClick={() => {
                    const room = photosRoom;
                    setPhotosRoom(null);
                    setSelectedRoom(room);
                    if (!checkIn || !checkOut) {
                      toast.info("Please select your check-in & check-out dates first.");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      return;
                    }
                    if (!user) {
                      setAuthOpen(true);
                      return;
                    }
                    setShowBookingForm(true);
                  }}
                >
                  Proceed
                  <ArrowRight size={14} className="ml-2" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default HotelDetail;

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Star, MapPin, SlidersHorizontal, X, Users, Wifi, Waves, Dumbbell, UtensilsCrossed, Car, Sparkles } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { hotels } from "@/data/hotels";
import hotelsBanner from "@/assets/hotels-banner.jpg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/useCurrency";
import { useVibes } from "@/hooks/useVibes";
import { useParallax } from "@/hooks/useParallax";

const amenityIcons: Record<string, React.ReactNode> = {
  "Free WiFi": <Wifi size={14} />,
  "Pool": <Waves size={14} />,
  "Infinity Pool": <Waves size={14} />,
  "Gym": <Dumbbell size={14} />,
  "Restaurant": <UtensilsCrossed size={14} />,
  "Parking": <Car size={14} />,
};

const allTags = Array.from(new Set(hotels.flatMap((h) => h.tags)));

const Hotels = () => {
  const { formatPrice } = useCurrency();
  const { tier: vibesTier } = useVibes();
  const bannerRef = useParallax<HTMLImageElement>(0.15, 0.03);
  const hotelDiscountPct = Math.round(vibesTier.hotelDiscount * 100);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 60000]);
  const [showFilters, setShowFilters] = useState(false);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [sortBy, setSortBy] = useState<"price-low" | "price-high" | "rating">("rating");

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered = useMemo(() => {
    let result = hotels.filter((h) => {
      const matchesSearch =
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 || selectedTags.some((t) => h.tags.includes(t));
      const matchesPrice = h.price >= priceRange[0] && h.price <= priceRange[1];
      // Availability: at least one room fits the guest count and has stock.
      // When dates are picked we treat them as an "availability window" and
      // require that the property still has bookable rooms for that party size.
      const hasAvailableRoom = h.rooms.some(
        (r) => r.maxGuests >= guests && r.available > 0
      );
      const matchesAvailability =
        !checkIn && !checkOut ? true : hasAvailableRoom;
      return (
        matchesSearch &&
        matchesTags &&
        matchesPrice &&
        hasAvailableRoom &&
        matchesAvailability
      );
    });

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    else result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [searchQuery, selectedTags, priceRange, sortBy, guests, checkIn, checkOut]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Banner */}
      <section className="relative pt-16 md:pt-20">
        <div className="relative h-[260px] sm:h-[320px] md:h-[420px] overflow-hidden">
          <img
            ref={bannerRef}
            src={hotelsBanner}
            alt="Neon-lit luxury hotels along Cox's Bazar Marine Drive at night"
            className="w-full h-[115%] object-cover will-change-transform origin-center -translate-y-[5%]"
            width={1920}
            height={640}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-background/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/35 to-transparent" />
          <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-0 right-0 container mx-auto">
            <p
              className="font-ui text-xs sm:text-sm uppercase tracking-[0.3em] text-neon-cyan neon-text-cyan mb-2"
              style={{ textShadow: "0 0 14px hsl(180 100% 55% / 0.95), 0 2px 10px hsl(0 0% 0% / 0.95)" }}
            >
              Stay in style
            </p>
            <h1
              className="font-display text-3xl sm:text-5xl md:text-7xl font-bold gradient-neon-text leading-[1.05] lg:text-6xl"
              style={{
                filter:
                  "drop-shadow(0 0 26px hsl(180 100% 55% / 0.6)) drop-shadow(0 6px 20px hsl(0 0% 0% / 0.98))",
              }}
            >
              Find Your Perfect Stay
            </h1>
            <p
              className="mt-3 sm:mt-4 max-w-xl font-body text-sm sm:text-base md:text-xl text-foreground/90"
              style={{ textShadow: "0 2px 14px hsl(0 0% 0% / 0.98)" }}
            >
              Beachfront luxury along Marine Drive. Search Cox's Bazar hotels — best rates guaranteed.
            </p>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="pt-6 pb-6 sm:pt-8 sm:pb-8 md:pt-12 md:pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto relative">

          {/* Search Bar — Booking.com style */}
          <div className="glass-strong rounded-xl p-4 md:p-6 neon-border-pink max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 items-end">
              {/* Destination */}
              <div>
                <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-1 block">
                  Destination
                </label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cox's Bazar"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoComplete="off"
                    className="pl-9 bg-muted border-border font-body h-11"
                  />
                </div>
              </div>

              {/* Check-in */}
              <div>
                <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-1 block">
                  Check-in
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-body h-11",
                        !checkIn && "text-muted-foreground"
                      )}
                    >
                      {checkIn ? format(checkIn, "MMM dd, yyyy") : "Select date"}
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

              {/* Check-out */}
              <div>
                <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-1 block">
                  Check-out
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-body h-11",
                        !checkOut && "text-muted-foreground"
                      )}
                    >
                      {checkOut ? format(checkOut, "MMM dd, yyyy") : "Select date"}
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

              {/* Guests & Search */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-1 block">
                    Guests
                  </label>
                  <div className="flex items-center gap-2 bg-muted border border-border rounded-md px-3 h-11">
                    <Users size={16} className="text-muted-foreground" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="bg-transparent text-foreground font-body text-sm flex-1 outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 border-border"
                    aria-label="Toggle filters"
                  >
                    <SlidersHorizontal size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-border animate-slide-up">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="font-ui text-xs uppercase tracking-widest text-muted-foreground mr-2 self-center">
                    Tags:
                  </span>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-ui uppercase tracking-wider transition-all",
                        selectedTags.includes(tag)
                          ? "gradient-neon text-primary-foreground neon-glow-pink"
                          : "glass text-muted-foreground border border-border hover:border-primary/50"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                  {selectedTags.length > 0 && (
                    <button
                      onClick={() => setSelectedTags([])}
                      className="px-3 py-1 text-xs font-ui uppercase text-destructive hover:text-destructive/80"
                    >
                      <X size={12} className="inline mr-1" /> Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <span className="font-ui text-xs uppercase tracking-widest text-muted-foreground">
                    Sort by:
                  </span>
                  {(
                    [
                      { value: "rating", label: "Top Rated" },
                      { value: "price-low", label: "Price: Low → High" },
                      { value: "price-high", label: "Price: High → Low" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-ui uppercase tracking-wider transition-all",
                        sortBy === opt.value
                          ? "gradient-neon text-primary-foreground"
                          : "glass text-muted-foreground border border-border"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="pb-16 sm:pb-20">
        <div className="container mx-auto">
          <p className="font-ui text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
            {filtered.length} {filtered.length === 1 ? "property" : "properties"} found
            {(checkIn || checkOut) && (
              <span className="ml-1">
                · available for {guests} {guests === 1 ? "guest" : "guests"}
                {checkIn && checkOut
                  ? ` (${format(checkIn, "MMM dd")} → ${format(checkOut, "MMM dd")})`
                  : ""}
              </span>
            )}
          </p>

          <div className="flex flex-col gap-4 sm:gap-6">
            {filtered.map((hotel, i) => (
              <Link
                to={`/hotels/${hotel.id}${checkIn ? `?checkIn=${checkIn.toISOString()}` : ""}${checkOut ? `${checkIn ? "&" : "?"}checkOut=${checkOut.toISOString()}` : ""}${`${checkIn || checkOut ? "&" : "?"}guests=${guests}`}`}
                key={hotel.id}
                className="group glass rounded-xl overflow-hidden neon-border-pink transition-all duration-500 hover:neon-glow-pink animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="relative w-full md:w-72 lg:w-80 h-44 sm:h-56 md:h-auto flex-shrink-0 overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 glass rounded-full px-3 py-1 flex items-center gap-1">
                      <Star size={14} className="text-neon-orange fill-neon-orange" />
                      <span className="font-ui text-sm text-foreground">{hotel.rating}</span>
                      <span className="text-muted-foreground text-xs">({hotel.reviewCount})</span>
                    </div>
                    {hotelDiscountPct > 0 && (
                      <div className="absolute top-3 right-3 rounded-full px-2.5 py-1 flex items-center gap-1 gradient-neon text-primary-foreground neon-glow-pink">
                        <Sparkles size={12} />
                        <span className="font-ui text-[10px] uppercase tracking-wider font-bold">
                          Vibes perk: {hotelDiscountPct}% off
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-4 sm:p-5 md:p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-base sm:text-lg md:text-xl font-semibold text-foreground mb-1">
                        {hotel.name}
                      </h3>
                      <p className="flex items-center gap-1 text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3">
                        <MapPin size={14} className="shrink-0" /> {hotel.location}
                      </p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        {hotel.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-ui uppercase tracking-wider glass text-neon-cyan border border-neon-cyan/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 font-body mb-2 sm:mb-3">
                        {hotel.description}
                      </p>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {hotel.amenities.slice(0, 5).map((amenity) => (
                          <span
                            key={amenity}
                            className="flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground font-ui"
                          >
                            {amenityIcons[amenity] || null}
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities.length > 5 && (
                          <span className="text-[11px] sm:text-xs text-primary font-ui">
                            +{hotel.amenities.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
                      <div className="min-w-0">
                        <span className="font-display text-lg sm:text-xl md:text-2xl font-bold text-primary">
                          {formatPrice(hotel.price)}
                        </span>
                        <span className="text-muted-foreground text-xs sm:text-sm"> / night</span>
                      </div>
                      <span className="px-4 sm:px-5 py-2 min-h-[40px] inline-flex items-center rounded-lg font-ui text-[11px] sm:text-xs uppercase tracking-widest gradient-neon text-primary-foreground transition-transform group-hover:scale-105 shrink-0">
                        View Details
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground font-body text-lg">No hotels match your search.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTags([]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Hotels;

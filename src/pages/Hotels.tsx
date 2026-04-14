import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Star, MapPin, SlidersHorizontal, X, Users, Wifi, Waves, Dumbbell, UtensilsCrossed, Car } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { hotels } from "@/data/hotels";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
      return matchesSearch && matchesTags && matchesPrice;
    });

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    else result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [searchQuery, selectedTags, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Search Bar */}
      <section className="pt-24 pb-8 md:pt-32 md:pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <h1 className="font-display text-3xl md:text-5xl font-bold gradient-neon-text text-center mb-2">
            Find Your Perfect Stay
          </h1>
          <p className="text-center text-muted-foreground mb-8 font-body">
            Search hotels in Cox's Bazar — best rates guaranteed
          </p>

          {/* Search Bar — Booking.com style */}
          <div className="glass-strong rounded-xl p-4 md:p-6 neon-border-pink max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
                    className="pl-9 bg-muted border-border font-body"
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
                        "w-full justify-start text-left font-body",
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
                        "w-full justify-start text-left font-body",
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
                  <div className="flex items-center gap-2 bg-muted border border-border rounded-md px-3 h-10">
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
                    className="h-10 w-10 border-border"
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
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <p className="font-ui text-sm text-muted-foreground mb-6">
            {filtered.length} {filtered.length === 1 ? "property" : "properties"} found
          </p>

          <div className="flex flex-col gap-6">
            {filtered.map((hotel, i) => (
              <Link
                to={`/hotels/${hotel.id}${checkIn ? `?checkIn=${checkIn.toISOString()}` : ""}${checkOut ? `${checkIn ? "&" : "?"}checkOut=${checkOut.toISOString()}` : ""}${`${checkIn || checkOut ? "&" : "?"}guests=${guests}`}`}
                key={hotel.id}
                className="group glass rounded-xl overflow-hidden neon-border-pink transition-all duration-500 hover:neon-glow-pink animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="relative w-full md:w-80 h-56 md:h-auto flex-shrink-0 overflow-hidden">
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
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-lg md:text-xl font-semibold text-foreground mb-1">
                        {hotel.name}
                      </h3>
                      <p className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                        <MapPin size={14} /> {hotel.location}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {hotel.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full text-xs font-ui uppercase tracking-wider glass text-neon-cyan border border-neon-cyan/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2 font-body mb-3">
                        {hotel.description}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {hotel.amenities.slice(0, 5).map((amenity) => (
                          <span
                            key={amenity}
                            className="flex items-center gap-1 text-xs text-muted-foreground font-ui"
                          >
                            {amenityIcons[amenity] || null}
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities.length > 5 && (
                          <span className="text-xs text-primary font-ui">
                            +{hotel.amenities.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div>
                        <span className="font-display text-xl md:text-2xl font-bold text-primary">
                          ৳{hotel.price.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground text-sm"> / night</span>
                      </div>
                      <span className="px-5 py-2 rounded-lg font-ui text-xs uppercase tracking-widest gradient-neon text-primary-foreground transition-transform group-hover:scale-105">
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

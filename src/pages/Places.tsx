import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { MapPin, Clock, Camera, Compass, Navigation, Search, X, ArrowUpDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { places, type PlaceCategory } from "@/data/places";
import placesBanner from "@/assets/places-banner.jpg";

const categories: ("All" | PlaceCategory)[] = [
  "All",
  "Beach",
  "Drive",
  "Island",
  "Nature",
  "Cultural",
  "Family",
  "Market",
];

type SortKey = "default" | "category" | "best-time" | "distance-asc" | "distance-desc" | "name";

const Places = () => {
  const [activeCategory, setActiveCategory] = useState<"All" | PlaceCategory>("All");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("default");

  // Apply category, search, then sort.
  const visiblePlaces = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = places.filter((p) => {
      const inCat = activeCategory === "All" || p.category === activeCategory;
      if (!inCat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.distance ?? "").toLowerCase().includes(q) ||
        p.tip.toLowerCase().includes(q)
      );
    });

    const sorted = [...list];
    switch (sortKey) {
      case "category":
        sorted.sort((a, b) => a.category.localeCompare(b.category) || a.distanceKm - b.distanceKm);
        break;
      case "best-time":
        sorted.sort((a, b) => a.seasonStart - b.seasonStart || a.name.localeCompare(b.name));
        break;
      case "distance-asc":
        sorted.sort((a, b) => a.distanceKm - b.distanceKm);
        break;
      case "distance-desc":
        sorted.sort((a, b) => b.distanceKm - a.distanceKm);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return sorted;
  }, [activeCategory, query, sortKey]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Banner */}
      <section className="relative pt-16 md:pt-20">
        <div className="relative h-[55vh] sm:h-[60vh] md:h-[70vh] w-full overflow-hidden">
          <img
            src={placesBanner}
            alt="Cox's Bazar destinations collage banner"
            width={1920}
            height={1080}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/20 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />

          <div className="pointer-events-none absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-neon-pink/15 blur-[80px] sm:blur-[120px] animate-float" />
          <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-neon-cyan/15 blur-[70px] sm:blur-[100px] animate-float" style={{ animationDelay: "2s" }} />

          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-end pb-10 sm:pb-14 md:pb-20 text-center">
            <p
              className="font-ui text-xs sm:text-sm uppercase tracking-[0.3em] text-neon-cyan mb-3 neon-text-blue animate-slide-up"
              style={{ textShadow: "0 2px 12px hsl(0 0% 0% / 0.9)" }}
            >
              19 destinations · One unforgettable coastline
            </p>
            <h1
              className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-5 animate-slide-up"
              style={{
                filter:
                  "drop-shadow(0 0 24px hsl(320 100% 60% / 0.45)) drop-shadow(0 4px 18px hsl(0 0% 0% / 0.95))",
              }}
            >
              <span className="gradient-neon-text">Places of Cox's Bazar</span>
            </h1>
            <p
              className="font-body text-sm sm:text-base md:text-lg text-foreground/90 max-w-2xl mb-6 animate-slide-up"
              style={{ textShadow: "0 2px 14px hsl(0 0% 0% / 0.95)" }}
            >
              From the world's longest beach to coral islands, golden pagodas, hidden waterfalls, and bustling Burmese
              bazaars — every spot worth your itinerary, in one map-ready guide.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 animate-slide-up">
              <a
                href="#map"
                className="px-6 py-3 rounded-lg font-ui text-sm uppercase tracking-widest gradient-neon text-primary-foreground neon-glow-pink transition-transform duration-300 hover:scale-105"
              >
                Open the map
              </a>
              <Link
                to="/experiences"
                className="px-6 py-3 rounded-lg font-ui text-sm uppercase tracking-widest glass neon-border-blue text-secondary transition-all duration-300 hover:scale-105 hover:neon-glow-blue"
              >
                Plan an experience
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive map */}
      <section id="map" className="container mx-auto px-4 pt-12 sm:pt-16">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Compass size={18} className="text-neon-cyan" />
            <p className="font-ui text-xs sm:text-sm uppercase tracking-[0.3em] text-neon-blue neon-text-blue">
              Interactive coastline map
            </p>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold gradient-neon-text">
            Tap a pin · Filter · Jump
          </h2>
        </div>
        <PlacesMap
          places={places}
          activePlaceSlug={activePin}
          hoveredSlug={hoveredPin}
          onPinClick={handlePinClick}
          onPinHover={setHoveredPin}
        />
      </section>

      {/* Search + Sort + Filter */}
      <section id="all-places" className="container mx-auto px-4 pt-10 sm:pt-14">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-6 max-w-4xl mx-auto">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search beaches, islands, temples, tips…"
              className="pl-9 pr-9 h-11 glass border-border/60 focus-visible:ring-neon-cyan focus-visible:ring-offset-0"
              aria-label="Search places"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={16} className="text-neon-cyan shrink-0" />
            <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
              <SelectTrigger
                className="w-full md:w-[220px] h-11 glass border-border/60 font-ui text-sm"
                aria-label="Sort places"
              >
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover">
                <SelectItem value="default">Featured order</SelectItem>
                <SelectItem value="category">Category (A → Z)</SelectItem>
                <SelectItem value="best-time">Best time (Jan → Dec)</SelectItem>
                <SelectItem value="distance-asc">Distance · nearest first</SelectItem>
                <SelectItem value="distance-desc">Distance · farthest first</SelectItem>
                <SelectItem value="name">Name (A → Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category chips */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Compass size={18} className="text-neon-cyan" />
          <p className="font-ui text-xs sm:text-sm uppercase tracking-[0.3em] text-neon-blue neon-text-blue">
            Filter by vibe
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          {categories.map((cat) => {
            const count =
              cat === "All" ? places.length : places.filter((p) => p.category === cat).length;
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-ui text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 ${
                  active
                    ? "gradient-neon text-primary-foreground neon-glow-pink scale-105"
                    : "glass border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50"
                }`}
              >
                {cat}
                <span className="ml-1.5 opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Result count */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground mb-10 sm:mb-14 font-ui">
          Showing <span className="text-foreground font-medium">{visiblePlaces.length}</span> of {places.length} places
        </p>
      </section>

      {/* Places list */}
      <section className="pb-16 sm:pb-24 md:pb-32 relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/4 w-64 sm:w-80 h-64 sm:h-80 bg-neon-cyan/5 rounded-full blur-[80px] sm:blur-[120px]" />
        <div className="pointer-events-none absolute bottom-1/4 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-neon-pink/5 rounded-full blur-[80px] sm:blur-[120px]" />

        <div className="container mx-auto px-4">
          {visiblePlaces.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <p className="font-ui text-sm uppercase tracking-widest text-muted-foreground mb-3">
                Nothing matches that yet
              </p>
              <h3 className="font-display text-2xl font-bold mb-3">Try a different search</h3>
              <button
                onClick={() => {
                  setQuery("");
                  setActiveCategory("All");
                }}
                className="px-5 py-2.5 rounded-lg font-ui text-sm uppercase tracking-widest gradient-neon text-primary-foreground neon-glow-pink"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-10 sm:space-y-12">
              {visiblePlaces.map((place, i) => {
                const highlighted = activePin === place.slug;
                return (
                  <article
                    key={place.slug}
                    id={`place-${place.slug}`}
                    ref={(el) => (cardRefs.current[place.slug] = el)}
                    className={`flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-5 sm:gap-6 md:gap-10 items-center animate-slide-up rounded-2xl transition-all duration-500 ${
                      highlighted
                        ? "ring-2 ring-neon-pink/70 shadow-[0_0_40px_hsl(320_100%_60%_/_0.35)]"
                        : ""
                    }`}
                    style={{ animationDelay: `${(i % 6) * 80}ms` }}
                  >
                    <div className="w-full md:w-1/2 rounded-xl overflow-hidden neon-border-blue group relative">
                      <img
                        src={place.image}
                        alt={place.name}
                        loading="lazy"
                        width={800}
                        height={500}
                        className="w-full h-52 sm:h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass-strong border border-neon-pink/40 font-ui text-[10px] uppercase tracking-widest text-neon-pink">
                        {place.category}
                      </span>
                    </div>
                    <div className="w-full md:w-1/2 space-y-3 sm:space-y-4">
                      <div className="flex items-start gap-2">
                        <MapPin size={20} className="text-primary shrink-0 mt-1" />
                        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
                          {place.name}
                        </h2>
                      </div>
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                        {place.description}
                      </p>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        <span className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg glass text-xs sm:text-sm font-ui">
                          <Clock size={14} className="text-neon-cyan shrink-0" />
                          <span className="text-muted-foreground">Best:</span>
                          <span className="text-foreground">{place.bestTime}</span>
                        </span>
                        {place.distance && (
                          <span className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg glass text-xs sm:text-sm font-ui">
                            <Navigation size={14} className="text-neon-purple shrink-0" />
                            <span className="text-foreground">{place.distance}</span>
                          </span>
                        )}
                        <span className="flex items-start gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg glass text-xs sm:text-sm font-ui max-w-full">
                          <Camera size={14} className="text-neon-pink shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{place.tip}</span>
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-16 sm:mt-20 text-center">
            <p className="font-ui text-xs sm:text-sm uppercase tracking-[0.3em] text-neon-blue mb-3 neon-text-blue">
              Ready to explore?
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-bold gradient-neon-text mb-6">
              Book your ride or stay
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/vehicles"
                className="px-6 py-3 rounded-lg font-ui text-sm uppercase tracking-widest gradient-neon text-primary-foreground neon-glow-pink transition-transform duration-300 hover:scale-105"
              >
                Find a vehicle
              </Link>
              <Link
                to="/hotels"
                className="px-6 py-3 rounded-lg font-ui text-sm uppercase tracking-widest glass neon-border-blue text-secondary transition-all duration-300 hover:scale-105 hover:neon-glow-blue"
              >
                Browse hotels
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Places;

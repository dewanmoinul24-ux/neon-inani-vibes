import { Link } from "react-router-dom";
import { Star, MapPin, Waves } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import hotel1 from "@/assets/hotel-1.jpg";
import hotel2 from "@/assets/hotel-2.jpg";
import hotel3 from "@/assets/hotel-3.jpg";

const hotels = [
  {
    id: "ocean-neon-resort",
    name: "Ocean Neon Resort",
    location: "Inani Beach",
    price: 12500,
    rating: 4.8,
    image: hotel1,
    tags: ["Sea View", "Pool", "Family"],
  },
  {
    id: "sunset-bay-boutique",
    name: "Sunset Bay Boutique",
    location: "Kolatoli",
    price: 8500,
    rating: 4.5,
    image: hotel2,
    tags: ["Couple", "Sea View", "Spa"],
  },
  {
    id: "azure-beach-club",
    name: "The Azure Beach Club",
    location: "Marine Drive",
    price: 18000,
    rating: 4.9,
    image: hotel3,
    tags: ["Luxury", "Pool", "Party"],
  },
];

const HotelSection = () => {
  const { formatPrice } = useCurrency();
  return (
    <section id="hotels" className="py-14 sm:py-20 md:py-32 relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-neon-pink/5 rounded-full blur-[100px] sm:blur-[150px]" />
      <div className="container mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <p className="font-ui text-xs sm:text-sm uppercase tracking-[0.3em] text-neon-cyan mb-3 neon-text-cyan">
            Stay in style
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold gradient-neon-text">
            Featured Hotels
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
          {hotels.map((hotel, i) => (
            <div
              key={hotel.name}
              className="group glass rounded-xl overflow-hidden neon-border-pink transition-all duration-500 hover:neon-glow-pink hover:scale-[1.02] animate-slide-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 glass rounded-full px-3 py-1 flex items-center gap-1">
                  <Star size={14} className="text-neon-orange fill-neon-orange" />
                  <span className="font-ui text-sm text-foreground">{hotel.rating}</span>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="font-display text-base sm:text-lg font-semibold text-foreground mb-1">
                  {hotel.name}
                </h3>
                <p className="flex items-center gap-1 text-muted-foreground text-xs sm:text-sm mb-3">
                  <MapPin size={14} className="shrink-0" /> {hotel.location}
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                  {hotel.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-ui uppercase tracking-wider glass text-neon-cyan border border-neon-cyan/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-display text-lg sm:text-xl font-bold text-primary">
                      {formatPrice(hotel.price)}
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm"> / night</span>
                  </div>
                  <Link
                    to={`/hotels/${hotel.id}`}
                    className="px-4 py-2 rounded-lg font-ui text-xs uppercase tracking-widest gradient-neon text-primary-foreground transition-transform hover:scale-105 shrink-0"
                  >
                    Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 sm:mt-12">
          <Link
            to="/hotels"
            className="inline-block px-7 sm:px-8 py-3 rounded-lg font-ui text-sm uppercase tracking-widest gradient-neon text-primary-foreground neon-glow-pink transition-all duration-300 hover:scale-105"
          >
            View All Hotels
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HotelSection;

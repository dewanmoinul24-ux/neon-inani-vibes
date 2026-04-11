import { Star, MapPin, Waves } from "lucide-react";
import hotel1 from "@/assets/hotel-1.jpg";
import hotel2 from "@/assets/hotel-2.jpg";
import hotel3 from "@/assets/hotel-3.jpg";

const hotels = [
  {
    name: "Ocean Neon Resort",
    location: "Inani Beach",
    price: 12500,
    rating: 4.8,
    image: hotel1,
    tags: ["Sea View", "Pool", "Family"],
  },
  {
    name: "Sunset Bay Boutique",
    location: "Kolatoli",
    price: 8500,
    rating: 4.5,
    image: hotel2,
    tags: ["Couple", "Sea View", "Spa"],
  },
  {
    name: "The Azure Beach Club",
    location: "Marine Drive",
    price: 18000,
    rating: 4.9,
    image: hotel3,
    tags: ["Luxury", "Pool", "Party"],
  },
];

const HotelSection = () => {
  return (
    <section id="hotels" className="py-20 md:py-32 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-pink/5 rounded-full blur-[150px]" />
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="font-ui text-sm uppercase tracking-[0.3em] text-neon-cyan mb-3 neon-text-cyan">
            Stay in style
          </p>
          <h2 className="font-display text-2xl md:text-4xl font-bold gradient-neon-text">
            Featured Hotels
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {hotels.map((hotel, i) => (
            <div
              key={hotel.name}
              className="group glass rounded-xl overflow-hidden neon-border-pink transition-all duration-500 hover:neon-glow-pink hover:scale-[1.02] animate-slide-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="relative h-56 overflow-hidden">
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
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                  {hotel.name}
                </h3>
                <p className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                  <MapPin size={14} /> {hotel.location}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-xs font-ui uppercase tracking-wider glass text-neon-cyan border border-neon-cyan/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-display text-xl font-bold text-primary">
                      ৳{hotel.price.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-sm"> / night</span>
                  </div>
                  <button className="px-4 py-2 rounded-lg font-ui text-xs uppercase tracking-widest gradient-neon text-primary-foreground transition-transform hover:scale-105">
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotelSection;

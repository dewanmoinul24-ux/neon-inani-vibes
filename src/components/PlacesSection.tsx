import { MapPin, Clock, Camera } from "lucide-react";
import inaniImg from "@/assets/place-inani.jpg";
import marineImg from "@/assets/place-marine-drive.jpg";
import himchariImg from "@/assets/place-himchari.jpg";

const places = [
  {
    name: "Inani Beach",
    image: inaniImg,
    description: "Pristine rocky coral beach with crystal-clear waters — the quieter gem of Cox's Bazar.",
    bestTime: "Nov - Mar",
    tip: "Visit during low tide for the best coral views",
  },
  {
    name: "Marine Drive",
    image: marineImg,
    description: "The world's longest natural sea beach road — 80km of stunning coastal highway.",
    bestTime: "Year-round",
    tip: "Sunset drives are absolutely magical",
  },
  {
    name: "Himchari",
    image: himchariImg,
    description: "Lush green hills meeting the sea, with waterfalls hidden in the jungle canopy.",
    bestTime: "Jun - Sep",
    tip: "The waterfall is at its best during monsoon season",
  },
];

const PlacesSection = () => {
  return (
    <section id="places" className="py-14 sm:py-20 md:py-32 relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/4 w-64 sm:w-80 h-64 sm:h-80 bg-neon-cyan/5 rounded-full blur-[80px] sm:blur-[120px]" />
      <div className="container mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <p className="font-ui text-xs sm:text-sm uppercase tracking-[0.3em] text-neon-blue mb-3 neon-text-blue">
            Discover paradise
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold gradient-neon-text">
            Places to Visit
          </h2>
        </div>

        <div className="space-y-10 sm:space-y-12">
          {places.map((place, i) => (
            <div
              key={place.name}
              className={`flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-5 sm:gap-6 md:gap-10 items-center animate-slide-up`}
              style={{ animationDelay: `${i * 200}ms` }}
            >
              <div className="w-full md:w-1/2 rounded-xl overflow-hidden neon-border-blue group">
                <img
                  src={place.image}
                  alt={place.name}
                  loading="lazy"
                  className="w-full h-52 sm:h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-primary shrink-0" />
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">
                    {place.name}
                  </h3>
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
                  <span className="flex items-start gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg glass text-xs sm:text-sm font-ui max-w-full">
                    <Camera size={14} className="text-neon-pink shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{place.tip}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlacesSection;

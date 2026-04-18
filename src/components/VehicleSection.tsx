import { Bike, Car, Truck, User, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const vehicles = [
  {
    name: "Scooter / Bike",
    icon: Bike,
    priceHour: 200,
    priceDay: 1200,
    driver: "Self-Drive",
    color: "neon-cyan",
  },
  {
    name: "Sedan Car",
    icon: Car,
    priceHour: 600,
    priceDay: 4500,
    driver: "With Driver",
    color: "neon-pink",
  },
  {
    name: "Beach Jeep",
    icon: Truck,
    priceHour: 1000,
    priceDay: 7000,
    driver: "With Driver",
    color: "neon-purple",
  },
];

const VehicleSection = () => {
  return (
    <section id="vehicles" className="py-20 md:py-32 relative">
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-neon-blue/5 rounded-full blur-[120px]" />
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="font-ui text-sm uppercase tracking-[0.3em] text-neon-pink mb-3 neon-text-pink">
            Ride the coast
          </p>
          <h2 className="font-display text-2xl md:text-4xl font-bold gradient-neon-text">
            Vehicle Rental
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
          {vehicles.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={v.name}
                className="glass rounded-xl p-6 text-center neon-border-blue transition-all duration-500 hover:neon-glow-blue hover:scale-[1.03] animate-slide-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full glass flex items-center justify-center">
                  <Icon size={28} className={`text-${v.color}`} />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {v.name}
                </h3>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-ui uppercase glass text-neon-cyan border border-neon-cyan/20 mb-4">
                  <User size={12} /> {v.driver}
                </span>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock size={14} /> Per Hour
                    </span>
                    <span className="font-display font-bold text-primary">
                      ৳{v.priceHour}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock size={14} /> Per Day
                    </span>
                    <span className="font-display font-bold text-secondary">
                      ৳{v.priceDay.toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-[10px] font-ui uppercase tracking-widest text-neon-cyan neon-text-cyan">
                  Whole Day = 8 hrs from pickup
                </p>
                <Link
                  to="/vehicles"
                  className="mt-3 block w-full px-4 py-2.5 rounded-lg font-ui text-xs uppercase tracking-widest gradient-neon text-primary-foreground transition-transform hover:scale-105"
                >
                  Select
                </Link>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-ui text-sm uppercase tracking-widest gradient-neon text-primary-foreground neon-glow-pink transition-all duration-300 hover:scale-105"
          >
            View All Vehicles <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VehicleSection;

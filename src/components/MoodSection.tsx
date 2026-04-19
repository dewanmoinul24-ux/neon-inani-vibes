import { Heart, Compass, Coffee, PartyPopper } from "lucide-react";

const moods = [
  {
    label: "Romantic",
    icon: Heart,
    description: "Sunset dinners, couple resorts & private beach walks",
    gradient: "from-pink-600 to-rose-500",
  },
  {
    label: "Adventure",
    icon: Compass,
    description: "Water sports, jungle treks & Marine Drive road trips",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    label: "Chill",
    icon: Coffee,
    description: "Beachside lounging, spa retreats & peaceful sunrises",
    gradient: "from-teal-500 to-emerald-600",
  },
  {
    label: "Party",
    icon: PartyPopper,
    description: "Beach bonfires, live music & neon nightlife vibes",
    gradient: "from-purple-500 to-pink-500",
  },
];

const MoodSection = () => {
  return (
    <section className="py-14 sm:py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <p className="font-ui text-xs sm:text-sm uppercase tracking-[0.3em] text-neon-purple mb-3" style={{ textShadow: "0 0 10px hsl(270 80% 60% / 0.8)" }}>
            What's your vibe?
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold gradient-neon-text">
            Mood-Based Discovery
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {moods.map((mood, i) => {
            const Icon = mood.icon;
            return (
              <button
                key={mood.label}
                className="group glass rounded-xl p-4 sm:p-6 text-center neon-border-pink transition-all duration-500 hover:neon-glow-pink hover:scale-[1.05] animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br ${mood.gradient} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <Icon size={22} className="text-foreground" />
                </div>
                <h3 className="font-display text-sm md:text-base font-semibold text-foreground mb-1.5 sm:mb-2">
                  {mood.label}
                </h3>
                <p className="text-muted-foreground text-[11px] sm:text-xs leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {mood.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MoodSection;

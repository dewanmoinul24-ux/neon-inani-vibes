import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rafiq Ahmed",
    location: "Dhaka",
    text: "InaniVibes made our family trip unforgettable. The hotel booking was seamless and the beach party experience was incredible!",
    rating: 5,
  },
  {
    name: "Priya Sen",
    location: "Chittagong",
    text: "Best travel platform for Cox's Bazar. The jeep rental for Marine Drive was worth every taka. Will definitely use again!",
    rating: 5,
  },
  {
    name: "James Wilson",
    location: "London, UK",
    text: "As a foreign tourist, InaniVibes gave me the premium experience I was looking for. The neon beach parties are unreal!",
    rating: 4,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="about" className="py-14 sm:py-20 md:py-32 relative overflow-hidden">
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-neon-pink/5 rounded-full blur-[100px] sm:blur-[150px]" />
      <div className="container mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <p className="font-ui text-xs sm:text-sm uppercase tracking-[0.3em] text-neon-cyan mb-3 neon-text-cyan">
            Real stories
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold gradient-neon-text">
            What Travelers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="glass rounded-xl p-5 sm:p-6 neon-border-blue transition-all duration-500 hover:neon-glow-blue animate-slide-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <Quote size={24} className="text-primary/40 mb-3 sm:mb-4" />
              <p className="text-muted-foreground leading-relaxed mb-5 sm:mb-6 text-sm">
                "{t.text}"
              </p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star
                    key={si}
                    size={14}
                    className={si < t.rating ? "text-neon-orange fill-neon-orange" : "text-muted"}
                  />
                ))}
              </div>
              <p className="font-display text-sm font-semibold text-foreground">{t.name}</p>
              <p className="text-muted-foreground text-xs">{t.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

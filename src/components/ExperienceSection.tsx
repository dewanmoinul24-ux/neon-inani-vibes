import partyImg from "@/assets/experience-party.jpg";
import sportsImg from "@/assets/experience-sports.jpg";
import musicImg from "@/assets/experience-music.jpg";

const experiences = [
  {
    title: "Beach Bonfire Night",
    description: "Dance under the stars with live DJ, bonfire, and neon lights on the beach.",
    image: partyImg,
    tag: "Party",
    price: "৳1,500",
  },
  {
    title: "Water Sports Adventure",
    description: "Jet skiing, parasailing, and banana boat rides along Cox's Bazar coast.",
    image: sportsImg,
    tag: "Adventure",
    price: "৳2,000",
  },
  {
    title: "Live Music Festival",
    description: "Beach concerts featuring top Bangladeshi artists under the neon sky.",
    image: musicImg,
    tag: "Music",
    price: "৳800",
  },
];

const ExperienceSection = () => {
  return (
    <section id="experiences" className="py-20 md:py-32 relative">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-neon-purple/5 rounded-full blur-[150px]" />
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="font-ui text-sm uppercase tracking-[0.3em] text-neon-orange mb-3" style={{ textShadow: "0 0 10px hsl(25 100% 55% / 0.8)" }}>
            Feel the vibes
          </p>
          <h2 className="font-display text-2xl md:text-4xl font-bold gradient-neon-text">
            Experiences & Events
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {experiences.map((exp, i) => (
            <div
              key={exp.title}
              className="group relative rounded-xl overflow-hidden h-96 animate-slide-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <img
                src={exp.image}
                alt={exp.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 neon-glow-pink rounded-xl" />

              <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <span className="self-start px-3 py-1 rounded-full text-xs font-ui uppercase tracking-wider gradient-neon text-primary-foreground mb-3">
                  {exp.tag}
                </span>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {exp.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {exp.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-primary text-lg">{exp.price}</span>
                  <button className="px-4 py-2 rounded-lg font-ui text-xs uppercase tracking-widest glass neon-border-pink text-primary transition-transform hover:scale-105">
                    Join
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

export default ExperienceSection;

import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import bannerImg from "@/assets/experiences-banner.jpg";
import { getUpcomingEvents } from "@/data/experiences";
import { useCurrency } from "@/hooks/useCurrency";

const formatEventDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const ExperienceSection = () => {
  const { formatPrice: format } = useCurrency();
  const featured = getUpcomingEvents().slice(0, 3);

  return (
    <section id="experiences" className="py-14 sm:py-20 md:py-32 relative overflow-hidden">
      <div className="pointer-events-none absolute top-1/2 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-neon-purple/5 rounded-full blur-[100px] sm:blur-[150px]" />
      <div className="container mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <p
            className="font-ui text-xs sm:text-sm uppercase tracking-[0.3em] text-neon-orange mb-3"
            style={{ textShadow: "0 0 10px hsl(25 100% 55% / 0.8)" }}
          >
            Feel the vibes
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold gradient-neon-text">
            Experiences & Events
          </h2>
        </div>

        {/* Banner teaser */}
        <Link
          to="/experiences"
          className="group relative block rounded-2xl overflow-hidden mb-8 sm:mb-10 h-56 sm:h-64 md:h-96 neon-border-pink"
        >
          <img
            src={bannerImg}
            alt="Neon beach party drone shot"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-end p-5 sm:p-6 md:p-10">
            <p className="font-ui text-[10px] sm:text-xs uppercase tracking-[0.3em] text-neon-pink mb-2">
              Marine Drive · After Dark
            </p>
            <h3 className="font-display text-xl sm:text-2xl md:text-4xl font-bold gradient-neon-text mb-3 max-w-xl leading-tight">
              Beach raves, festivals & adventure sports
            </h3>
            <span className="inline-flex items-center gap-2 text-sm text-foreground group-hover:text-primary transition-colors">
              Explore all experiences <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>

        {/* 3 upcoming */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {featured.map((exp, i) => (
            <Link
              key={exp.id}
              to={`/experiences/${exp.id}`}
              className="group relative rounded-xl overflow-hidden h-80 sm:h-96 animate-slide-up"
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

              <div className="relative z-10 h-full flex flex-col justify-end p-5 sm:p-6">
                <span className="self-start px-3 py-1 rounded-full text-[10px] sm:text-xs font-ui uppercase tracking-wider gradient-neon text-primary-foreground mb-3">
                  {exp.category}
                </span>
                <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-2 leading-tight">
                  {exp.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formatEventDate(exp.date!)}
                  </span>
                  <span className="flex items-center gap-1 truncate max-w-[60%]">
                    <MapPin className="w-3 h-3 shrink-0" /> <span className="truncate">{exp.location.split(",")[0]}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-bold text-primary text-base sm:text-lg">{format(exp.priceBdt)}</span>
                  <span className="px-3 sm:px-4 py-2 rounded-lg font-ui text-xs uppercase tracking-widest glass neon-border-pink text-primary group-hover:scale-105 transition-transform shrink-0">
                    View
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-10">
          <Link
            to="/experiences"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-ui text-sm uppercase tracking-widest gradient-neon text-primary-foreground neon-glow-pink hover:scale-105 transition-transform"
          >
            View All Experiences <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;

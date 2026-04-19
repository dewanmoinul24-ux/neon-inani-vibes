import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Sparkles, Ticket, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import bannerImg from "@/assets/experiences-banner.jpg";
import {
  experiences,
  getUpcomingEvents,
  getAdventureSports,
  type ExperienceCategory,
  type SportCategory,
} from "@/data/experiences";
import { useCurrency } from "@/hooks/useCurrency";

const eventCategories: { value: "all" | ExperienceCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "party", label: "Party" },
  { value: "music", label: "Music" },
  { value: "festival", label: "Festival" },
  { value: "cultural", label: "Cultural" },
  { value: "food", label: "Food" },
];

const sportCategories: { value: "all" | SportCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "water", label: "Water" },
  { value: "aerial", label: "Aerial" },
  { value: "land", label: "Land" },
];

const formatEventDate = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const Experiences = () => {
  const { formatPrice: format } = useCurrency();
  const [eventFilter, setEventFilter] = useState<"all" | ExperienceCategory>("all");
  const [sportFilter, setSportFilter] = useState<"all" | SportCategory>("all");

  const upcomingEvents = useMemo(() => {
    const all = getUpcomingEvents();
    return eventFilter === "all" ? all : all.filter((e) => e.category === eventFilter);
  }, [eventFilter]);

  const sports = useMemo(() => {
    const all = getAdventureSports();
    return sportFilter === "all" ? all : all.filter((s) => s.category === sportFilter);
  }, [sportFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ───────── Banner ───────── */}
      <section className="relative pt-16 md:pt-20">
        <div className="relative h-[55vh] md:h-[70vh] w-full overflow-hidden">
          <img
            src={bannerImg}
            alt="Aerial drone shot of a neon beach party at Cox's Bazar Marine Drive"
            className="absolute inset-0 w-full h-full object-cover"
            width={1920}
            height={832}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12 md:pb-20 shadow-inner">
            <p
              className="font-ui text-xs md:text-sm uppercase tracking-[0.4em] text-neon-pink mb-3"
              style={{ textShadow: "0 0 14px hsl(330 100% 65% / 0.95), 0 2px 8px hsl(0 0% 0% / 0.8)" }}
            >
              Marine Drive · After Dark
            </p>
            <h1
              className="font-display text-5xl md:text-7xl font-bold gradient-neon-text max-w-4xl leading-[1.05] lg:text-6xl"
              style={{
                filter:
                  "drop-shadow(0 0 24px hsl(330 100% 65% / 0.55)) drop-shadow(0 4px 16px hsl(0 0% 0% / 0.9))",
              }}
            >
              Experiences & Adventure Sports
            </h1>
            <p
              className="mt-5 max-w-2xl text-base text-foreground/90 md:text-base"
              style={{ textShadow: "0 2px 12px hsl(0 0% 0% / 0.9)" }}
            >
              Beach raves, music festivals, parasailing, jet skis, scuba and more — curated
              along the world's longest beach. Pick a vibe, book your spot.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#upcoming"
                className="px-5 py-2.5 rounded-lg font-ui text-xs uppercase tracking-widest gradient-neon text-primary-foreground neon-glow-pink hover:scale-105 transition-transform"
              >
                Upcoming Events
              </a>
              <a
                href="#sports"
                className="px-5 py-2.5 rounded-lg font-ui text-xs uppercase tracking-widest glass neon-border-cyan text-neon-cyan hover:scale-105 transition-transform"
              >
                Adventure Sports
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Upcoming Events ───────── */}
      <section id="upcoming" className="py-16 md:py-24 relative">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-neon-pink/5 rounded-full blur-[150px]" />
        <div className="container mx-auto px-4 relative">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <p
                className="font-ui text-xs uppercase tracking-[0.3em] text-neon-orange mb-2"
                style={{ textShadow: "0 0 10px hsl(25 100% 55% / 0.8)" }}
              >
                What's coming up
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold gradient-neon-text">
                Upcoming Events
              </h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {eventCategories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setEventFilter(c.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-ui uppercase tracking-wider border transition-all ${
                    eventFilter === c.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border/60 text-muted-foreground hover:border-primary/60 hover:text-primary"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {upcomingEvents.length === 0 ? (
            <p className="text-muted-foreground">No upcoming events in this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {upcomingEvents.map((e, i) => (
                <Link
                  key={e.id}
                  to={`/experiences/${e.id}`}
                  className="group relative rounded-xl overflow-hidden h-[26rem] animate-slide-up glass neon-border-pink"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <img
                    src={e.image}
                    alt={e.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />

                  <div className="relative z-10 h-full flex flex-col justify-between p-5">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[10px] font-ui uppercase tracking-wider gradient-neon text-primary-foreground">
                        {e.category}
                      </span>
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full glass text-xs text-neon-cyan border border-neon-cyan/40">
                        <Calendar className="w-3 h-3" />
                        {formatEventDate(e.date!)}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-1.5 leading-tight">
                        {e.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {e.tagline}
                      </p>
                      <div className="space-y-1.5 mb-4 text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5 text-neon-orange shrink-0" />
                          <span>{e.startTime} – {e.endTime}</span>
                        </div>
                        <div className="flex items-start gap-2 text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 text-neon-pink shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{e.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-primary text-lg">
                          {format(e.priceBdt)}
                          <span className="text-xs text-muted-foreground font-normal ml-1">/ ticket</span>
                        </span>
                        <span className="px-3 py-1.5 rounded-lg text-[11px] font-ui uppercase tracking-widest glass neon-border-pink text-primary group-hover:scale-105 transition-transform inline-flex items-center gap-1">
                          <Ticket className="w-3 h-3" /> View
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ───────── Adventure Sports ───────── */}
      <section id="sports" className="py-16 md:py-24 relative bg-background/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[150px]" />
        <div className="container mx-auto px-4 relative">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <p
                className="font-ui text-xs uppercase tracking-[0.3em] text-neon-cyan mb-2"
                style={{ textShadow: "0 0 10px hsl(180 100% 55% / 0.8)" }}
              >
                Adrenaline along the coast
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold gradient-neon-text">
                Adventure Sports
              </h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {sportCategories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setSportFilter(c.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-ui uppercase tracking-wider border transition-all ${
                    sportFilter === c.value
                      ? "bg-neon-cyan text-background border-neon-cyan"
                      : "border-border/60 text-muted-foreground hover:border-neon-cyan/60 hover:text-neon-cyan"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {sports.length === 0 ? (
            <p className="text-muted-foreground">No sports in this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {sports.map((s, i) => (
                <Link
                  key={s.id}
                  to={`/experiences/${s.id}`}
                  className="group relative rounded-xl overflow-hidden h-[24rem] animate-slide-up glass neon-border-cyan"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />

                  <div className="relative z-10 h-full flex flex-col justify-between p-5">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[10px] font-ui uppercase tracking-wider bg-neon-cyan text-background">
                        {s.category}
                      </span>
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full glass text-xs text-neon-orange border border-neon-orange/40">
                        <Sparkles className="w-3 h-3" />
                        {s.durationMinutes} min
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-1.5 leading-tight">
                        {s.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {s.tagline}
                      </p>
                      <div className="space-y-1.5 mb-4 text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5 text-neon-orange shrink-0" />
                          <span>{s.operatingHours}</span>
                        </div>
                        <div className="flex items-start gap-2 text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 text-neon-pink shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{s.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-neon-cyan text-lg">
                          {format(s.priceBdt)}
                          <span className="text-xs text-muted-foreground font-normal ml-1">/ session</span>
                        </span>
                        <span className="px-3 py-1.5 rounded-lg text-[11px] font-ui uppercase tracking-widest glass neon-border-cyan text-neon-cyan group-hover:scale-105 transition-transform inline-flex items-center gap-1">
                          Book
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Experiences;

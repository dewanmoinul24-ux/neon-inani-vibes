import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, Flame, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getUpcomingEvents } from "@/data/experiences";
import { useCurrency } from "@/hooks/useCurrency";

const parseEventDate = (iso: string, startTime?: string) => {
  let h = 20;
  let min = 0;
  if (startTime) {
    const m = startTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (m) {
      h = parseInt(m[1], 10) % 12;
      if (m[3].toUpperCase() === "PM") h += 12;
      min = parseInt(m[2], 10);
    }
  }
  const d = new Date(iso + "T00:00:00");
  d.setHours(h, min, 0, 0);
  return d;
};

const FeaturedTonight = () => {
  const { formatPrice } = useCurrency();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const tonightEvents = useMemo(() => {
    const within = 24 * 60 * 60 * 1000;
    return getUpcomingEvents().filter((e) => {
      if (!e.date) return false;
      const start = parseEventDate(e.date, e.startTime).getTime();
      const diff = start - now;
      return diff > -2 * 60 * 60 * 1000 && diff <= within;
    });
  }, [now]);

  if (tonightEvents.length === 0) return null;

  return (
    <section
      aria-label="Events happening within 24 hours"
      className="relative py-10 md:py-14 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-neon-pink/5 via-background to-background pointer-events-none" />
      <div className="absolute -top-20 left-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -top-20 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 relative">
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, -8, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-pink to-neon-orange flex items-center justify-center neon-glow-pink"
          >
            <Flame className="w-4 h-4 text-primary-foreground" />
          </motion.div>
          <div>
            <p
              className="font-ui text-[10px] uppercase tracking-[0.4em] text-neon-pink"
              style={{ textShadow: "0 0 10px hsl(330 100% 65% / 0.8)" }}
            >
              Within 24 hours
            </p>
            <h2
              className="font-display text-2xl md:text-3xl font-bold gradient-neon-text leading-tight"
              style={{ filter: "drop-shadow(0 2px 12px hsl(0 0% 0% / 0.6))" }}
            >
              Featured Tonight
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tonightEvents.map((e, i) => (
            <Link
              key={e.id}
              to={`/experiences/${e.id}`}
              className="group relative rounded-xl overflow-hidden h-44 glass neon-border-pink animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <img
                src={e.image}
                alt={e.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />

              {/* Pulsing tonight badge */}
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-pink/20 border border-neon-pink/60 backdrop-blur-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neon-pink animate-pulse" />
                <span
                  className="font-ui text-[9px] uppercase tracking-widest text-neon-pink font-semibold"
                  style={{ textShadow: "0 0 8px hsl(330 100% 65% / 0.9)" }}
                >
                  Tonight
                </span>
              </motion.div>

              <div className="relative z-10 h-full flex flex-col justify-end p-4">
                <h3 className="font-display text-base md:text-lg font-bold text-foreground leading-tight mb-2 line-clamp-2">
                  {e.title}
                </h3>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-neon-orange" />
                    {e.startTime}
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-neon-cyan shrink-0" />
                    <span className="truncate">{e.location.split("—")[0].trim()}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-primary text-sm">
                    {formatPrice(e.priceBdt)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-ui uppercase tracking-widest text-neon-cyan group-hover:gap-2 transition-all">
                    Reserve <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTonight;

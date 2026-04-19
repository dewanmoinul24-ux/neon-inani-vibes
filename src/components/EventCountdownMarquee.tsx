import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { getUpcomingEvents } from "@/data/experiences";

const computeRemaining = (target: Date) => {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return { d, h, m, s, done: false };
};

const parseEventDate = (iso: string, startTime?: string) => {
  // startTime example: "7:00 PM"
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

const EventCountdownMarquee = () => {
  const events = useMemo(() => getUpcomingEvents().slice(0, 3), []);
  const [, force] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (events.length === 0) return null;

  // Repeat events to make a seamless loop
  const loop = [...events, ...events];

  return (
    <section
      aria-label="Upcoming events countdown"
      className="relative border-y border-neon-cyan/20 bg-background/60 backdrop-blur-md overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/5 via-transparent to-neon-cyan/5 pointer-events-none" />
      <div className="relative flex items-center">
        <div className="hidden md:flex shrink-0 items-center gap-2 px-5 py-3 bg-gradient-to-r from-neon-pink/20 to-transparent border-r border-neon-cyan/20">
          <span className="w-2 h-2 rounded-full bg-neon-pink animate-pulse" />
          <span
            className="font-ui text-[10px] uppercase tracking-[0.3em] text-neon-cyan"
            style={{ textShadow: "0 0 10px hsl(180 100% 55% / 0.8)" }}
          >
            Live · Next Up
          </span>
        </div>
        {/* Mobile compact label */}
        <div className="md:hidden shrink-0 flex items-center gap-1.5 pl-3 pr-2 py-2 border-r border-neon-cyan/20">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-pink animate-pulse" />
          <span
            className="font-ui text-[9px] uppercase tracking-[0.2em] text-neon-cyan"
            style={{ textShadow: "0 0 8px hsl(180 100% 55% / 0.8)" }}
          >
            Live
          </span>
        </div>

        <div
          className="flex-1 overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="flex gap-12 py-3 animate-marquee whitespace-nowrap"
            style={{ animationPlayState: paused ? "paused" : "running" }}
          >
            {loop.map((e, i) => {
              const target = parseEventDate(e.date!, e.startTime);
              const r = computeRemaining(target);
              return (
                <Link
                  key={`${e.id}-${i}`}
                  to={`/experiences/${e.id}`}
                  className="flex items-center gap-3 group cursor-pointer hover:opacity-100"
                  title={`View ${e.title}`}
                >
                  <Calendar className="w-3.5 h-3.5 text-neon-pink shrink-0" />
                  <span className="font-display text-sm font-semibold text-foreground group-hover:text-neon-pink transition-colors underline-offset-4 group-hover:underline decoration-neon-pink/60">
                    {e.title}
                  </span>
                  <span className="text-muted-foreground text-xs">·</span>
                  <Clock className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
                  <span
                    className="font-mono text-xs tracking-wider text-neon-cyan"
                    style={{ textShadow: "0 0 8px hsl(180 100% 55% / 0.6)" }}
                  >
                    {r.done
                      ? "STARTING NOW"
                      : `${String(r.d).padStart(2, "0")}d ${String(r.h).padStart(2, "0")}h ${String(r.m).padStart(2, "0")}m ${String(r.s).padStart(2, "0")}s`}
                  </span>
                  <span className="text-neon-pink/40">◆</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCountdownMarquee;

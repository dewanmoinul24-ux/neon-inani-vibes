import { MapPin } from "lucide-react";
import { type Place, type PlaceCategory } from "@/data/places";

interface PlacesMapProps {
  places: Place[];
  activePlaceSlug: string | null;
  hoveredSlug: string | null;
  onPinClick: (slug: string) => void;
  onPinHover: (slug: string | null) => void;
}

const categoryColor: Record<PlaceCategory, string> = {
  Beach: "hsl(var(--neon-cyan))",
  Drive: "hsl(var(--neon-purple))",
  Island: "hsl(var(--neon-blue))",
  Nature: "hsl(140 80% 55%)",
  Cultural: "hsl(45 100% 60%)",
  Family: "hsl(20 100% 60%)",
  Market: "hsl(var(--neon-pink))",
};

const PlacesMap = ({ places, activePlaceSlug, hoveredSlug, onPinClick, onPinHover }: PlacesMapProps) => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden glass-strong neon-border-blue">
      <div className="pointer-events-none absolute -top-10 -left-10 w-60 h-60 rounded-full bg-neon-cyan/15 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 w-60 h-60 rounded-full bg-neon-pink/15 blur-[80px]" />

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="block w-full h-[420px] sm:h-[520px] md:h-[620px]"
        role="img"
        aria-label="Interactive map of Cox's Bazar destinations"
      >
        <defs>
          <linearGradient id="seaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(200 80% 12%)" />
            <stop offset="100%" stopColor="hsl(220 70% 6%)" />
          </linearGradient>
          <linearGradient id="landGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(280 40% 14%)" />
            <stop offset="100%" stopColor="hsl(260 35% 10%)" />
          </linearGradient>
        </defs>

        <rect width="100" height="100" fill="url(#seaGradient)" />

        <g stroke="hsl(var(--neon-cyan) / 0.06)" strokeWidth="0.1">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} />
          ))}
        </g>

        <path
          d="M 32 0 L 38 8 L 36 14 L 40 22 L 42 30 L 38 38 L 36 46 L 38 54 L 42 62 L 46 70 L 48 78 L 52 86 L 58 94 L 62 100 L 100 100 L 100 0 Z"
          fill="url(#landGradient)"
          stroke="hsl(var(--neon-cyan) / 0.4)"
          strokeWidth="0.3"
        />
        <path
          d="M 8 26 Q 16 20 22 28 Q 24 36 18 42 Q 10 42 6 36 Z"
          fill="url(#landGradient)"
          stroke="hsl(var(--neon-cyan) / 0.4)"
          strokeWidth="0.3"
        />
        <path
          d="M 4 12 Q 12 10 14 18 Q 12 24 6 22 Q 2 18 4 12 Z"
          fill="url(#landGradient)"
          stroke="hsl(var(--neon-cyan) / 0.4)"
          strokeWidth="0.3"
        />
        <circle cx="78" cy="96" r="2" fill="url(#landGradient)" stroke="hsl(var(--neon-cyan) / 0.4)" strokeWidth="0.2" />

        <path
          d="M 35 47 L 38 56 L 42 62 L 46 70 L 47 76 L 52 86 L 56 88"
          fill="none"
          stroke="hsl(var(--neon-pink) / 0.5)"
          strokeWidth="0.4"
          strokeDasharray="0.8 0.6"
        />

        <g transform="translate(92, 6)">
          <circle r="3" fill="hsl(var(--background) / 0.6)" stroke="hsl(var(--neon-cyan) / 0.5)" strokeWidth="0.2" />
          <text x="0" y="0.6" textAnchor="middle" fontSize="2.4" fill="hsl(var(--neon-cyan))" fontFamily="ui-monospace, monospace">N</text>
        </g>

        <text x="20" y="70" fontSize="2.2" fill="hsl(var(--muted-foreground) / 0.6)" fontFamily="ui-monospace, monospace" letterSpacing="0.3">
          BAY OF BENGAL
        </text>
        <text x="68" y="22" fontSize="2.2" fill="hsl(var(--muted-foreground) / 0.6)" fontFamily="ui-monospace, monospace" letterSpacing="0.3">
          MYANMAR ▶
        </text>

        {places.map((p) => {
          const isActive = activePlaceSlug === p.slug;
          const isHovered = hoveredSlug === p.slug;
          const color = categoryColor[p.category];
          const r = isActive || isHovered ? 1.8 : 1.2;
          return (
            <g
              key={p.slug}
              transform={`translate(${p.map.x}, ${p.map.y})`}
              onClick={() => onPinClick(p.slug)}
              onMouseEnter={() => onPinHover(p.slug)}
              onMouseLeave={() => onPinHover(null)}
              className="cursor-pointer"
            >
              {(isActive || isHovered) && (
                <circle r="3.5" fill={color} opacity="0.25">
                  <animate attributeName="r" values="2.5;4.5;2.5" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="1.6s" repeatCount="indefinite" />
                </circle>
              )}
              <circle r={r + 0.6} fill={color} opacity="0.25" />
              <circle
                r={r}
                fill={color}
                stroke="hsl(var(--background))"
                strokeWidth="0.25"
                style={{ filter: `drop-shadow(0 0 1.5px ${color})` }}
              />
              {(isActive || isHovered) && (
                <g transform="translate(2.4, -2.4)">
                  <rect
                    x="0" y="-2.2"
                    width={Math.max(p.name.length * 1.1, 8)}
                    height="3.2"
                    rx="0.6"
                    fill="hsl(var(--background) / 0.92)"
                    stroke={color}
                    strokeWidth="0.15"
                  />
                  <text x="0.6" y="0.1" fontSize="2" fill="hsl(var(--foreground))" fontFamily="ui-sans-serif, system-ui">
                    {p.name}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      <div className="px-4 py-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <MapPin size={14} className="text-neon-cyan" />
          <span className="font-ui uppercase tracking-widest">Tap a pin to filter & jump</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {(Object.keys(categoryColor) as PlaceCategory[]).map((cat) => (
            <span key={cat} className="flex items-center gap-1.5 text-[10px] sm:text-xs font-ui uppercase tracking-wider">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ background: categoryColor[cat], boxShadow: `0 0 6px ${categoryColor[cat]}` }}
              />
              <span className="text-muted-foreground">{cat}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlacesMap;

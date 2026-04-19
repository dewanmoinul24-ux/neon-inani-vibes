import { Sparkles, Trophy, Zap, Crown, CheckCircle2, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  VIBES_TIERS,
  getVibesProgress,
  type VibesTier,
} from "@/lib/vibesLevel";

const accentText: Record<VibesTier["accent"], string> = {
  cyan: "text-neon-cyan",
  pink: "text-neon-pink",
  purple: "text-neon-purple",
  orange: "text-neon-orange",
};

const accentBorder: Record<VibesTier["accent"], string> = {
  cyan: "border-neon-cyan/40",
  pink: "border-neon-pink/40",
  purple: "border-neon-purple/40",
  orange: "border-neon-orange/40",
};

const accentBg: Record<VibesTier["accent"], string> = {
  cyan: "bg-neon-cyan",
  pink: "bg-neon-pink",
  purple: "bg-neon-purple",
  orange: "bg-neon-orange",
};

const accentSoft: Record<VibesTier["accent"], string> = {
  cyan: "bg-neon-cyan/10",
  pink: "bg-neon-pink/10",
  purple: "bg-neon-purple/10",
  orange: "bg-neon-orange/10",
};

const tierIcon = (level: number) => {
  if (level === 1) return Sparkles;
  if (level === 2) return Zap;
  if (level === 3) return Trophy;
  return Crown;
};

interface Props {
  completedTrips: number;
  compact?: boolean;
}

const VibesLevelCard = ({ completedTrips, compact }: Props) => {
  const { tier, tripsToNext, percent, isMax } = getVibesProgress(completedTrips);
  const Icon = tierIcon(tier.level);

  return (
    <div className="space-y-6">
      {/* Hero tier card */}
      <Card className={`p-6 md:p-7 glass-strong border-2 ${accentBorder[tier.accent]}`}>
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center ${accentSoft[tier.accent]} border ${accentBorder[tier.accent]}`}
          >
            <Icon className={`w-7 h-7 ${accentText[tier.accent]}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[10px] uppercase tracking-widest font-ui text-muted-foreground">
                Vibes Level {tier.level}
              </p>
              <Badge
                variant="outline"
                className={`${accentBorder[tier.accent]} ${accentText[tier.accent]} text-[10px]`}
              >
                {tier.name}
              </Badge>
            </div>
            <h3 className="font-display text-xl md:text-2xl text-foreground mt-1">
              {tier.name}
            </h3>
            <p className="text-sm text-muted-foreground font-body mt-1">
              {tier.tagline}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-ui text-muted-foreground mb-1.5">
            <span>
              {completedTrips} completed trip{completedTrips === 1 ? "" : "s"}
            </span>
            {isMax ? (
              <span className={accentText[tier.accent]}>Max tier reached ✦</span>
            ) : (
              <span>
                {tripsToNext} more to{" "}
                <span className={accentText[tier.accent]}>
                  {VIBES_TIERS[tier.level]?.name}
                </span>
              </span>
            )}
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full ${accentBg[tier.accent]} transition-all duration-700`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Current perks */}
        {!compact && (
          <div className="mt-5 pt-5 border-t border-border">
            <p className="text-[10px] uppercase tracking-widest font-ui text-muted-foreground mb-3">
              Your perks
            </p>
            <ul className="grid sm:grid-cols-2 gap-2">
              {tier.perks.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-2 text-sm font-body text-foreground"
                >
                  <CheckCircle2
                    className={`w-4 h-4 mt-0.5 shrink-0 ${accentText[tier.accent]}`}
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* All tiers ladder */}
      {!compact && (
        <div>
          <p className="text-[10px] uppercase tracking-widest font-ui text-muted-foreground mb-3">
            All tiers
          </p>
          <div className="grid gap-3">
            {VIBES_TIERS.map((t) => {
              const TIcon = tierIcon(t.level);
              const unlocked = completedTrips >= t.minTrips;
              const isCurrent = t.level === tier.level;
              return (
                <Card
                  key={t.level}
                  className={`p-4 border ${
                    isCurrent
                      ? `${accentBorder[t.accent]} bg-card`
                      : unlocked
                      ? "border-border bg-card/60"
                      : "border-dashed border-border/60 bg-card/30 opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        unlocked ? accentSoft[t.accent] : "bg-muted"
                      }`}
                    >
                      {unlocked ? (
                        <TIcon className={`w-5 h-5 ${accentText[t.accent]}`} />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-ui text-sm text-foreground">
                          Level {t.level} — {t.name}
                        </p>
                        {isCurrent && (
                          <Badge
                            className={`${accentSoft[t.accent]} ${accentText[t.accent]} border ${accentBorder[t.accent]} text-[10px]`}
                          >
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-body">
                        {t.minTrips === 0
                          ? "Sign up & start exploring"
                          : `${t.minTrips}+ completed trip${t.minTrips === 1 ? "" : "s"}`}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-3 pl-13 grid gap-1.5">
                    {t.perks.map((p) => (
                      <li
                        key={p}
                        className="text-xs font-body text-muted-foreground flex items-start gap-1.5"
                      >
                        <span className={`mt-1 w-1 h-1 rounded-full ${accentBg[t.accent]} shrink-0`} />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default VibesLevelCard;

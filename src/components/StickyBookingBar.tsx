import { ReactNode } from "react";

interface StickyBookingBarProps {
  /** Primary value displayed on the left, e.g. "From ৳12,500/night" */
  priceLabel: ReactNode;
  /** Sublabel under price, e.g. "2 nights · 1 room" */
  subLabel?: ReactNode;
  /** CTA button label */
  ctaLabel: string;
  /** Click handler for the CTA */
  onCta: () => void;
  /** Optional disabled state for the CTA */
  disabled?: boolean;
}

/**
 * Mobile-only sticky bottom bar with a price + CTA button.
 * Used on detail pages to keep the primary booking action reachable.
 * Hidden on lg+ since the booking sidebar is visible on desktop.
 *
 * Includes safe-area-inset padding for iPhone notch/home indicator.
 */
const StickyBookingBar = ({
  priceLabel,
  subLabel,
  ctaLabel,
  onCta,
  disabled,
}: StickyBookingBarProps) => {
  return (
    <>
      {/* Spacer to prevent content from being hidden behind the bar */}
      <div className="h-20 lg:hidden" aria-hidden="true" />

      <div
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass-strong border-t border-primary/30"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="font-display text-base font-bold text-primary truncate">
              {priceLabel}
            </div>
            {subLabel && (
              <div className="font-ui text-[11px] uppercase tracking-wider text-muted-foreground truncate">
                {subLabel}
              </div>
            )}
          </div>
          <button
            onClick={onCta}
            disabled={disabled}
            className="shrink-0 px-5 min-h-[44px] rounded-lg font-ui text-xs uppercase tracking-widest gradient-neon text-primary-foreground neon-glow-pink transition-transform active:scale-95 disabled:opacity-60"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </>
  );
};

export default StickyBookingBar;

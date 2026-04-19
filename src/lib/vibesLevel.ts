// Vibes Level system — tiers users based on completed (past, non-cancelled) bookings.
// Pure helpers. UI lives in components/VibesLevelCard.tsx.

import { isAfter, parseISO } from "date-fns";

export interface VibesTier {
  level: 1 | 2 | 3 | 4;
  name: string;
  minTrips: number;
  nextAt: number | null; // trips needed for next tier, null if max
  accent: "cyan" | "pink" | "purple" | "orange";
  tagline: string;
  perks: string[];
}

export const VIBES_TIERS: VibesTier[] = [
  {
    level: 1,
    name: "Explorer",
    minTrips: 0,
    nextAt: 1,
    accent: "cyan",
    tagline: "Just getting started — your Cox's Bazar story begins here.",
    perks: [
      "Welcome bonus on your first booking",
      "Switch between BDT & USD anytime",
      "Saved properties & wishlists",
    ],
  },
  {
    level: 2,
    name: "Wanderer",
    minTrips: 1,
    nextAt: 3,
    accent: "pink",
    tagline: "You've felt the salt air. Time for more Marine Drive.",
    perks: [
      "5% off vehicle rentals",
      "Priority customer support",
      "Early check-in when available",
    ],
  },
  {
    level: 3,
    name: "Voyager",
    minTrips: 3,
    nextAt: 6,
    accent: "purple",
    tagline: "A familiar face on the longest beach in the world.",
    perks: [
      "10% off all hotel stays",
      "Free room upgrade (subject to availability)",
      "Late check-out included",
      "All Wanderer perks",
    ],
  },
  {
    level: 4,
    name: "Icon",
    minTrips: 6,
    nextAt: null,
    accent: "orange",
    tagline: "Inani is your second home. We've got you, always.",
    perks: [
      "15% off everything — hotels, vehicles, experiences",
      "Dedicated concierge for every trip",
      "Early access to new properties & launches",
      "Complimentary airport pickup",
      "All Voyager perks",
    ],
  },
];

export interface BookingLike {
  status: string;
  check_out: string; // ISO date
}

/** Count completed trips: not cancelled AND check-out date is in the past. */
export const countCompletedTrips = (bookings: BookingLike[]): number => {
  const now = new Date();
  return bookings.filter(
    (b) => b.status !== "cancelled" && !isAfter(parseISO(b.check_out), now)
  ).length;
};

export const getVibesTier = (completedTrips: number): VibesTier => {
  return [...VIBES_TIERS].reverse().find((t) => completedTrips >= t.minTrips) ?? VIBES_TIERS[0];
};

export const getVibesProgress = (completedTrips: number) => {
  const tier = getVibesTier(completedTrips);
  if (tier.nextAt === null) {
    return { tier, tripsToNext: 0, percent: 100, isMax: true };
  }
  const span = tier.nextAt - tier.minTrips;
  const into = completedTrips - tier.minTrips;
  const percent = Math.max(0, Math.min(100, Math.round((into / span) * 100)));
  return {
    tier,
    tripsToNext: Math.max(0, tier.nextAt - completedTrips),
    percent,
    isMax: false,
  };
};

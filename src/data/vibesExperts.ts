import guide1 from "@/assets/experts/guide-1.jpg";
import guide2 from "@/assets/experts/guide-2.jpg";
import guide3 from "@/assets/experts/guide-3.jpg";
import photographer1 from "@/assets/experts/photographer-1.jpg";
import photographer2 from "@/assets/experts/photographer-2.jpg";
import photographer3 from "@/assets/experts/photographer-3.jpg";

import inaniImg from "@/assets/place-inani.jpg";
import marineImg from "@/assets/place-marine-drive.jpg";
import himchariImg from "@/assets/place-himchari.jpg";
import saintMartinImg from "@/assets/places/saint-martin-island.jpg";
import ramuImg from "@/assets/places/ramu-buddhist-temples.jpg";
import patuartekImg from "@/assets/places/patuartek.jpg";

export type ExpertType = "guide" | "photographer";

export interface ExpertService {
  name: string;
  description: string;
  /** in BDT */
  price: number;
  unit: "hour" | "day" | "package";
}

export interface ExpertReviewBreakdown {
  /** Total reviews count, used for label */
  total: number;
  /** Distribution: index 0 = 5★ count, index 4 = 1★ count */
  distribution: [number, number, number, number, number];
}

export interface ExpertTestimonial {
  name: string;
  quote: string;
  rating: number; // 1-5
  trip: string;
}

export interface VibesExpert {
  id: string;
  type: ExpertType;
  name: string;
  tagline: string;
  bio: string;
  portrait: string;
  gallery: string[];
  pricePerHour: number;
  pricePerDay: number;
  bookingAdvance: number; // %
  rating: number; // 1-5 average
  reviewCount: number;
  reviewBreakdown: ExpertReviewBreakdown;
  experienceYears: number;
  languages: string[];
  features: string[];
  highlights: string[];
  services: ExpertService[];
  testimonials: ExpertTestimonial[];
  /** A deterministic seed used to generate mock availability per expert. */
  availabilitySeed: number;
  /** Time slots offered per available day. */
  timeSlots: string[];
  accent: "cyan" | "pink" | "purple";
}

const SHARED_TIME_SLOTS = [
  "06:00",
  "09:00",
  "12:00",
  "15:00",
  "17:30",
];

export const vibesExperts: VibesExpert[] = [
  // ---------------- GUIDES ----------------
  {
    id: "guide-rafi",
    type: "guide",
    name: "Rafiul Hossain",
    tagline: "Marine Drive storyteller · 8 yrs",
    bio: "Born and raised in Kalatali, Rafi has guided everyone from solo backpackers to film crews along the 80km Marine Drive. Expect hidden viewpoints, the best fish-fry stalls, and a perfectly timed sunset stop.",
    portrait: guide1,
    gallery: [marineImg, inaniImg, patuartekImg, himchariImg],
    pricePerHour: 500,
    pricePerDay: 3500,
    bookingAdvance: 50,
    rating: 4.9,
    reviewCount: 142,
    reviewBreakdown: { total: 142, distribution: [118, 18, 4, 1, 1] },
    experienceYears: 8,
    languages: ["Bangla", "English", "Chittagonian"],
    features: ["English & Bangla", "Local Insider", "Custom Itinerary", "Group or Solo"],
    highlights: [
      "Hidden Marine Drive viewpoints",
      "Authentic seafood stops",
      "Photo-friendly sunset timing",
    ],
    services: [
      { name: "Half-day Marine Drive", description: "4 hours, includes 3 viewpoint stops + tea break.", price: 2000, unit: "package" },
      { name: "Full-day coast tour", description: "Inani → Patuartek → sunset at Himchari.", price: 3500, unit: "day" },
      { name: "Custom hourly", description: "You set the route, I bring the stories.", price: 500, unit: "hour" },
    ],
    testimonials: [
      { name: "Sara M.", trip: "Honeymoon · Nov 2025", rating: 5, quote: "Rafi turned a normal beach day into the highlight of our trip. The fish-fry stop was unreal." },
      { name: "Tanveer A.", trip: "Family · Jan 2026", rating: 5, quote: "Patient with my parents, knew every shortcut, and the sunset spot he picked was magical." },
      { name: "Nusrat K.", trip: "Solo · Feb 2026", rating: 4, quote: "Felt safe the whole day. Great recommendations for places I'd never have found alone." },
    ],
    availabilitySeed: 7,
    timeSlots: SHARED_TIME_SLOTS,
    accent: "cyan",
  },
  {
    id: "guide-ayesha",
    type: "guide",
    name: "Ayesha Rahman",
    tagline: "Cultural & temple guide · 5 yrs",
    bio: "Specialist in Ramu, Maheshkhali and the Buddhist heritage trail. Ayesha pairs cultural depth with a relaxed pace — perfect for families, photographers and slow travelers.",
    portrait: guide2,
    gallery: [ramuImg, marineImg, himchariImg, inaniImg],
    pricePerHour: 600,
    pricePerDay: 4200,
    bookingAdvance: 50,
    rating: 4.8,
    reviewCount: 87,
    reviewBreakdown: { total: 87, distribution: [68, 14, 3, 1, 1] },
    experienceYears: 5,
    languages: ["Bangla", "English", "Hindi"],
    features: ["English & Bangla", "Cultural Tours", "Family-Friendly", "Photo Stops"],
    highlights: [
      "Ramu Buddhist heritage trail",
      "Adinath Temple sunrise",
      "Traditional handicraft markets",
    ],
    services: [
      { name: "Ramu temple half-day", description: "Three temples + monastery + lunch suggestion.", price: 2400, unit: "package" },
      { name: "Maheshkhali day-trip", description: "Boat + island temples + salt fields.", price: 4200, unit: "day" },
      { name: "Hourly cultural tour", description: "Pick a neighborhood, dive deep.", price: 600, unit: "hour" },
    ],
    testimonials: [
      { name: "Liam P.", trip: "Couple · Dec 2025", rating: 5, quote: "Ayesha made every temple come alive. Her storytelling is next-level." },
      { name: "Ritu S.", trip: "Family · Mar 2026", rating: 5, quote: "Our kids stayed engaged for the whole day, which is a miracle." },
      { name: "James W.", trip: "Photo trip · Oct 2025", rating: 4, quote: "Took us to spots no other guide bothered with. Beautiful frames." },
    ],
    availabilitySeed: 13,
    timeSlots: SHARED_TIME_SLOTS,
    accent: "pink",
  },
  {
    id: "guide-jasim",
    type: "guide",
    name: "Jasim Uddin",
    tagline: "Saint Martin & boat tours · 12 yrs",
    bio: "Third-generation boatman who knows Saint Martin and Shah Parir Dwip like his own backyard. Best for snorkeling, seafood, and quiet sunrise sails.",
    portrait: guide3,
    gallery: [saintMartinImg, patuartekImg, marineImg, inaniImg],
    pricePerHour: 700,
    pricePerDay: 4800,
    bookingAdvance: 50,
    rating: 4.9,
    reviewCount: 213,
    reviewBreakdown: { total: 213, distribution: [185, 22, 4, 1, 1] },
    experienceYears: 12,
    languages: ["Bangla", "Chittagonian", "Basic English"],
    features: ["Boat Tours", "Snorkeling", "Seafood Spots", "Sunrise Sails"],
    highlights: [
      "Best snorkeling reefs",
      "Family-run seafood shacks",
      "Quiet beaches away from crowds",
    ],
    services: [
      { name: "Saint Martin day-trip", description: "Round-trip boat + island tour + lunch.", price: 4800, unit: "day" },
      { name: "Sunrise sail", description: "2 hours, tea on board.", price: 1400, unit: "package" },
      { name: "Hourly boat charter", description: "Your route, his boat.", price: 700, unit: "hour" },
    ],
    testimonials: [
      { name: "Mahbub R.", trip: "Friends · Nov 2025", rating: 5, quote: "Jasim's shack lunch and the snorkeling spot? Bucket list moments." },
      { name: "Ella T.", trip: "Solo · Feb 2026", rating: 5, quote: "Felt incredibly safe on the boat. Sunrise sail was unforgettable." },
      { name: "Ravi K.", trip: "Couple · Jan 2026", rating: 4, quote: "English is a little limited but Jasim more than makes up for it with care." },
    ],
    availabilitySeed: 21,
    timeSlots: ["05:30", "08:00", "11:00", "14:00", "17:00"],
    accent: "purple",
  },

  // -------------- PHOTOGRAPHERS --------------
  {
    id: "photographer-arif",
    type: "photographer",
    name: "Arif Mahmud",
    tagline: "Sunset portraits & couples · 6 yrs",
    bio: "Editorial-style portrait photographer who lives for golden hour. Specializes in couples, honeymoon shoots and reels along Marine Drive and Inani.",
    portrait: photographer1,
    gallery: [marineImg, inaniImg, himchariImg, patuartekImg],
    pricePerHour: 1200,
    pricePerDay: 8000,
    bookingAdvance: 50,
    rating: 4.9,
    reviewCount: 168,
    reviewBreakdown: { total: 168, distribution: [148, 14, 3, 2, 1] },
    experienceYears: 6,
    languages: ["Bangla", "English"],
    features: ["DSLR + Prime", "Edited Photos", "Reels & Shorts", "48-hr Delivery"],
    highlights: [
      "60+ edited photos per session",
      "Reels optimized for Instagram",
      "Online gallery within 48 hours",
    ],
    services: [
      { name: "Couple sunset shoot", description: "1.5 hrs, 40 edited photos + 1 reel.", price: 4500, unit: "package" },
      { name: "Half-day editorial", description: "4 hrs, 60 edits, 2 outfits.", price: 7000, unit: "package" },
      { name: "Hourly", description: "Coverage at your event or location.", price: 1200, unit: "hour" },
    ],
    testimonials: [
      { name: "Farah & Adib", trip: "Honeymoon · Dec 2025", rating: 5, quote: "Arif made us feel relaxed and the photos are framable. Worth every taka." },
      { name: "Reza H.", trip: "Anniversary · Feb 2026", rating: 5, quote: "Delivered the gallery in 36 hours. Reel hit 200k views." },
      { name: "Nadia I.", trip: "Solo portraits · Jan 2026", rating: 4, quote: "Loved the moody edits. Wish there were more BTS clips." },
    ],
    availabilitySeed: 31,
    timeSlots: ["06:00", "10:00", "15:00", "16:30", "17:30"],
    accent: "pink",
  },
  {
    id: "photographer-maria",
    type: "photographer",
    name: "Maria Chowdhury",
    tagline: "Lifestyle & family shoots · 7 yrs",
    bio: "Calm, candid lifestyle photographer who specializes in family sessions, maternity and group shoots on the beach. Brings reflectors, props and patience.",
    portrait: photographer2,
    gallery: [inaniImg, marineImg, patuartekImg, ramuImg],
    pricePerHour: 1400,
    pricePerDay: 9000,
    bookingAdvance: 50,
    rating: 4.8,
    reviewCount: 124,
    reviewBreakdown: { total: 124, distribution: [102, 16, 4, 1, 1] },
    experienceYears: 7,
    languages: ["Bangla", "English"],
    features: ["DSLR + Prime", "Family Shoots", "Same-Day Previews", "Print-Ready"],
    highlights: [
      "Specializes in kids & maternity",
      "Provides props & reflectors",
      "Same-day preview gallery",
    ],
    services: [
      { name: "Family beach session", description: "2 hrs, up to 8 people, 50 edits.", price: 6000, unit: "package" },
      { name: "Maternity / portrait", description: "1.5 hrs, 40 edits, posing guide.", price: 5500, unit: "package" },
      { name: "Hourly", description: "Flexible coverage.", price: 1400, unit: "hour" },
    ],
    testimonials: [
      { name: "Anika R.", trip: "Family · Nov 2025", rating: 5, quote: "Maria handled three kids and a grumpy uncle like a pro. Photos are stunning." },
      { name: "Sadia T.", trip: "Maternity · Jan 2026", rating: 5, quote: "Made me feel beautiful at 8 months. The light she found was magic." },
      { name: "Imran S.", trip: "Group · Mar 2026", rating: 4, quote: "Slight delay on the gallery but the quality made up for it." },
    ],
    availabilitySeed: 43,
    timeSlots: ["07:00", "09:30", "15:30", "16:30", "17:30"],
    accent: "cyan",
  },
  {
    id: "photographer-tareq",
    type: "photographer",
    name: "Tareq Islam",
    tagline: "Drone & landscape specialist · 9 yrs",
    bio: "Aerial-first photographer with a DJI Mavic 3 and full FAA-style training. Best for cinematic Marine Drive flyovers, wedding aerials, and brand reels.",
    portrait: photographer3,
    gallery: [marineImg, himchariImg, saintMartinImg, patuartekImg],
    pricePerHour: 1800,
    pricePerDay: 11000,
    bookingAdvance: 50,
    rating: 5.0,
    reviewCount: 96,
    reviewBreakdown: { total: 96, distribution: [92, 3, 1, 0, 0] },
    experienceYears: 9,
    languages: ["Bangla", "English"],
    features: ["DSLR + Drone", "Cinematic Reels", "4K Delivery", "Brand Work"],
    highlights: [
      "DJI Mavic 3 + ND filters",
      "Cinematic 4K delivery",
      "Permits sorted for restricted spots",
    ],
    services: [
      { name: "Drone reel", description: "1 hr flight + 60s edited reel.", price: 6000, unit: "package" },
      { name: "Wedding aerials", description: "Half-day, drone + ground combo.", price: 11000, unit: "day" },
      { name: "Hourly", description: "Coverage with drone + DSLR.", price: 1800, unit: "hour" },
    ],
    testimonials: [
      { name: "Sabbir R.", trip: "Brand · Dec 2025", rating: 5, quote: "Reel went viral for our resort. Booking again for next season." },
      { name: "Farzana K.", trip: "Wedding · Feb 2026", rating: 5, quote: "Drone shots over Marine Drive made the wedding film unforgettable." },
      { name: "Nadeem H.", trip: "Couple · Jan 2026", rating: 5, quote: "Quiet, professional, and the cinematic edit was worth every taka." },
    ],
    availabilitySeed: 53,
    timeSlots: ["06:30", "10:00", "14:00", "16:00", "17:30"],
    accent: "purple",
  },
];

export const findExpertById = (id: string) => vibesExperts.find((e) => e.id === id);

/**
 * Deterministic mock availability for a given expert + date.
 * Returns true if the day is available, false if fully booked.
 * Uses a seeded hash so the same date always returns the same value.
 */
export const isDayAvailable = (seed: number, date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  if (target.getTime() < today.getTime()) return false;

  const day = target.getDate();
  const month = target.getMonth() + 1;
  const hash = (seed * 31 + day * 17 + month * 7) % 11;
  // ~73% of days are available
  return hash > 2;
};

/**
 * Deterministic mock for which time slots are taken on a given day.
 * Returns the set of slots that are unavailable.
 */
export const unavailableSlots = (
  seed: number,
  date: Date,
  slots: string[]
): Set<string> => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const out = new Set<string>();
  slots.forEach((slot, i) => {
    const hash = (seed + day * 13 + month * 5 + i * 19) % 7;
    if (hash < 2) out.add(slot);
  });
  return out;
};

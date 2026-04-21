// Experiences & adventure sports along Cox's Bazar Marine Drive.
// Prices stored in BDT. Dates ISO so we can filter "upcoming".

import partyImg from "@/assets/experience-party.jpg";
import sportsImg from "@/assets/experience-sports.jpg";
import musicImg from "@/assets/experience-music.jpg";

export type ExperienceCategory = "party" | "music" | "festival" | "cultural" | "food";
export type SportCategory = "water" | "aerial" | "land";

export type ExperienceType = "event" | "sport";

export interface ExperienceItem {
  id: string;
  type: ExperienceType;
  title: string;
  tagline: string;
  description: string;
  image: string;
  // Optional additional gallery images shown on the detail page
  gallery?: string[];
  // FAQ rendered on the detail page
  faqs?: { q: string; a: string }[];
  // Event-only — ISO date + display time
  date?: string;            // YYYY-MM-DD (events only)
  startTime?: string;       // e.g. "7:00 PM"
  endTime?: string;         // e.g. "1:00 AM"
  // Sport — operating window
  operatingHours?: string;  // e.g. "9:00 AM – 6:00 PM daily"
  durationMinutes?: number; // session length for sports
  // Common
  category: ExperienceCategory | SportCategory;
  location: string;         // human readable
  mapUrl: string;           // google maps link
  priceBdt: number;         // ticket / per session, BDT
  capacity?: number;        // remaining seats display
  bookingType: "ticket" | "session";
  organizer: string;
  contactPhone: string;
  // Detail page content
  dressCode: string[];
  requirements: string[];
  dos: string[];
  donts: string[];
  restrictedItems: string[];
  bookingProcess: string[]; // step list
}

export const experiences: ExperienceItem[] = [
  // ───────────────────────── EVENTS ─────────────────────────
  {
    id: "neon-bonfire-night",
    type: "event",
    title: "Neon Bonfire Night",
    tagline: "Dance under a million stars",
    description:
      "An open-air beach rave with bonfires, neon lasers, and live DJs spinning Bangla EDM, Afro-house, and tech beats until sunrise. Held right on the sand near Inani Beach Point with full bar service.",
    image: partyImg,
    gallery: [partyImg, musicImg, sportsImg],
    date: getUpcomingDate(5),
    startTime: "7:00 PM",
    endTime: "2:00 AM",
    category: "party",
    location: "Inani Beach Point, Marine Drive — KM 18",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Inani+Beach+Cox%27s+Bazar",
    priceBdt: 1500,
    capacity: 220,
    bookingType: "ticket",
    organizer: "InaniVibes Events",
    contactPhone: "+880 1700-000001",
    dressCode: ["Beach casual", "Neon / glow-friendly outfits encouraged", "Comfortable sandals or barefoot"],
    requirements: ["Age 18+ with valid photo ID", "Printed or digital ticket QR", "Cash or card for bar"],
    dos: ["Stay hydrated — free water station on site", "Use designated bonfire zones only", "Tip your bartenders & DJs"],
    donts: ["No glass bottles on the sand", "Do not enter the sea after 11 PM", "No drone flights without organizer permission"],
    restrictedItems: ["Outside alcohol", "Fireworks & sparklers", "Weapons of any kind", "Pets"],
    bookingProcess: [
      "Pick a quantity and submit a reservation request",
      "Receive a confirmation email within 30 minutes",
      "Pay on arrival at the entry gate (cash, card or bKash)",
      "Show your QR ticket at the neon arch entrance",
    ],
    faqs: [
      {
        q: "Is there parking on site?",
        a: "Yes — free parking for ~80 cars and unlimited bikes, 50 m from the entry arch.",
      },
      {
        q: "Can I bring my own drinks?",
        a: "No outside alcohol. Soft drinks in plastic bottles are fine. Full bar with cocktails on site.",
      },
      {
        q: "What if it rains?",
        a: "Light rain — we keep going under the canopy stage. Storm — event reschedules and your ticket auto-rolls to the next date.",
      },
      {
        q: "Is it safe for solo travelers?",
        a: "Absolutely — security and a women's help desk are on site all night, with marked safe zones and CCTV.",
      },
    ],
  },
  {
    id: "marine-drive-music-fest",
    type: "event",
    title: "Marine Drive Music Festival",
    tagline: "Two stages. One coastline.",
    description:
      "A two-stage open-air festival featuring top Bangladeshi rock, indie, and folk-fusion artists. Set against the cliffs of Himchari with food trucks, art installations, and a sunset acoustic stage.",
    image: musicImg,
    gallery: [musicImg, partyImg, sportsImg],
    date: getUpcomingDate(12),
    startTime: "4:00 PM",
    endTime: "11:30 PM",
    category: "music",
    location: "Himchari Hilltop Grounds, Marine Drive — KM 8",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Himchari+National+Park+Cox%27s+Bazar",
    priceBdt: 2200,
    capacity: 1500,
    bookingType: "ticket",
    organizer: "Bay Sound Collective",
    contactPhone: "+880 1700-000002",
    dressCode: ["Casual / festival wear", "Closed-toe shoes recommended for the hill terrain"],
    requirements: ["Valid ID at entry", "Reservation confirmation email", "Re-entry wristband (issued at gate)"],
    dos: ["Carry a refillable water bottle", "Use the marked pedestrian paths", "Apply sunscreen — sun sets late on stage 1"],
    donts: ["No professional cameras without media pass", "Do not climb cliff edges or barriers", "No smoking near the food court"],
    restrictedItems: ["Outside food & drinks", "Selfie sticks longer than 30 cm", "Laser pointers", "Vapes in non-smoking zones"],
    bookingProcess: [
      "Choose tier (General / VIP) and quantity",
      "Submit your reservation",
      "Pay at the box office or via bKash on confirmation",
      "Collect your wristband at the festival gate",
    ],
    faqs: [
      {
        q: "What's the difference between General and VIP?",
        a: "VIP gets front-of-stage access on both stages, a private bar, and seated lounge with food vouchers.",
      },
      {
        q: "Are kids allowed?",
        a: "Kids under 10 enter free with a ticketed adult; under 16 must be accompanied throughout.",
      },
      {
        q: "Is there a lost & found?",
        a: "Yes — at the info booth near the main gate. Items are kept for 72 hours after the festival.",
      },
    ],
  },
  {
    id: "full-moon-beach-yoga",
    type: "event",
    title: "Full Moon Beach Yoga & Sound Bath",
    tagline: "Restore by the waves",
    description:
      "A 90-minute candlelit yoga flow followed by a Tibetan singing-bowl sound bath on the soft sand of Sugandha Beach, timed perfectly with the full moon rising over the Bay of Bengal.",
    image: musicImg,
    gallery: [musicImg, partyImg, sportsImg],
    date: getUpcomingDate(3),
    startTime: "5:30 PM",
    endTime: "7:30 PM",
    category: "cultural",
    location: "Sugandha Beach Point, Marine Drive — KM 2",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Sugandha+Beach+Cox%27s+Bazar",
    priceBdt: 800,
    capacity: 40,
    bookingType: "ticket",
    organizer: "Bay Wellness Co.",
    contactPhone: "+880 1700-000003",
    dressCode: ["Light, stretchable clothing", "Bare feet (mats provided)"],
    requirements: ["Arrive 15 minutes early", "Inform instructor of any injuries"],
    dos: ["Hydrate before the session", "Switch phones to silent", "Stay for tea after the sound bath"],
    donts: ["No food or strong perfume", "Do not bring outside mats during high tide"],
    restrictedItems: ["Speakers / loud music", "Smoking material", "Glass cups"],
    bookingProcess: [
      "Select your slot and quantity",
      "Submit a reservation request",
      "Pay BDT in cash or bKash on arrival",
      "Sign in at the welcome table",
    ],
    faqs: [
      {
        q: "Do I need yoga experience?",
        a: "No — the flow is beginner-friendly with modifications shown for every pose.",
      },
      {
        q: "Are mats provided?",
        a: "Yes, eco-friendly cork mats and bolsters are included in the ticket.",
      },
    ],
  },
  {
    id: "seafood-night-bazaar",
    type: "event",
    title: "Marine Drive Seafood Night Bazaar",
    tagline: "Fresh catch, neon lights",
    description:
      "A weekly seafood street-food festival with 40+ stalls grilling lobster, prawn, snapper, and squid right by the shoreline. Live folk music, craft stalls, and a kids' corner.",
    image: partyImg,
    gallery: [partyImg, musicImg, sportsImg],
    date: getUpcomingDate(8),
    startTime: "6:00 PM",
    endTime: "11:00 PM",
    category: "food",
    location: "Kolatoli Beach Promenade, Marine Drive — KM 4",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Kolatoli+Beach+Cox%27s+Bazar",
    priceBdt: 200,
    capacity: 2000,
    bookingType: "ticket",
    organizer: "Cox's Bazar Tourism Board",
    contactPhone: "+880 1700-000004",
    dressCode: ["Casual"],
    requirements: ["Entry ticket (free for kids under 8)"],
    dos: ["Try the chef's tasting menu (BDT 950)", "Carry small change for stalls", "Use the recycling bins"],
    donts: ["No littering on the beach", "Do not feed the seagulls"],
    restrictedItems: ["Outside food", "Glass containers"],
    bookingProcess: [
      "Reserve entry tickets here",
      "Receive QR ticket via email",
      "Scan at the entry gate",
      "Buy food directly from stalls (cash / bKash)",
    ],
    faqs: [
      {
        q: "Is the entry ticket the only cost?",
        a: "Entry is just BDT 200. Stalls are pay-as-you-go — most plates are BDT 250–950.",
      },
      {
        q: "Are vegetarian options available?",
        a: "Yes — at least 6 stalls serve veg snacks, dosa, and seasonal grilled vegetables.",
      },
    ],
  },

  // ─────────────────────── ADVENTURE SPORTS ───────────────────────
  {
    id: "parasailing-marine-drive",
    type: "sport",
    title: "Parasailing over Marine Drive",
    tagline: "300 ft above the bay",
    description:
      "Strap into a tandem parachute and soar 300 feet above the Bay of Bengal with a panoramic view of the world's longest natural beach. Includes professional briefing and GoPro footage.",
    image: sportsImg,
    gallery: [sportsImg, partyImg, musicImg],
    operatingHours: "9:00 AM – 5:00 PM daily",
    durationMinutes: 15,
    category: "aerial",
    location: "Laboni Beach Activity Zone, Marine Drive — KM 1",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Laboni+Beach+Cox%27s+Bazar",
    priceBdt: 3500,
    bookingType: "session",
    organizer: "Bay Air Adventures",
    contactPhone: "+880 1700-000010",
    dressCode: ["Swimwear or quick-dry shorts", "T-shirt (provided life jacket goes over it)"],
    requirements: [
      "Age 12+ with guardian for under 16",
      "Weight 30–110 kg",
      "Sign waiver at the booth",
      "No serious heart, back, or neck conditions",
    ],
    dos: ["Listen to the full safety briefing", "Keep arms inside the harness during launch", "Smile for the GoPro"],
    donts: ["Do not unhook the harness mid-flight", "Avoid the activity if pregnant", "No diving from the parachute"],
    restrictedItems: ["Loose jewelry", "Phones in pockets", "Glass eyewear (sport sunglasses ok)"],
    bookingProcess: [
      "Pick a date and party size",
      "Submit a session request",
      "Get a 1-hour time slot via email/SMS",
      "Pay on arrival and gear up at the booth",
    ],
    faqs: [
      {
        q: "Will I get wet?",
        a: "Only if you choose the splash-down option at the end. Otherwise you stay completely dry.",
      },
      {
        q: "Is the GoPro video included?",
        a: "Yes — you receive a 2 min edited clip via WhatsApp within 30 minutes after landing.",
      },
    ],
  },
  {
    id: "jetski-inani",
    type: "sport",
    title: "Jet Ski Coastal Run",
    tagline: "Throttle the turquoise",
    description:
      "Pilot a 130 HP Yamaha jet ski along a 3 km coastal route with an instructor escort. Beginner and expert routes available, calm-water bay or open-sea breakers.",
    image: sportsImg,
    gallery: [sportsImg, partyImg, musicImg],
    operatingHours: "8:00 AM – 6:00 PM daily",
    durationMinutes: 30,
    category: "water",
    location: "Inani Beach Watersports, Marine Drive — KM 18",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Inani+Beach+Cox%27s+Bazar",
    priceBdt: 2800,
    bookingType: "session",
    organizer: "Inani Watersports Club",
    contactPhone: "+880 1700-000011",
    dressCode: ["Swimwear", "Rash guard recommended"],
    requirements: ["Age 16+ to drive solo", "Basic swimming ability", "Sign liability waiver"],
    dos: ["Wear the kill-cord lanyard at all times", "Stay within marked buoys", "Return ski with full throttle off"],
    donts: ["Do not exceed 30 km/h within 200 m of swimmers", "No standing while accelerating", "Do not race other rented skis"],
    restrictedItems: ["Alcohol before riding", "Phones (waterproof pouch ok)", "Loose footwear"],
    bookingProcess: [
      "Choose a date, route, and party size",
      "Submit a session request",
      "Receive your time slot confirmation",
      "Show ID and pay at the watersports booth",
    ],
    faqs: [
      {
        q: "Can I ride with a passenger?",
        a: "Yes — our skis seat 2. Driver must be 16+, passenger 8+ (with adult).",
      },
      {
        q: "Do I need a license?",
        a: "No license needed — a 10 min safety briefing covers everything before launch.",
      },
    ],
  },
  {
    id: "banana-boat-himchari",
    type: "sport",
    title: "Banana Boat & Donut Ride",
    tagline: "Hold tight, laugh loud",
    description:
      "A high-speed inflatable tow ride for groups of 4–6 along the Himchari shoreline. Friendly for first-timers and absolute chaos for the brave.",
    image: sportsImg,
    gallery: [sportsImg, partyImg, musicImg],
    operatingHours: "9:00 AM – 5:30 PM daily",
    durationMinutes: 20,
    category: "water",
    location: "Himchari Beach, Marine Drive — KM 8",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Himchari+Beach+Cox%27s+Bazar",
    priceBdt: 1200,
    bookingType: "session",
    organizer: "Himchari Marine Sports",
    contactPhone: "+880 1700-000012",
    dressCode: ["Swimwear", "Tied-back hair"],
    requirements: ["Age 8+", "Group of 4–6 riders", "Basic floating ability"],
    dos: ["Hold the handles firmly", "Lean inward on turns", "Signal the boat captain to slow down anytime"],
    donts: ["Do not stand on the tube", "Do not jump off without the captain seeing you", "Avoid if you have shoulder injuries"],
    restrictedItems: ["Glasses without straps", "Heavy jewelry", "Phones"],
    bookingProcess: [
      "Pick date and group size",
      "Submit your reservation",
      "Confirm your slot at the booth",
      "Gear up & hop in",
    ],
    faqs: [
      {
        q: "Will the boat tip us over?",
        a: "Only if requested! Captains adjust speed to your group's comfort — say the word for chaos mode.",
      },
    ],
  },
  {
    id: "atv-beach-trail",
    type: "sport",
    title: "ATV Beach Trail Ride",
    tagline: "Sand, dunes, dust",
    description:
      "Ride a 250cc quad bike along a guided 5 km off-road trail through dunes and pine groves between Marine Drive and the beach. Helmets, goggles, and instructor included.",
    image: sportsImg,
    gallery: [sportsImg, partyImg, musicImg],
    operatingHours: "9:00 AM – 6:00 PM daily",
    durationMinutes: 45,
    category: "land",
    location: "Marine Drive Dune Park, KM 12",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Marine+Drive+Cox%27s+Bazar",
    priceBdt: 2500,
    bookingType: "session",
    organizer: "Coastal Trails BD",
    contactPhone: "+880 1700-000013",
    dressCode: ["Long pants", "Closed-toe sneakers or boots"],
    requirements: ["Age 16+ with valid driving license", "Sober riders only", "Sign waiver at booth"],
    dos: ["Stay behind the guide", "Use both hands on the throttle", "Brake gently on sand"],
    donts: ["No racing", "Do not leave the marked trail", "No passengers on single-seat ATVs"],
    restrictedItems: ["Open sandals", "Headphones", "Glass containers"],
    bookingProcess: [
      "Pick a slot and rider count",
      "Submit a session request",
      "Confirm via email/SMS",
      "Arrive 20 minutes early for briefing",
    ],
    faqs: [
      {
        q: "Do I need riding experience?",
        a: "No — automatic-transmission ATVs and a 15 min training loop are included.",
      },
    ],
  },
  {
    id: "scuba-discovery-sonadia",
    type: "sport",
    title: "Scuba Discovery Dive — Sonadia",
    tagline: "Meet the reef",
    description:
      "A guided beginner's scuba experience off Sonadia Island with PADI-certified instructors. Includes 30 min pool training, then a 25 min open-water dive to 8 m.",
    image: sportsImg,
    gallery: [sportsImg, partyImg, musicImg],
    operatingHours: "8:00 AM – 4:00 PM (weather permitting)",
    durationMinutes: 180,
    category: "water",
    location: "Sonadia Island Dive Center, Marine Drive jetty — KM 22",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Sonadia+Island+Cox%27s+Bazar",
    priceBdt: 6500,
    bookingType: "session",
    organizer: "Bay Reef Divers",
    contactPhone: "+880 1700-000014",
    dressCode: ["Swimwear under wetsuit (provided)", "Towel & change of clothes"],
    requirements: [
      "Age 12+",
      "Comfortable in deep water",
      "No asthma, ear infections, or recent surgery",
      "Medical declaration form signed",
    ],
    dos: ["Equalize ears every meter", "Stay close to your instructor", "Breathe slowly and continuously"],
    donts: ["Never hold your breath", "Do not touch coral or marine life", "Do not dive if congested"],
    restrictedItems: ["Alcohol within 12 h before dive", "Heavy meals 2 h before", "Sharp jewelry"],
    bookingProcess: [
      "Book at least 24 h in advance",
      "Submit your medical form",
      "Receive boat departure time",
      "Pay at the dive center on arrival",
    ],
    faqs: [
      {
        q: "What if I can't equalize my ears?",
        a: "Your instructor will help you ascend slightly and try again — if not possible, the dive is shortened with no extra cost.",
      },
      {
        q: "Will I see fish?",
        a: "Yes — Sonadia reef is home to parrotfish, clownfish, sergeant majors and (in season) rays.",
      },
    ],
  },
];

// Helper — date N days from today, ISO YYYY-MM-DD
function getUpcomingDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
}

export const getExperienceById = (id: string) =>
  experiences.find((e) => e.id === id);

export const getUpcomingEvents = () =>
  experiences
    .filter((e) => e.type === "event" && e.date)
    .sort((a, b) => (a.date! < b.date! ? -1 : 1));

export const getAdventureSports = () =>
  experiences.filter((e) => e.type === "sport");


import inaniImg from "@/assets/places/inani-beach.jpg";
import kolatoliImg from "@/assets/places/kolatoli-beach.jpg";
import shugondhaImg from "@/assets/places/shugondha-beach.jpg";
import laboniImg from "@/assets/places/laboni-beach.jpg";
import marineImg from "@/assets/places/marine-drive.jpg";
import patuartekImg from "@/assets/places/patuartek.jpg";
import teknafImg from "@/assets/places/teknaf.jpg";
import shahParirImg from "@/assets/places/shah-parir-dwip.jpg";
import himchariImg from "@/assets/places/himchari.jpg";
import saintMartinImg from "@/assets/places/saint-martin-island.jpg";
import radiantImg from "@/assets/places/radiant-fish-world.jpg";
import ramuImg from "@/assets/places/ramu-buddhist-temples.jpg";
import maheshkhaliImg from "@/assets/places/maheshkhali-island.jpg";
import sonadiaImg from "@/assets/places/sonadia-island.jpg";
import dulahazaraImg from "@/assets/places/dulahazara-safari-park.jpg";
import kutubdiaImg from "@/assets/places/kutubdia-island.jpg";
import burmeseImg from "@/assets/places/burmese-market.jpg";
import seaPearlImg from "@/assets/places/sea-pearl-water-park.jpg";
import miniBandarbanImg from "@/assets/places/mini-bandarban.jpg";

export type PlaceCategory = "Beach" | "Drive" | "Island" | "Nature" | "Cultural" | "Family" | "Market";

export interface Place {
  slug: string;
  name: string;
  category: PlaceCategory;
  image: string;
  description: string;
  bestTime: string;
  tip: string;
  distance?: string;
  /** Approx straight-line kilometers from Cox's Bazar town. Used for sorting + map. 0 = town center. */
  distanceKm: number;
  /** Map position in normalized 0–100 SVG-space coordinates (x = horizontal, y = vertical). */
  map: { x: number; y: number };
  /** First month the best-time window opens (1–12). Used for sorting. */
  seasonStart: number;
}

// Curated list of Cox's Bazar destinations.
// Each entry has dedicated photography, an approximate distance from Cox's Bazar town
// (used for sorting + display), a normalized map position for the stylized SVG map, and
// a season-start month used by the "best time" sort.
export const places: Place[] = [
  {
    slug: "laboni-beach",
    name: "Laboni Beach",
    category: "Beach",
    image: laboniImg,
    description:
      "The 'main beach' closest to town — gentle waves, lifeguard towers, and the easiest place to rent a beach umbrella.",
    bestTime: "Year-round",
    tip: "Swim only inside the marked safe-zone flags",
    distance: "1 km from city center",
    distanceKm: 1,
    map: { x: 36, y: 42 },
    seasonStart: 1,
  },
  {
    slug: "shugondha-beach",
    name: "Shugondha Beach",
    category: "Beach",
    image: shugondhaImg,
    description:
      "Lined with handicraft stalls, oyster sellers, and Burmese-market boutiques — the most lively shopping-meets-sand stretch.",
    bestTime: "Year-round",
    tip: "Bargain hard for shell jewelry and dried fish",
    distance: "Walking distance from Kolatoli",
    distanceKm: 2,
    map: { x: 35, y: 45 },
    seasonStart: 1,
  },
  {
    slug: "kolatoli-beach",
    name: "Kolatoli Beach",
    category: "Beach",
    image: kolatoliImg,
    description:
      "The buzzing heart of Cox's Bazar nightlife — hotel strip, beach cafés, and the most popular sunset spot in the city.",
    bestTime: "Oct - Mar",
    tip: "Ride a beach bike just before sunset for the best photos",
    distance: "Cox's Bazar city center",
    distanceKm: 3,
    map: { x: 35, y: 47 },
    seasonStart: 10,
  },
  {
    slug: "burmese-market",
    name: "Burmese Market",
    category: "Market",
    image: burmeseImg,
    description:
      "Cross-border bazaar packed with Burmese textiles, thanaka cosmetics, dried seafood, and Rakhine handicrafts.",
    bestTime: "Year-round",
    tip: "Go in the evening when stalls light up — and bargain politely",
    distance: "Burmese Market Road, Cox's Bazar",
    distanceKm: 3,
    map: { x: 38, y: 44 },
    seasonStart: 1,
  },
  {
    slug: "radiant-fish-world",
    name: "Radiant Fish World",
    category: "Family",
    image: radiantImg,
    description:
      "Bangladesh's largest aquarium — sharks, rays, and a walk-through tunnel right in the middle of Cox's Bazar town.",
    bestTime: "Year-round",
    tip: "Best visited in the late afternoon to skip school crowds",
    distance: "Kolatoli area",
    distanceKm: 4,
    map: { x: 39, y: 48 },
    seasonStart: 1,
  },
  {
    slug: "himchari",
    name: "Himchari National Park & Waterfall",
    category: "Nature",
    image: himchariImg,
    description:
      "Lush green hills meeting the sea, with waterfalls hidden in the jungle canopy and viewpoints over Marine Drive.",
    bestTime: "Jun - Sep",
    tip: "The waterfall is at its best during monsoon season",
    distance: "12 km south of Cox's Bazar",
    distanceKm: 12,
    map: { x: 38, y: 56 },
    seasonStart: 6,
  },
  {
    slug: "mini-bandarban",
    name: "Mini Bandarban",
    category: "Nature",
    image: miniBandarbanImg,
    description:
      "A scenic green-hill viewpoint nicknamed for its Bandarban-like vistas — winding roads, valleys, and tribal villages.",
    bestTime: "Jul - Oct",
    tip: "Reach at sunrise — the morning mist over the hills is unreal",
    distance: "Off Marine Drive, near Himchari",
    distanceKm: 14,
    map: { x: 44, y: 58 },
    seasonStart: 7,
  },
  {
    slug: "ramu-buddhist-temples",
    name: "Ramu Buddhist Temples",
    category: "Cultural",
    image: ramuImg,
    description:
      "A cluster of golden pagodas and centuries-old monasteries set among bamboo groves — the spiritual heart of the region.",
    bestTime: "Oct - Mar",
    tip: "Dress modestly and remove shoes before entering shrines",
    distance: "16 km east of Cox's Bazar",
    distanceKm: 16,
    map: { x: 56, y: 42 },
    seasonStart: 10,
  },
  {
    slug: "maheshkhali-island",
    name: "Maheshkhali Island & Adinath Temple",
    category: "Cultural",
    image: maheshkhaliImg,
    description:
      "Hilltop Adinath Hindu temple, betel-leaf farms, and the famous dry-fish bazaar — reachable by a short speedboat ride.",
    bestTime: "Nov - Mar",
    tip: "Try the freshly smoked dry fish at the market",
    distance: "Speedboat from 6-No Ghat",
    distanceKm: 18,
    map: { x: 18, y: 38 },
    seasonStart: 11,
  },
  {
    slug: "marine-drive",
    name: "Marine Drive",
    category: "Drive",
    image: marineImg,
    description:
      "The world's longest natural sea-beach road — 80 km of cinematic coastal highway hugging hills on one side, Bay of Bengal on the other.",
    bestTime: "Year-round",
    tip: "Sunset drives are absolutely magical — rent an open jeep",
    distance: "Starts at Kolatoli, ends at Teknaf",
    distanceKm: 20,
    map: { x: 42, y: 62 },
    seasonStart: 1,
  },
  {
    slug: "sonadia-island",
    name: "Sonadia Island",
    category: "Nature",
    image: sonadiaImg,
    description:
      "An untouched eco-island of mangroves, red crabs, and migratory birds — a paradise for slow travel and birdwatching.",
    bestTime: "Dec - Feb",
    tip: "Bring binoculars and book a local guide in advance",
    distance: "Boat via Maheshkhali",
    distanceKm: 25,
    map: { x: 14, y: 30 },
    seasonStart: 12,
  },
  {
    slug: "inani-beach",
    name: "Inani Beach",
    category: "Beach",
    image: inaniImg,
    description:
      "Pristine rocky coral beach with crystal-clear waters — the quieter gem of Cox's Bazar, perfect for low-tide tide-pool exploration.",
    bestTime: "Nov - Mar",
    tip: "Visit during low tide for the best coral views",
    distance: "32 km south of Cox's Bazar town",
    distanceKm: 32,
    map: { x: 44, y: 70 },
    seasonStart: 11,
  },
  {
    slug: "sea-pearl-water-park",
    name: "Sea Pearl Water Park",
    category: "Family",
    image: seaPearlImg,
    description:
      "Beach-front water park with slides, wave pools, and a lazy river — perfect for families and a midday cooldown.",
    bestTime: "Year-round",
    tip: "Buy combo tickets with the resort spa for a full day out",
    distance: "Inani, on Marine Drive",
    distanceKm: 33,
    map: { x: 46, y: 71 },
    seasonStart: 1,
  },
  {
    slug: "patuartek",
    name: "Patuartek",
    category: "Beach",
    image: patuartekImg,
    description:
      "A hidden coral cove on Marine Drive — shallow rock pools, crab walks, and a quieter alternative to Inani.",
    bestTime: "Nov - Feb",
    tip: "Wear water shoes — the corals are sharp",
    distance: "40 km south on Marine Drive",
    distanceKm: 40,
    map: { x: 47, y: 76 },
    seasonStart: 11,
  },
  {
    slug: "dulahazara-safari-park",
    name: "Dulahazara Safari Park",
    category: "Family",
    image: dulahazaraImg,
    description:
      "Open-range wildlife safari with elephants, deer, tigers, and crocodiles set across 600+ hectares of forest.",
    bestTime: "Oct - Mar",
    tip: "Take the morning safari — animals are most active early",
    distance: "50 km north on the Chittagong highway",
    distanceKm: 50,
    map: { x: 60, y: 18 },
    seasonStart: 10,
  },
  {
    slug: "kutubdia-island",
    name: "Kutubdia Island",
    category: "Island",
    image: kutubdiaImg,
    description:
      "Windmills, salt fields, and lighthouse ruins on a peaceful offshore island — a glimpse of slow coastal life.",
    bestTime: "Nov - Mar",
    tip: "Hire a battery-rickshaw for a half-day island loop",
    distance: "Boat from Magnama Ghat",
    distanceKm: 60,
    map: { x: 10, y: 16 },
    seasonStart: 11,
  },
  {
    slug: "teknaf",
    name: "Teknaf",
    category: "Drive",
    image: teknafImg,
    description:
      "The southernmost tip of mainland Bangladesh, where the Naf River meets the sea and Myanmar hills appear across the water.",
    bestTime: "Nov - Mar",
    tip: "Catch the early morning ferry to Saint Martin from here",
    distance: "85 km south of Cox's Bazar",
    distanceKm: 85,
    map: { x: 56, y: 88 },
    seasonStart: 11,
  },
  {
    slug: "shah-parir-dwip",
    name: "Shah Parir Dwip",
    category: "Island",
    image: shahParirImg,
    description:
      "A windswept fishing island at the mouth of the Naf — endless beach, drying fish racks, and dramatic dawn skies.",
    bestTime: "Nov - Feb",
    tip: "Combine with a Saint Martin trip — same boat route",
    distance: "Boat from Teknaf jetty",
    distanceKm: 95,
    map: { x: 60, y: 92 },
    seasonStart: 11,
  },
  {
    slug: "saint-martin-island",
    name: "Saint Martin Island",
    category: "Island",
    image: saintMartinImg,
    description:
      "Bangladesh's only coral island — turquoise lagoons, coconut groves, and laid-back beach shacks on Chera Dwip.",
    bestTime: "Nov - Feb",
    tip: "Stay overnight to see the bioluminescent plankton",
    distance: "Ferry from Teknaf (~2.5 hrs)",
    distanceKm: 120,
    map: { x: 78, y: 96 },
    seasonStart: 11,
  },
];
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
// Images for new entries fall back to existing place photos until dedicated assets are added.
export const places: Place[] = [
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
  },
  {
    slug: "kolatoli-beach",
    name: "Kolatoli Beach",
    category: "Beach",
    image: marineImg,
    description:
      "The buzzing heart of Cox's Bazar nightlife — hotel strip, beach cafés, and the most popular sunset spot in the city.",
    bestTime: "Oct - Mar",
    tip: "Ride a beach bike just before sunset for the best photos",
    distance: "Cox's Bazar city center",
  },
  {
    slug: "shugondha-beach",
    name: "Shugondha Beach",
    category: "Beach",
    image: inaniImg,
    description:
      "Lined with handicraft stalls, oyster sellers, and Burmese-market boutiques — the most lively shopping-meets-sand stretch.",
    bestTime: "Year-round",
    tip: "Bargain hard for shell jewelry and dried fish",
    distance: "Walking distance from Kolatoli",
  },
  {
    slug: "laboni-beach",
    name: "Laboni Beach",
    category: "Beach",
    image: marineImg,
    description:
      "The 'main beach' closest to town — gentle waves, lifeguard towers, and the easiest place to rent a beach umbrella.",
    bestTime: "Year-round",
    tip: "Swim only inside the marked safe-zone flags",
    distance: "1 km from city center",
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
  },
  {
    slug: "patuartek",
    name: "Patuartek",
    category: "Beach",
    image: inaniImg,
    description:
      "A hidden coral cove on Marine Drive — shallow rock pools, crab walks, and a quieter alternative to Inani.",
    bestTime: "Nov - Feb",
    tip: "Wear water shoes — the corals are sharp",
    distance: "40 km south on Marine Drive",
  },
  {
    slug: "teknaf",
    name: "Teknaf",
    category: "Drive",
    image: marineImg,
    description:
      "The southernmost tip of mainland Bangladesh, where the Naf River meets the sea and Myanmar hills appear across the water.",
    bestTime: "Nov - Mar",
    tip: "Catch the early morning ferry to Saint Martin from here",
    distance: "85 km south of Cox's Bazar",
  },
  {
    slug: "shah-parir-dwip",
    name: "Shah Parir Dwip",
    category: "Island",
    image: himchariImg,
    description:
      "A windswept fishing island at the mouth of the Naf — endless beach, drying fish racks, and dramatic dawn skies.",
    bestTime: "Nov - Feb",
    tip: "Combine with a Saint Martin trip — same boat route",
    distance: "Boat from Teknaf jetty",
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
  },
  {
    slug: "saint-martin-island",
    name: "Saint Martin Island",
    category: "Island",
    image: inaniImg,
    description:
      "Bangladesh's only coral island — turquoise lagoons, coconut groves, and laid-back beach shacks on Chera Dwip.",
    bestTime: "Nov - Feb",
    tip: "Stay overnight to see the bioluminescent plankton",
    distance: "Ferry from Teknaf (~2.5 hrs)",
  },
  {
    slug: "radiant-fish-world",
    name: "Radiant Fish World",
    category: "Family",
    image: himchariImg,
    description:
      "Bangladesh's largest aquarium — sharks, rays, and a walk-through tunnel right in the middle of Cox's Bazar town.",
    bestTime: "Year-round",
    tip: "Best visited in the late afternoon to skip school crowds",
    distance: "Kolatoli area",
  },
  {
    slug: "ramu-buddhist-temples",
    name: "Ramu Buddhist Temples",
    category: "Cultural",
    image: himchariImg,
    description:
      "A cluster of golden pagodas and centuries-old monasteries set among bamboo groves — the spiritual heart of the region.",
    bestTime: "Oct - Mar",
    tip: "Dress modestly and remove shoes before entering shrines",
    distance: "16 km east of Cox's Bazar",
  },
  {
    slug: "maheshkhali-island",
    name: "Maheshkhali Island & Adinath Temple",
    category: "Cultural",
    image: himchariImg,
    description:
      "Hilltop Adinath Hindu temple, betel-leaf farms, and the famous dry-fish bazaar — reachable by a short speedboat ride.",
    bestTime: "Nov - Mar",
    tip: "Try the freshly smoked dry fish at the market",
    distance: "Speedboat from 6-No Ghat",
  },
  {
    slug: "sonadia-island",
    name: "Sonadia Island",
    category: "Nature",
    image: inaniImg,
    description:
      "An untouched eco-island of mangroves, red crabs, and migratory birds — a paradise for slow travel and birdwatching.",
    bestTime: "Dec - Feb",
    tip: "Bring binoculars and book a local guide in advance",
    distance: "Boat via Maheshkhali",
  },
  {
    slug: "dulahazara-safari-park",
    name: "Dulahazara Safari Park",
    category: "Family",
    image: himchariImg,
    description:
      "Open-range wildlife safari with elephants, deer, tigers, and crocodiles set across 600+ hectares of forest.",
    bestTime: "Oct - Mar",
    tip: "Take the morning safari — animals are most active early",
    distance: "50 km north on the Chittagong highway",
  },
  {
    slug: "kutubdia-island",
    name: "Kutubdia Island",
    category: "Island",
    image: marineImg,
    description:
      "Windmills, salt fields, and lighthouse ruins on a peaceful offshore island — a glimpse of slow coastal life.",
    bestTime: "Nov - Mar",
    tip: "Hire a battery-rickshaw for a half-day island loop",
    distance: "Boat from Magnama Ghat",
  },
  {
    slug: "burmese-market",
    name: "Burmese Market",
    category: "Market",
    image: marineImg,
    description:
      "Cross-border bazaar packed with Burmese textiles, thanaka cosmetics, dried seafood, and Rakhine handicrafts.",
    bestTime: "Year-round",
    tip: "Go in the evening when stalls light up — and bargain politely",
    distance: "Burmese Market Road, Cox's Bazar",
  },
  {
    slug: "sea-pearl-water-park",
    name: "Sea Pearl Water Park",
    category: "Family",
    image: inaniImg,
    description:
      "Beach-front water park with slides, wave pools, and a lazy river — perfect for families and a midday cooldown.",
    bestTime: "Year-round",
    tip: "Buy combo tickets with the resort spa for a full day out",
    distance: "Inani, on Marine Drive",
  },
  {
    slug: "mini-bandarban",
    name: "Mini Bandarban",
    category: "Nature",
    image: himchariImg,
    description:
      "A scenic green-hill viewpoint nicknamed for its Bandarban-like vistas — winding roads, valleys, and tribal villages.",
    bestTime: "Jul - Oct",
    tip: "Reach at sunrise — the morning mist over the hills is unreal",
    distance: "Off Marine Drive, near Himchari",
  },
];
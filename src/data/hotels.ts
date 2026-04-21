import hotel1 from "@/assets/hotel-1.jpg";
import hotel2 from "@/assets/hotel-2.jpg";
import hotel3 from "@/assets/hotel-3.jpg";
import hotel4 from "@/assets/hotel-4.jpg";
import hotel5 from "@/assets/hotel-5.jpg";
import hotel6 from "@/assets/hotel-6.jpg";

export interface HotelRoom {
  id: string;
  name: string;
  description: string;
  maxGuests: number;
  bedType: string;
  size: number; // sqft
  price: number;
  amenities: string[];
  available: number;
  gallery?: string[];
}

// Default photo gallery (≥6 images) for each room — reuses property
// imagery so every room card has a "Photos" preview that works out of the box.
const defaultRoomGallery = [hotel1, hotel2, hotel3, hotel4, hotel5, hotel6];

export const getRoomGallery = (room: HotelRoom): string[] =>
  room.gallery && room.gallery.length >= 6 ? room.gallery : defaultRoomGallery;

export interface Hotel {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  tags: string[];
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  rooms: HotelRoom[];
  policies: {
    cancellation: string;
    children: string;
    pets: string;
    smoking: string;
  };
  coordinates: { lat: number; lng: number };
  // Optional review/highlight content. When omitted, the UI falls back to
  // sensible defaults derived from the hotel's existing rating + tags.
  highlights?: string[];
  reviewScores?: {
    cleanliness: number;
    location: number;
    staff: number;
    comfort: number;
    value: number;
    facilities: number;
  };
  reviews?: HotelReview[];
}

export interface HotelReview {
  id: string;
  author: string;
  country: string;
  date: string; // ISO yyyy-mm-dd
  score: number; // 0–10
  title: string;
  comment: string;
  tripType?: "Couple" | "Family" | "Solo" | "Business" | "Group";
}

/**
 * Returns a 6-axis review score breakdown. Falls back to a generated set
 * derived from the hotel's overall rating so every hotel renders nicely
 * without needing to hand-author scores.
 */
export const getReviewScores = (hotel: Hotel) => {
  if (hotel.reviewScores) return hotel.reviewScores;
  // Convert 0–5 rating to a 0–10 score and add small natural variance.
  const base = hotel.rating * 2;
  const v = (offset: number) => Math.max(7, Math.min(10, +(base + offset).toFixed(1)));
  return {
    cleanliness: v(0.2),
    location: v(0.4),
    staff: v(0.3),
    comfort: v(0.1),
    value: v(-0.2),
    facilities: v(0.0),
  };
};

/** Overall numeric score (0–10) derived from rating. */
export const getOverallScore = (hotel: Hotel) => +(hotel.rating * 2).toFixed(1);

/** Booking.com-style verbal label for a 0–10 score. */
export const getScoreLabel = (score: number) => {
  if (score >= 9) return "Exceptional";
  if (score >= 8.5) return "Fabulous";
  if (score >= 8) return "Very Good";
  if (score >= 7) return "Good";
  return "Pleasant";
};

/** Highlights shown near the top — falls back to tag-derived defaults. */
export const getHighlights = (hotel: Hotel): string[] => {
  if (hotel.highlights && hotel.highlights.length) return hotel.highlights;
  const fallback: string[] = [];
  if (hotel.tags.some((t) => /sea|beach/i.test(t))) fallback.push("Steps from the beach");
  if (hotel.amenities.some((a) => /pool/i.test(a))) fallback.push("Outdoor pool");
  if (hotel.amenities.some((a) => /wifi/i.test(a))) fallback.push("Free WiFi in all rooms");
  if (hotel.amenities.some((a) => /breakfast|restaurant/i.test(a))) fallback.push("On-site restaurant");
  if (hotel.policies.cancellation.toLowerCase().includes("free cancellation"))
    fallback.push("Free cancellation available");
  return fallback.slice(0, 4);
};

const sampleAuthors = [
  { author: "Tasnim R.", country: "Bangladesh", tripType: "Couple" as const },
  { author: "Rafi A.", country: "Bangladesh", tripType: "Family" as const },
  { author: "Sana K.", country: "India", tripType: "Solo" as const },
  { author: "James W.", country: "United Kingdom", tripType: "Couple" as const },
  { author: "Mehedi H.", country: "Bangladesh", tripType: "Group" as const },
];

const sampleReviewTemplates = [
  {
    title: "An unforgettable beach getaway",
    comment:
      "The views from the room were stunning and the staff went above and beyond to make our stay memorable. Breakfast was fresh and the location is unbeatable.",
  },
  {
    title: "Exactly what we needed",
    comment:
      "Clean rooms, friendly team and a great pool to unwind after a day at the beach. Will definitely come back next season.",
  },
  {
    title: "Loved the vibe and the food",
    comment:
      "The rooftop is a scene at sunset. Rooms are modern and comfy, and the in-house restaurant served some of the best seafood we tried in Cox's Bazar.",
  },
  {
    title: "Great value for the price",
    comment:
      "Everything was as promised. Spotless room, quick check-in, and the front desk helped us arrange transport without any fuss.",
  },
];

/**
 * Returns a deterministic set of sample reviews for a hotel. Real reviews
 * (when present) are returned first; otherwise we generate 4 plausible ones.
 */
export const getReviews = (hotel: Hotel): HotelReview[] => {
  if (hotel.reviews && hotel.reviews.length) return hotel.reviews;
  const overall = getOverallScore(hotel);
  return sampleReviewTemplates.map((tpl, i) => {
    const a = sampleAuthors[i % sampleAuthors.length];
    // Spread scores around the overall (±0.4)
    const offset = [0.2, -0.1, 0.4, -0.3][i] ?? 0;
    const score = Math.max(7, Math.min(10, +(overall + offset).toFixed(1)));
    // Spread dates over the last few months
    const d = new Date();
    d.setMonth(d.getMonth() - (i + 1));
    return {
      id: `${hotel.id}-rev-${i}`,
      author: a.author,
      country: a.country,
      tripType: a.tripType,
      date: d.toISOString().slice(0, 10),
      score,
      title: tpl.title,
      comment: tpl.comment,
    };
  });
};

export const hotels: Hotel[] = [
  {
    id: "ocean-neon-resort",
    name: "Ocean Neon Resort",
    location: "Inani Beach, Cox's Bazar",
    description:
      "A premium beachfront resort with panoramic ocean views, infinity pool, and world-class dining. Located on the pristine Inani Beach, this resort offers an unparalleled luxury experience with modern amenities and traditional Bangladeshi hospitality.",
    price: 12500,
    rating: 4.8,
    reviewCount: 342,
    image: hotel1,
    gallery: [hotel1, hotel4, hotel5],
    tags: ["Sea View", "Pool", "Family"],
    amenities: [
      "Free WiFi",
      "Infinity Pool",
      "Spa & Wellness",
      "Restaurant",
      "Room Service",
      "Beach Access",
      "Gym",
      "Parking",
      "Air Conditioning",
      "Laundry",
    ],
    checkInTime: "2:00 PM",
    checkOutTime: "12:00 PM",
    rooms: [
      {
        id: "onr-deluxe",
        name: "Deluxe Ocean View",
        description: "Spacious room with private balcony overlooking the ocean.",
        maxGuests: 2,
        bedType: "King",
        size: 450,
        price: 12500,
        amenities: ["Ocean View", "Balcony", "Mini Bar", "Safe"],
        available: 5,
      },
      {
        id: "onr-premium",
        name: "Premium Suite",
        description: "Luxurious suite with separate living area and panoramic views.",
        maxGuests: 3,
        bedType: "King + Sofa Bed",
        size: 750,
        price: 22000,
        amenities: ["Ocean View", "Balcony", "Living Room", "Jacuzzi", "Mini Bar"],
        available: 2,
      },
      {
        id: "onr-family",
        name: "Family Room",
        description: "Perfect for families with connecting rooms and child-friendly amenities.",
        maxGuests: 4,
        bedType: "2 Double",
        size: 600,
        price: 18000,
        amenities: ["Garden View", "Connecting Rooms", "Kids Corner", "Mini Bar"],
        available: 3,
      },
    ],
    policies: {
      cancellation: "Free cancellation up to 48 hours before check-in. After that, the first night will be charged.",
      children: "Children of all ages are welcome. Children under 5 stay free using existing beds.",
      pets: "Pets are not allowed.",
      smoking: "Smoking is not allowed inside the property.",
    },
    coordinates: { lat: 21.3548, lng: 92.0198 },
  },
  {
    id: "sunset-bay-boutique",
    name: "Sunset Bay Boutique",
    location: "Kolatoli, Cox's Bazar",
    description:
      "An intimate boutique hotel designed for couples and honeymooners. Features a rooftop spa with stunning sunset views, private beach cabanas, and curated dining experiences that celebrate local flavors.",
    price: 8500,
    rating: 4.5,
    reviewCount: 218,
    image: hotel2,
    gallery: [hotel2, hotel6, hotel4],
    tags: ["Couple", "Sea View", "Spa"],
    amenities: [
      "Free WiFi",
      "Rooftop Spa",
      "Restaurant",
      "Room Service",
      "Beach Cabana",
      "Air Conditioning",
      "Laundry",
      "Airport Transfer",
    ],
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    rooms: [
      {
        id: "sbb-standard",
        name: "Standard Double",
        description: "Cozy room with modern decor and city views.",
        maxGuests: 2,
        bedType: "Queen",
        size: 350,
        price: 8500,
        amenities: ["City View", "AC", "Tea/Coffee Maker"],
        available: 8,
      },
      {
        id: "sbb-deluxe",
        name: "Deluxe Sea View",
        description: "Elegant room with sea view and private balcony.",
        maxGuests: 2,
        bedType: "King",
        size: 420,
        price: 13000,
        amenities: ["Sea View", "Balcony", "Mini Bar", "Bathrobe"],
        available: 4,
      },
      {
        id: "sbb-honeymoon",
        name: "Honeymoon Suite",
        description: "Romantic suite with rose petal turndown, champagne, and ocean panorama.",
        maxGuests: 2,
        bedType: "King",
        size: 550,
        price: 20000,
        amenities: ["Panoramic View", "Jacuzzi", "Champagne", "Private Dining"],
        available: 1,
      },
    ],
    policies: {
      cancellation: "Free cancellation up to 24 hours before check-in.",
      children: "This is an adults-only property. Guests must be 18 or older.",
      pets: "Pets are not allowed.",
      smoking: "Designated smoking areas available.",
    },
    coordinates: { lat: 21.4272, lng: 91.9712 },
  },
  {
    id: "azure-beach-club",
    name: "The Azure Beach Club",
    location: "Marine Drive, Cox's Bazar",
    description:
      "The ultimate luxury beach club and resort on Marine Drive. Features a stunning infinity pool, beach bar, live DJ nights, and premium suites with floor-to-ceiling ocean views. Where luxury meets nightlife.",
    price: 18000,
    rating: 4.9,
    reviewCount: 156,
    image: hotel3,
    gallery: [hotel3, hotel5, hotel6],
    tags: ["Luxury", "Pool", "Party"],
    amenities: [
      "Free WiFi",
      "Infinity Pool",
      "Beach Bar",
      "Live Entertainment",
      "Restaurant",
      "Room Service",
      "Gym",
      "Spa",
      "Parking",
      "Concierge",
      "Beach Access",
      "Water Sports",
    ],
    checkInTime: "2:00 PM",
    checkOutTime: "12:00 PM",
    rooms: [
      {
        id: "abc-superior",
        name: "Superior Room",
        description: "Stylish room with modern furnishings and pool view.",
        maxGuests: 2,
        bedType: "King",
        size: 400,
        price: 18000,
        amenities: ["Pool View", "Balcony", "Mini Bar", "Smart TV"],
        available: 6,
      },
      {
        id: "abc-executive",
        name: "Executive Suite",
        description: "Spacious suite with living area, work desk, and ocean view.",
        maxGuests: 3,
        bedType: "King + Daybed",
        size: 700,
        price: 30000,
        amenities: ["Ocean View", "Living Room", "Work Desk", "Nespresso", "Rain Shower"],
        available: 3,
      },
      {
        id: "abc-penthouse",
        name: "Penthouse Villa",
        description: "The ultimate stay — private rooftop terrace, plunge pool, and butler service.",
        maxGuests: 4,
        bedType: "King + 2 Single",
        size: 1200,
        price: 55000,
        amenities: ["Rooftop Terrace", "Private Pool", "Butler Service", "Kitchen", "Dining Room"],
        available: 1,
      },
    ],
    policies: {
      cancellation: "Free cancellation up to 72 hours before check-in. 50% charge for late cancellations.",
      children: "Children above 12 welcome. Babysitting available on request.",
      pets: "Small pets allowed with prior approval (additional charge applies).",
      smoking: "Smoking only in designated outdoor areas.",
    },
    coordinates: { lat: 21.4350, lng: 91.9680 },
  },
  {
    id: "coral-reef-inn",
    name: "Coral Reef Inn",
    location: "Laboni Beach, Cox's Bazar",
    description:
      "A charming budget-friendly inn right by Laboni Beach. Clean, comfortable rooms with all essentials, friendly staff, and unbeatable proximity to the beach and local markets.",
    price: 4500,
    rating: 4.2,
    reviewCount: 489,
    image: hotel4,
    gallery: [hotel4, hotel1, hotel2],
    tags: ["Budget", "Beach", "Central"],
    amenities: [
      "Free WiFi",
      "Restaurant",
      "Air Conditioning",
      "Parking",
      "24/7 Front Desk",
      "Luggage Storage",
    ],
    checkInTime: "1:00 PM",
    checkOutTime: "11:00 AM",
    rooms: [
      {
        id: "cri-standard",
        name: "Standard Room",
        description: "Clean and comfortable room with essential amenities.",
        maxGuests: 2,
        bedType: "Double",
        size: 280,
        price: 4500,
        amenities: ["AC", "TV", "Attached Bath"],
        available: 12,
      },
      {
        id: "cri-deluxe",
        name: "Deluxe Room",
        description: "Upgraded room with better views and extra space.",
        maxGuests: 2,
        bedType: "Queen",
        size: 350,
        price: 6500,
        amenities: ["Beach View", "AC", "TV", "Mini Fridge"],
        available: 6,
      },
    ],
    policies: {
      cancellation: "Free cancellation up to 24 hours before check-in.",
      children: "Children of all ages welcome. Extra bed available for ৳1000/night.",
      pets: "Pets are not allowed.",
      smoking: "Non-smoking property.",
    },
    coordinates: { lat: 21.4400, lng: 91.9700 },
  },
  {
    id: "palm-vista-resort",
    name: "Palm Vista Resort",
    location: "Himchari, Cox's Bazar",
    description:
      "Nestled in the lush green hills of Himchari, this eco-resort offers a perfect blend of nature and comfort. Enjoy waterfall treks, bird watching, and unwind in bamboo-styled cottages.",
    price: 9500,
    rating: 4.6,
    reviewCount: 201,
    image: hotel5,
    gallery: [hotel5, hotel3, hotel6],
    tags: ["Eco", "Nature", "Hillside"],
    amenities: [
      "Free WiFi",
      "Pool",
      "Nature Trails",
      "Restaurant",
      "Bonfire",
      "Bird Watching",
      "Yoga",
      "Parking",
    ],
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM",
    rooms: [
      {
        id: "pvr-cottage",
        name: "Garden Cottage",
        description: "Cozy bamboo-styled cottage surrounded by tropical gardens.",
        maxGuests: 2,
        bedType: "King",
        size: 400,
        price: 9500,
        amenities: ["Garden View", "Private Patio", "AC", "Hammock"],
        available: 4,
      },
      {
        id: "pvr-treehouse",
        name: "Treehouse Suite",
        description: "Elevated treehouse-style room with panoramic hill and sea views.",
        maxGuests: 2,
        bedType: "Queen",
        size: 350,
        price: 15000,
        amenities: ["Panoramic View", "Open Deck", "Outdoor Shower", "Mini Bar"],
        available: 2,
      },
    ],
    policies: {
      cancellation: "Free cancellation up to 48 hours before check-in.",
      children: "Children welcome. Nature guide available for families.",
      pets: "Pets allowed in garden cottages only.",
      smoking: "Smoking only in designated areas.",
    },
    coordinates: { lat: 21.3800, lng: 92.0100 },
  },
  {
    id: "neon-nights-hotel",
    name: "Neon Nights Hotel",
    location: "Kolatoli, Cox's Bazar",
    description:
      "The trendiest hotel on the beach strip. Vibrant neon-lit interiors, a rooftop lounge with live music, and modern rooms designed for the social media age. Perfect for young travelers and groups.",
    price: 7000,
    rating: 4.4,
    reviewCount: 312,
    image: hotel6,
    gallery: [hotel6, hotel2, hotel3],
    tags: ["Trendy", "Nightlife", "Group"],
    amenities: [
      "Free WiFi",
      "Rooftop Lounge",
      "Live Music",
      "Restaurant",
      "Room Service",
      "Game Room",
      "Air Conditioning",
      "Parking",
    ],
    checkInTime: "3:00 PM",
    checkOutTime: "12:00 PM",
    rooms: [
      {
        id: "nnh-standard",
        name: "Neon Standard",
        description: "Vibrant room with neon accent lighting and modern decor.",
        maxGuests: 2,
        bedType: "Queen",
        size: 320,
        price: 7000,
        amenities: ["LED Lighting", "Smart TV", "AC", "USB Charging"],
        available: 10,
      },
      {
        id: "nnh-group",
        name: "Group Suite",
        description: "Spacious suite with multiple beds, perfect for friend groups.",
        maxGuests: 6,
        bedType: "3 Double",
        size: 800,
        price: 16000,
        amenities: ["LED Lighting", "Lounge Area", "Gaming Console", "Mini Kitchen"],
        available: 2,
      },
    ],
    policies: {
      cancellation: "Free cancellation up to 24 hours before check-in.",
      children: "Children above 10 welcome with adult supervision.",
      pets: "Pets are not allowed.",
      smoking: "Smoking allowed on rooftop terrace only.",
    },
    coordinates: { lat: 21.4280, lng: 91.9720 },
  },
];

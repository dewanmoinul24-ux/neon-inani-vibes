export interface Vehicle {
  id: string;
  name: string;
  nameLocal?: string;
  category: string;
  description: string;
  seats: number;
  pricePerHour: number;
  pricePerDay: number;
  bookingAdvance: number; // percentage
  driverIncluded: boolean;
  fuelIncluded: boolean;
  requiresLicense: boolean;
  features: string[];
  notes: string[];
  image: string;
  accentColor: "pink" | "blue" | "cyan" | "purple" | "orange";
}

export const vehicles: Vehicle[] = [
  {
    id: "sedan",
    name: "Sedan Car",
    category: "Sedan",
    description:
      "Comfortable air-conditioned sedan perfect for family trips along Marine Drive and city tours. Experienced local driver included.",
    seats: 4,
    pricePerHour: 600,
    pricePerDay: 4500,
    bookingAdvance: 50,
    driverIncluded: true,
    fuelIncluded: true,
    requiresLicense: false,
    features: ["AC", "Music System", "GPS Navigation", "Experienced Driver"],
    notes: ["Fuel included in price", "Driver tip not included"],
    image: "",
    accentColor: "cyan",
  },
  {
    id: "jeep",
    name: "Chander Gari (Jeep)",
    nameLocal: "চান্দের গাড়ি",
    category: "JEEP",
    description:
      "The iconic open-top beach jeep of Cox's Bazar! Best for Marine Drive sunset rides and off-road beach adventures.",
    seats: 8,
    pricePerHour: 1000,
    pricePerDay: 7000,
    bookingAdvance: 50,
    driverIncluded: true,
    fuelIncluded: true,
    requiresLicense: false,
    features: ["Open-Top", "Beach Ready", "Seats 8", "Experienced Driver"],
    notes: ["Fuel included in price", "Best for group tours"],
    image: "",
    accentColor: "pink",
  },
  {
    id: "auto",
    name: "Auto Rickshaw",
    category: "Auto",
    description:
      "Classic three-wheeler for quick city hops and short-distance travel. The most popular local transport in Cox's Bazar.",
    seats: 3,
    pricePerHour: 250,
    pricePerDay: 1800,
    bookingAdvance: 50,
    driverIncluded: true,
    fuelIncluded: true,
    requiresLicense: false,
    features: ["Compact", "City-Friendly", "Quick Rides", "Local Driver"],
    notes: ["Fuel included in price", "Ideal for short trips"],
    image: "",
    accentColor: "purple",
  },
  {
    id: "cng",
    name: "CNG (Auto)",
    category: "CNG",
    description:
      "Eco-friendly compressed natural gas auto for affordable and comfortable rides around the city and nearby attractions.",
    seats: 3,
    pricePerHour: 300,
    pricePerDay: 2200,
    bookingAdvance: 50,
    driverIncluded: true,
    fuelIncluded: true,
    requiresLicense: false,
    features: ["Eco-Friendly", "Metered", "Comfortable", "City Coverage"],
    notes: ["CNG fuel included", "Green transport option"],
    image: "",
    accentColor: "blue",
  },
  {
    id: "scooter",
    name: "Scooter / Motorcycle",
    category: "Scooter",
    description:
      "Self-drive scooter or motorcycle for the adventurous explorer. Perfect for solo rides along Marine Drive at your own pace.",
    seats: 2,
    pricePerHour: 200,
    pricePerDay: 1200,
    bookingAdvance: 50,
    driverIncluded: false,
    fuelIncluded: false,
    requiresLicense: true,
    features: ["Self-Drive", "Fuel Efficient", "Helmet Provided", "Flexible"],
    notes: [
      "Valid driving license required",
      "Oil/fuel NOT included in booking",
      "Helmet & safety gear provided",
      "Security deposit may apply",
    ],
    image: "",
    accentColor: "orange",
  },
];

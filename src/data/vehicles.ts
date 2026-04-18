import driver1 from "@/assets/driver-1.jpg";
import driver2 from "@/assets/driver-2.jpg";
import driver3 from "@/assets/driver-3.jpg";
import driver4 from "@/assets/driver-4.jpg";
import sedan1 from "@/assets/vehicle-sedan-1.jpg";
import sedan2 from "@/assets/vehicle-sedan-2.jpg";
import jeep1 from "@/assets/vehicle-jeep-1.jpg";
import jeep2 from "@/assets/vehicle-jeep-2.jpg";
import auto1 from "@/assets/vehicle-auto-1.jpg";
import cng1 from "@/assets/vehicle-cng-1.jpg";
import scooter1 from "@/assets/vehicle-scooter-1.jpg";
import scooter2 from "@/assets/vehicle-scooter-2.jpg";

export interface Driver {
  name: string;
  photo: string;
  experienceYears: number;
  languages: string[];
  rating: number;
  phone: string;
}

export interface VehicleUnit {
  id: string;
  modelName: string;
  registrationNo: string;
  year: number;
  color: string;
  image: string;
  /** Driver assigned to this unit. Null for self-drive (scooter). */
  driver?: Driver;
  /** For self-drive units: owner name and pickup location. */
  ownerName?: string;
  pickupLocation?: string;
}

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
  units: VehicleUnit[];
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
    units: [
      {
        id: "sedan-01",
        modelName: "Toyota Allion 2019",
        registrationNo: "Cox-Ka-12-3401",
        year: 2019,
        color: "Pearl White",
        image: sedan1,
        driver: {
          name: "Md. Rakib Hossain",
          photo: driver1,
          experienceYears: 7,
          languages: ["Bangla", "English", "Hindi"],
          rating: 4.9,
          phone: "+880 1712-345 678",
        },
      },
      {
        id: "sedan-02",
        modelName: "Toyota Premio 2020",
        registrationNo: "Cox-Ka-14-7820",
        year: 2020,
        color: "Silver Metallic",
        image: sedan2,
        driver: {
          name: "Abdul Karim",
          photo: driver2,
          experienceYears: 12,
          languages: ["Bangla", "English"],
          rating: 4.8,
          phone: "+880 1813-456 789",
        },
      },
    ],
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
    units: [
      {
        id: "jeep-01",
        modelName: "Mahindra Open-Top Jeep",
        registrationNo: "Cox-Tha-11-2210",
        year: 2018,
        color: "Sunset Pink",
        image: jeep1,
        driver: {
          name: "Jamal Uddin",
          photo: driver3,
          experienceYears: 10,
          languages: ["Bangla", "Chittagonian"],
          rating: 4.9,
          phone: "+880 1914-567 890",
        },
      },
      {
        id: "jeep-02",
        modelName: "Land Rover Defender (Custom)",
        registrationNo: "Cox-Tha-12-5544",
        year: 2017,
        color: "Coastal Black",
        image: jeep2,
        driver: {
          name: "Salim Ahmed",
          photo: driver4,
          experienceYears: 15,
          languages: ["Bangla", "English", "Chittagonian"],
          rating: 5.0,
          phone: "+880 1612-678 901",
        },
      },
    ],
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
    units: [
      {
        id: "auto-01",
        modelName: "Bajaj Auto Rickshaw",
        registrationNo: "Cox-Tha-08-1102",
        year: 2021,
        color: "Green & Yellow",
        image: auto1,
        driver: {
          name: "Nurul Islam",
          photo: driver2,
          experienceYears: 6,
          languages: ["Bangla", "Chittagonian"],
          rating: 4.7,
          phone: "+880 1715-789 012",
        },
      },
    ],
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
    units: [
      {
        id: "cng-01",
        modelName: "Bajaj RE CNG",
        registrationNo: "Cox-Tha-09-3380",
        year: 2022,
        color: "Forest Green",
        image: cng1,
        driver: {
          name: "Mohammad Faruk",
          photo: driver1,
          experienceYears: 5,
          languages: ["Bangla", "Chittagonian"],
          rating: 4.8,
          phone: "+880 1816-890 123",
        },
      },
    ],
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
    units: [
      {
        id: "scooter-01",
        modelName: "Yamaha Aerox 155",
        registrationNo: "Cox-La-22-1145",
        year: 2023,
        color: "Sunset Red",
        image: scooter1,
        ownerName: "Ridwan Karim",
        pickupLocation: "Kalatali Beach Point, Cox's Bazar",
      },
      {
        id: "scooter-02",
        modelName: "Honda CBR 150R",
        registrationNo: "Cox-La-21-8870",
        year: 2022,
        color: "Midnight Black",
        image: scooter2,
        ownerName: "Tanvir Hassan",
        pickupLocation: "Sugandha Beach Point, Cox's Bazar",
      },
    ],
  },
];

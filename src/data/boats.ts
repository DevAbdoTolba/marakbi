export interface BoatReview {
  id: number;
  reviewer: string;
  date: string;
  rating: number;
  comment: string;
  images: string[];
}

export interface BoatStat {
  label: string;
  value: string;
}

export interface BoatPricing {
  perHour: number;
  perDay: number;
  perWeek: number;
  serviceFee: number;
  totalExample: number;
  durationExampleLabel: string;
}

export interface BoatTripDetails {
  title: string;
  description: string;
  stats: BoatStat[];
}

export interface BoatDetails {
  owner: {
    name: string;
    role: string;
    experience: string;
    bio: string;
    avatar: string;
    responseTime: string;
    responseRate: string;
    languages: string[];
  };
  overview: string;
  recommendedLabel: string;
  locationLabel: string;
  gallery: string[];
  galleryExtraCount: number;
  pricing: BoatPricing;
  specifications: BoatStat[];
  tripDetails: BoatTripDetails;
  goodToKnow: string[];
  cancellationPolicy: {
    cancellation: string;
    change: string;
  };
  pricingOptions: BoatStat[];
  reviews: BoatReview[];
  ratingBreakdown: { stars: number; count: number }[];
}

export interface BoatDataItem {
  id: number;
  name: string;
  tripTitle: string;
  price_per_hour: number;
  price_per_day: number;
  price_per_week: number;
  max_seats: number;
  max_seats_stay: number;
  images: string[];
  cities: string[];
  location: string;
  rating: number;
  reviewsCount: number;
  status?: string;
  details: BoatDetails;
}

const baseDetails: BoatDetails = {
  owner: {
    name: "Ali Hassan",
    role: "Boat Owner",
    experience: "15 Years of Experience",
    bio: "Captain Ali Hassan is a certified Skipper with extensive knowledge of local waters. He is passionate about sailing and committed to providing a safe and unforgettable experience for all guests. He's also a great storyteller.",
    avatar: "/icons/character-3.svg",
    responseTime: "Within a day",
    responseRate: "More than 95%",
    languages: ["Arabic", "English"],
  },
  overview:
    "Embark on a luxurious journey aboard our newly renovated private yacht in Sharm El Sheikh. With a capacity of up to 25 guests, the highest-rated boating rental company since 1990, promises an unforgettable experience on the Red Sea. Let our expert crew pamper you while you enjoy the ultimate luxury and create cherished memories with your loved ones.",
  recommendedLabel: "Recommended by us",
  locationLabel: "Hurghada, Egypt",
  gallery: [
    "/images/Rectangle 3463853.webp",
    "/images/Rectangle 3463855.webp",
    "/images/Rectangle 3463856.webp",
    "/images/Rectangle 3463855.webp",
    "/images/Rectangle 3463856.webp",
  ],
  galleryExtraCount: 20,
  pricing: {
    perHour: 650,
    perDay: 4800,
    perWeek: 32000,
    serviceFee: 480,
    totalExample: 5280,
    durationExampleLabel: "650 × 6 days",
  },
  specifications: [
    { label: "Length", value: "45 ft" },
    { label: "Engine Type", value: "Twin Diesel" },
    { label: "Maximum Speed", value: "30 Knots" },
    { label: "Year of Manufacture", value: "2020" },
    {
      label: "Safety Equipment",
      value: "Life Jacket for all passengers, First Aid Kit, GPS, Radio Communication",
    },
    {
      label: "Onboard Amenities",
      value: "Toilet/Restroom, Shade Canopy, Sundeck Area, Mini-Bar/Cooler",
    },
    {
      label: "Music/Entertainment",
      value: "Bluetooth Speaker System, Stereo",
    },
    { label: "Power Supply", value: "USB Charging Ports, 220V Outlet" },
    { label: "Required Crew", value: "Number of Captains/Sailors included" },
    { label: "Owner/Operator Name", value: "Ali Hassan" },
  ],
  tripDetails: {
    title: "Nubian Village",
    description:
      "Embark on a luxurious journey aboard our newly renovated private yacht in Sharm El Sheikh. With a capacity of up to 25 guests, the highest-rated boating rental company since 1990, promises an unforgettable experience on the Red Sea. Let our expert crew pamper you while you enjoy the ultimate luxury and create cherished memories with your loved ones.",
    stats: [
      { label: "Duration", value: "4 h" },
      { label: "Price", value: "650 EGP/h" },
      { label: "Departure Location", value: "Hurghada, Egypt" },
      { label: "Destination / Route", value: "Nubian Village" },
      { label: "Technology", value: "360° Video" },
      { label: "Key Stops & Activities", value: "Small island" },
      { label: "Inclusions", value: "Hibiscus / Water" },
      { label: "Exclusions", value: "Food, pick-up" },
      { label: "Private vs Shared Option", value: "Available" },
      { label: "Languages", value: "Arabic & English" },
    ],
  },
  goodToKnow: [
    "No smoking allowed inside the cabin.",
    "Pets are not permitted on board.",
    "A safety briefing will be conducted before departure.",
    "Please follow the captain's instructions at all times.",
    "Life jackets are provided for guests.",
    "Payment accepted (Local currency, USD, Euros, visa, MasterCard and PayPal).",
    "Confirmation will be received within 48 hours at time of booking.",
    "Infants must sit on laps.",
  ],
  cancellationPolicy: {
    cancellation:
      "90% refund up to 48 hours before arrival, excluding service fees and commission.",
    change: "Free of charge",
  },
  pricingOptions: [
    { label: "Per hour rental.", value: "from 450 EGP" },
    { label: "Per day rental.", value: "from 1500 EGP" },
    { label: "Per destination.", value: "Price vary according to the destination" },
  ],
  reviews: [
    {
      id: 1,
      reviewer: "Emily R.",
      date: "Nov 13, 2024",
      rating: 4,
      comment:
        "Great day of sailing! The boat was in immaculate condition for its age and sails well. Alessio is very accommodating and helps with any questions — even with mooring and unmooring. I'd go back anytime, especially since the panorama is breathtaking for an inland sailing trip.",
      images: [
        "/images/Rectangle 3463855.webp",
        "/images/Rectangle 3463856.webp",
        "/images/Rectangle 3463853.webp",
        "/images/Rectangle 3463856.webp",
      ],
    },
    {
      id: 2,
      reviewer: "Emily R.",
      date: "Nov 13, 2024",
      rating: 4,
      comment:
        "Great day of sailing! The boat was in immaculate condition for its age and sails well. Alessio is very accommodating and helps with any questions — even with mooring and unmooring. I'd go back anytime, especially since the panorama is breathtaking for an inland sailing trip.",
      images: [
        "/images/Rectangle 3463856.webp",
        "/images/Rectangle 3463855.webp",
        "/images/Rectangle 3463853.webp",
        "/images/Rectangle 3463856.webp",
      ],
    },
  ],
  ratingBreakdown: [
    { stars: 5, count: 488 },
    { stars: 4, count: 14 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ],
};

const cloneStats = (stats: BoatStat[]) => stats.map((item) => ({ ...item }));
const cloneReviews = (reviews: BoatReview[]) =>
  reviews.map((review) => ({ ...review, images: [...review.images] }));

const createDetails = (overrides: Partial<BoatDetails> = {}): BoatDetails => ({
  ...baseDetails,
  ...overrides,
  owner: overrides.owner
    ? {
        ...baseDetails.owner,
        ...overrides.owner,
        languages: overrides.owner.languages
          ? [...overrides.owner.languages]
          : [...baseDetails.owner.languages],
      }
    : { ...baseDetails.owner, languages: [...baseDetails.owner.languages] },
  gallery: overrides.gallery ? [...overrides.gallery] : [...baseDetails.gallery],
  pricing: overrides.pricing
    ? { ...baseDetails.pricing, ...overrides.pricing }
    : { ...baseDetails.pricing },
  specifications: overrides.specifications
    ? overrides.specifications.map((spec) => ({ ...spec }))
    : cloneStats(baseDetails.specifications),
  tripDetails: overrides.tripDetails
    ? {
        ...baseDetails.tripDetails,
        ...overrides.tripDetails,
        stats: overrides.tripDetails.stats
          ? overrides.tripDetails.stats.map((stat) => ({ ...stat }))
          : cloneStats(baseDetails.tripDetails.stats),
      }
    : {
        ...baseDetails.tripDetails,
        stats: cloneStats(baseDetails.tripDetails.stats),
      },
  goodToKnow: overrides.goodToKnow
    ? [...overrides.goodToKnow]
    : [...baseDetails.goodToKnow],
  cancellationPolicy: overrides.cancellationPolicy
    ? { ...baseDetails.cancellationPolicy, ...overrides.cancellationPolicy }
    : { ...baseDetails.cancellationPolicy },
  pricingOptions: overrides.pricingOptions
    ? overrides.pricingOptions.map((option) => ({ ...option }))
    : cloneStats(baseDetails.pricingOptions),
  reviews: overrides.reviews ? cloneReviews(overrides.reviews) : cloneReviews(baseDetails.reviews),
  ratingBreakdown: overrides.ratingBreakdown
    ? overrides.ratingBreakdown.map((item) => ({ ...item }))
    : baseDetails.ratingBreakdown.map((item) => ({ ...item })),
});

export const boatFleetData: BoatDataItem[] = [
  {
    id: 1,
    name: "Luxury Yacht",
    tripTitle: "4h Sailing Adventure – Cavtat Coastline by Boat",
    price_per_hour: 650,
    price_per_day: 4800,
    price_per_week: 32000,
    max_seats: 8,
    max_seats_stay: 4,
    images: ["/images/Rectangle 3463853.webp"],
    cities: ["Hurghada"],
    location: "Hurghada - Egypt",
    rating: 4.8,
    reviewsCount: 502,
    status: "Available",
    details: createDetails({ locationLabel: "Hurghada, Egypt" }),
  },
  {
    id: 2,
    name: "Traditional Felucca",
    tripTitle: "Sunset Felucca Cruise on the Nile",
    price_per_hour: 220,
    price_per_day: 1600,
    price_per_week: 9000,
    max_seats: 6,
    max_seats_stay: 2,
    images: ["/images/Rectangle 3463855.webp"],
    cities: ["Aswan"],
    location: "Aswan - Egypt",
    rating: 4.5,
    reviewsCount: 188,
    status: "Available",
    details: createDetails({
      owner: {
        name: "Sara Naguib",
        role: "Boat Owner",
        experience: "12 Years of Experience",
        bio: baseDetails.owner.bio,
        avatar: "/icons/character-3.svg",
        responseTime: baseDetails.owner.responseTime,
        responseRate: baseDetails.owner.responseRate,
        languages: ["Arabic", "English", "French"],
      },
      locationLabel: "Aswan, Egypt",
      tripDetails: {
        title: "Nile Sunset Route",
        description:
          "Sail leisurely along the Nile during golden hour, soaking in the warm breeze, music, and traditional Nubian storytelling aboard an authentic felucca.",
        stats: [
          { label: "Duration", value: "2.5 h" },
          { label: "Price", value: "220 EGP/h" },
          { label: "Departure Location", value: "Aswan Corniche" },
          { label: "Destination / Route", value: "Elephantine Island" },
          { label: "Technology", value: "Guided audio" },
          { label: "Key Stops & Activities", value: "Sunset photography, Tea tasting" },
          { label: "Inclusions", value: "Tea, Fresh juice" },
          { label: "Exclusions", value: "Transportation" },
          { label: "Private vs Shared Option", value: "Private" },
          { label: "Languages", value: "Arabic & English" },
        ],
      },
    }),
  },
  {
    id: 3,
    name: "Speed Boat",
    tripTitle: "High-Speed Red Sea Escape",
    price_per_hour: 320,
    price_per_day: 2200,
    price_per_week: 12600,
    max_seats: 4,
    max_seats_stay: 2,
    images: ["/images/Rectangle 3463856.webp"],
    cities: ["Hurghada"],
    location: "Hurghada - Egypt",
    rating: 4.7,
    reviewsCount: 231,
    status: "Available",
    details: createDetails({
      owner: {
        name: "Youssef El-Sayed",
        role: "Skipper",
        experience: "9 Years of Experience",
        bio: baseDetails.owner.bio,
        avatar: "/icons/character-3.svg",
        responseTime: baseDetails.owner.responseTime,
        responseRate: baseDetails.owner.responseRate,
        languages: ["Arabic", "English", "German"],
      },
      locationLabel: "Hurghada, Egypt",
      tripDetails: {
        title: "Red Sea Sprint",
        description:
          "Dash across the Red Sea in a premium speed boat, stopping at hidden lagoons for snorkeling and unforgettable coastal views.",
        stats: [
          { label: "Duration", value: "3 h" },
          { label: "Price", value: "320 EGP/h" },
          { label: "Departure Location", value: "Hurghada Marina" },
          { label: "Destination / Route", value: "Giftun Island" },
          { label: "Technology", value: "Action camera on board" },
          { label: "Key Stops & Activities", value: "Snorkeling, Sandbar picnic" },
          { label: "Inclusions", value: "Snorkeling gear, Soft drinks" },
          { label: "Exclusions", value: "Lunch" },
          { label: "Private vs Shared Option", value: "Private" },
          { label: "Languages", value: "Arabic & English" },
        ],
      },
    }),
  },
  {
    id: 4,
    name: "Fishing Boat",
    tripTitle: "Early Morning Fishing Charter",
    price_per_hour: 180,
    price_per_day: 1200,
    price_per_week: 6800,
    max_seats: 4,
    max_seats_stay: 2,
    images: ["/images/Rectangle 3463853.webp"],
    cities: ["Luxor"],
    location: "Luxor - Egypt",
    rating: 4.2,
    reviewsCount: 142,
    status: "Available",
    details: createDetails({
      owner: {
        name: "Mahmoud Farag",
        role: "Captain",
        experience: "20 Years of Experience",
        bio: baseDetails.owner.bio,
        avatar: "/icons/character-3.svg",
        responseTime: baseDetails.owner.responseTime,
        responseRate: baseDetails.owner.responseRate,
        languages: ["Arabic"]
      },
      locationLabel: "Luxor, Egypt",
      tripDetails: {
        title: "Nile Fishing Expedition",
        description:
          "Set out before sunrise to catch Nile perch and tilapia with a seasoned local crew, complete with fresh breakfast on board.",
        stats: [
          { label: "Duration", value: "5 h" },
          { label: "Price", value: "180 EGP/h" },
          { label: "Departure Location", value: "Luxor Corniche" },
          { label: "Destination / Route", value: "Banana Island" },
          { label: "Technology", value: "Fish finder sonar" },
          { label: "Key Stops & Activities", value: "Riverbank breakfast" },
          { label: "Inclusions", value: "Fishing gear, Breakfast" },
          { label: "Exclusions", value: "Fishing permits" },
          { label: "Private vs Shared Option", value: "Shared" },
          { label: "Languages", value: "Arabic" },
        ],
      },
    }),
  },
  {
    id: 5,
    name: "Party Boat",
    tripTitle: "Nile Night Party Experience",
    price_per_hour: 420,
    price_per_day: 3000,
    price_per_week: 17800,
    max_seats: 12,
    max_seats_stay: 6,
    images: ["/images/Rectangle 3463855.webp"],
    cities: ["Cairo"],
    location: "Cairo - Egypt",
    rating: 4.9,
    reviewsCount: 415,
    status: "Available",
    details: createDetails({
      owner: {
        name: "Nourhan Yasser",
        role: "Event Host",
        experience: "7 Years of Experience",
        bio: baseDetails.owner.bio,
        avatar: "/icons/character-3.svg",
        responseTime: baseDetails.owner.responseTime,
        responseRate: baseDetails.owner.responseRate,
        languages: ["Arabic", "English"],
      },
      locationLabel: "Cairo, Egypt",
      tripDetails: {
        title: "Cairo Nights Cruise",
        description:
          "Celebrate under the Cairo skyline with live DJs, catered bites, and a dance floor on the Nile's most vibrant party boat.",
        stats: [
          { label: "Duration", value: "4 h" },
          { label: "Price", value: "420 EGP/h" },
          { label: "Departure Location", value: "Zamalek Pier" },
          { label: "Destination / Route", value: "Downtown Bridges" },
          { label: "Technology", value: "Pro DJ setup" },
          { label: "Key Stops & Activities", value: "Light show, Live DJ" },
          { label: "Inclusions", value: "Soft drinks, Snacks" },
          { label: "Exclusions", value: "Premium beverages" },
          { label: "Private vs Shared Option", value: "Private" },
          { label: "Languages", value: "Arabic & English" },
        ],
      },
    }),
  },
  {
    id: 6,
    name: "Family Boat",
    tripTitle: "Family Day on the Alexandria Coast",
    price_per_hour: 260,
    price_per_day: 1800,
    price_per_week: 10800,
    max_seats: 6,
    max_seats_stay: 3,
    images: ["/images/Rectangle 3463856.webp"],
    cities: ["Alexandria"],
    location: "Alexandria - Egypt",
    rating: 4.6,
    reviewsCount: 228,
    status: "Available",
    details: createDetails({
      owner: {
        name: "Layla Mostafa",
        role: "Boat Owner",
        experience: "11 Years of Experience",
        bio: baseDetails.owner.bio,
        avatar: "/icons/character-3.svg",
        responseTime: baseDetails.owner.responseTime,
        responseRate: baseDetails.owner.responseRate,
        languages: ["Arabic", "English"],
      },
      locationLabel: "Alexandria, Egypt",
      tripDetails: {
        title: "Mediterranean Family Escape",
        description:
          "Cruise Alexandria's coastline with kid-friendly amenities, snorkeling stops, and freshly caught seafood lunch.",
        stats: [
          { label: "Duration", value: "6 h" },
          { label: "Price", value: "260 EGP/h" },
          { label: "Departure Location", value: "Stanley Bridge" },
          { label: "Destination / Route", value: "Montaza Gardens" },
          { label: "Technology", value: "Children's VR corner" },
          { label: "Key Stops & Activities", value: "Snorkeling, Beach games" },
          { label: "Inclusions", value: "Lunch, Kids activities" },
          { label: "Exclusions", value: "Hotel transfer" },
          { label: "Private vs Shared Option", value: "Private" },
          { label: "Languages", value: "Arabic & English" },
        ],
      },
    }),
  },
];

export const getBoatSummaries = () => boatFleetData;

export const getBoatById = (id: string | number) =>
  boatFleetData.find((boat) => boat.id === Number(id));



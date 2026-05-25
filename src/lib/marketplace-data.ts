export type Product = {
  id: string;
  name: string;
  price: string;
  description: string;
  tags: string[];
  payment: "Fygaro link" | "Deposit accepted" | "WhatsApp quote";
  featured?: boolean;
  availability?: boolean;
  image?: string;
};

export type Storefront = {
  slug: string;
  name: string;
  initials: string;
  category: string;
  categories?: string[];
  location: string;
  address: string;
  description: string;
  whatsapp: string;
  rating: number;
  reviews: number;
  verifiedTier: "Tier 1" | "Tier 2";
  boosted: boolean;
  hours: string[];
  tags: string[];
  deals: string[];
  products: Product[];
  phone?: string;
  email?: string;
  website?: string;
  socials?: { facebook?: string; instagram?: string; twitter?: string };
  payment_methods?: string[];
};

export const categories = [
  "All",
  "Food & Drink",
  "Retail",
  "Hardware",
  "Health & Beauty",
  "Services",
  "Home Business",
];

export const storefronts: Storefront[] = [
  {
    slug: "savannah-doubles-co",
    name: "Savannah Doubles Co.",
    initials: "SD",
    category: "Food & Drink",
    location: "Port of Spain",
    address: "Queen's Park Savannah, Port of Spain",
    description:
      "Morning doubles, pies, and fresh juice with quick WhatsApp ordering for office pickups.",
    whatsapp: "18685551234",
    rating: 4.9,
    reviews: 186,
    verifiedTier: "Tier 2",
    boosted: true,
    hours: ["Mon-Fri 6:00 AM - 1:00 PM", "Sat 6:30 AM - 12:00 PM", "Sun closed"],
    tags: ["doubles", "breakfast", "vegetarian", "deals", "port of spain"],
    deals: ["Breakfast combo from TT$28", "Office tray pre-orders"],
    products: [
      {
        id: "classic-doubles",
        name: "Classic Doubles",
        price: "TT$8",
        description: "Two bara with channa, cucumber, pepper, and tamarind.",
        tags: ["doubles", "breakfast"],
        payment: "Fygaro link",
        featured: true,
      },
      {
        id: "aloo-pie",
        name: "Aloo Pie",
        price: "TT$12",
        description: "Fresh fried aloo pie with channa and sauces.",
        tags: ["pie", "snack"],
        payment: "Fygaro link",
      },
      {
        id: "office-tray",
        name: "Office Tray",
        price: "From TT$120",
        description: "Bulk doubles tray for meetings and office breakfasts.",
        tags: ["catering", "preorder"],
        payment: "Deposit accepted",
      },
    ],
  },
  {
    slug: "chaguanas-mini-mart",
    name: "Chaguanas Mini Mart",
    initials: "CM",
    category: "Retail",
    location: "Chaguanas",
    address: "Main Road, Chaguanas",
    description:
      "Neighbourhood essentials, snacks, household goods, and WhatsApp pickup lists.",
    whatsapp: "18685559876",
    rating: 4.7,
    reviews: 92,
    verifiedTier: "Tier 1",
    boosted: false,
    hours: ["Mon-Sat 8:00 AM - 8:00 PM", "Sun 9:00 AM - 2:00 PM"],
    tags: ["mini mart", "snacks", "household", "chaguanas"],
    deals: ["Weekend grocery bundles"],
    products: [
      {
        id: "pantry-bundle",
        name: "Pantry Bundle",
        price: "TT$165",
        description: "Rice, oil, seasoning, canned goods, and cleaning basics.",
        tags: ["grocery", "bundle"],
        payment: "Fygaro link",
        featured: true,
      },
      {
        id: "snack-pack",
        name: "School Snack Pack",
        price: "TT$45",
        description: "Juices, biscuits, chips, and local treats.",
        tags: ["snacks", "school"],
        payment: "Fygaro link",
      },
    ],
  },
  {
    slug: "daves-hardware-supplies",
    name: "Dave's Hardware Supplies",
    initials: "DH",
    category: "Hardware",
    location: "San Fernando",
    address: "High Street, San Fernando",
    description:
      "Tools, plumbing parts, paint, and quick quotes for small contractors and home repairs.",
    whatsapp: "18685557654",
    rating: 4.8,
    reviews: 143,
    verifiedTier: "Tier 2",
    boosted: true,
    hours: ["Mon-Fri 7:30 AM - 5:30 PM", "Sat 8:00 AM - 3:00 PM"],
    tags: ["hardware", "tools", "paint", "plumbing", "san fernando"],
    deals: ["Contractor quote support", "Paint weekend specials"],
    products: [
      {
        id: "repair-kit",
        name: "Home Repair Kit",
        price: "TT$210",
        description: "Hammer, screwdrivers, tape, wall plugs, and utility knife.",
        tags: ["tools", "home repair"],
        payment: "Fygaro link",
        featured: true,
      },
      {
        id: "paint-gallon",
        name: "Interior Paint Gallon",
        price: "From TT$185",
        description: "Popular interior paint colors with WhatsApp color checks.",
        tags: ["paint", "home"],
        payment: "WhatsApp quote",
      },
    ],
  },
  {
    slug: "pure-glow-beauty-bar",
    name: "Pure Glow Beauty Bar",
    initials: "PG",
    category: "Health & Beauty",
    location: "Arima",
    address: "Pro Queen Street, Arima",
    description:
      "Salon bookings, skincare products, braids, barber services, and deposit-based appointments.",
    whatsapp: "18685554321",
    rating: 4.9,
    reviews: 211,
    verifiedTier: "Tier 2",
    boosted: false,
    hours: ["Tue-Sat 9:00 AM - 6:00 PM", "Sun by appointment"],
    tags: ["salon", "barber", "skincare", "arima", "appointments"],
    deals: ["First appointment deposit from TT$50"],
    products: [
      {
        id: "wash-style",
        name: "Wash & Style",
        price: "From TT$180",
        description: "Book a salon slot and confirm your preferred time on WhatsApp.",
        tags: ["salon", "booking"],
        payment: "Deposit accepted",
        featured: true,
      },
      {
        id: "beard-trim",
        name: "Beard Trim",
        price: "TT$65",
        description: "Clean trim and line-up with appointment confirmation.",
        tags: ["barber", "grooming"],
        payment: "Deposit accepted",
      },
    ],
  },
  {
    slug: "south-bakery-kitchen",
    name: "South Bakery Kitchen",
    initials: "SB",
    category: "Home Business",
    location: "Princes Town",
    address: "Princes Town",
    description:
      "Homemade cakes, bread, pastries, and event trays with preorder deposits.",
    whatsapp: "18685556789",
    rating: 4.6,
    reviews: 74,
    verifiedTier: "Tier 1",
    boosted: false,
    hours: ["Mon-Sat 7:00 AM - 4:00 PM", "Event orders by request"],
    tags: ["bakery", "cakes", "bread", "events", "princes town"],
    deals: ["Mother's Day cake list", "Event pastry tray specials"],
    products: [
      {
        id: "sweet-bread",
        name: "Coconut Sweet Bread",
        price: "TT$55",
        description: "Fresh local sweet bread baked to order.",
        tags: ["bread", "bakery"],
        payment: "Fygaro link",
        featured: true,
      },
      {
        id: "event-tray",
        name: "Pastry Event Tray",
        price: "From TT$250",
        description: "Mini pies, puffs, rolls, and pastries for events.",
        tags: ["events", "preorder"],
        payment: "Deposit accepted",
      },
    ],
  },
  {
    slug: "eastside-auto-care",
    name: "Eastside Auto Care",
    initials: "EA",
    category: "Services",
    location: "Tunapuna",
    address: "Eastern Main Road, Tunapuna",
    description:
      "Mechanic services, diagnostics, basic parts, and appointment requests for drivers.",
    whatsapp: "18685553456",
    rating: 4.5,
    reviews: 67,
    verifiedTier: "Tier 1",
    boosted: false,
    hours: ["Mon-Fri 8:00 AM - 5:00 PM", "Sat 8:00 AM - 1:00 PM"],
    tags: ["mechanic", "auto", "diagnostics", "tunapuna"],
    deals: ["WhatsApp diagnostic booking"],
    products: [
      {
        id: "diagnostic-check",
        name: "Diagnostic Check",
        price: "TT$150",
        description: "Book a diagnostic slot and share vehicle details in advance.",
        tags: ["mechanic", "diagnostic"],
        payment: "Deposit accepted",
        featured: true,
      },
      {
        id: "oil-change",
        name: "Oil Change Service",
        price: "From TT$280",
        description: "Oil and filter change with appointment confirmation.",
        tags: ["auto", "service"],
        payment: "WhatsApp quote",
      },
    ],
  },
];

export const allProducts = storefronts.flatMap((store) =>
  store.products.map((product) => ({
    ...product,
    storeSlug: store.slug,
    storeName: store.name,
    location: store.location,
    category: store.category,
  })),
);

export function getStoreBySlug(slug: string) {
  return storefronts.find((store) => store.slug === slug);
}

export function buildWhatsAppUrl(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function searchStorefronts(query: string) {
  const term = query.trim().toLowerCase();

  if (!term) {
    return storefronts;
  }

  return storefronts.filter((store) => {
    const productText = store.products
      .map((product) => `${product.name} ${product.description} ${product.tags.join(" ")}`)
      .join(" ");
    const haystack = [
      store.name,
      store.category,
      store.location,
      store.address,
      store.description,
      store.tags.join(" "),
      store.deals.join(" "),
      productText,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(term);
  });
}

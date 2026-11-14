// lib/site.ts
// Single source of truth for business details used across the site, SEO tags,
// the sitemap and Google's structured data. Change a detail here once and it
// updates everywhere.

export const SITE = {
  name: "Royal Laundry & Dry Cleaners",
  shortName: "Royal Laundry",
  url: "https://drycleaners.co.ke",
  tagline: "Laundry? Let's make it ROYAL.",
  description:
    "Washing, ironing, duvets, suits and curtains at Rock Centre, Eldoret–Iten Road, next to Palmcare Sinai Hospital. Free pickup and delivery. From KES 100/kg.",

  phone: "0790212210",
  phoneDisplay: "0790 212 210",
  phoneIntl: "+254790212210",
  whatsapp: "254790212210",

  emails: {
    info: "info@drycleaners.co.ke",
    order: "order@drycleaners.co.ke",
    sales: "sales@drycleaners.co.ke",
    finance: "finance@drycleaners.co.ke",
    hr: "hr@drycleaners.co.ke",
  },

  address: {
    street: "Eldoret–Iten Road, Rock Centre, next to Palmcare Sinai Hospital, opposite Zebra Ways Plaza",
    short: "Rock Centre, Eldoret–Iten Road",
    city: "Eldoret",
    region: "Uasin Gishu",
    country: "KE",
  },
  geo: { lat: 0.5411099, lng: 35.2982391 },
  mapsUrl: "https://maps.google.com/maps?q=0.5411099,35.2982391&z=17&hl=en",
  mapsEmbed: "https://maps.google.com/maps?q=0.5411099,35.2982391&z=17&output=embed",

  // Opening hours. Days use schema.org names; times are 24h.
  hours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "08:00",
    closes: "17:00",
    label: "Mon – Sat: 8:00am – 5:00pm",
  },

  socials: {
    tiktok: "https://www.tiktok.com/@royallaundry1",
    instagram: "https://www.instagram.com/royallaundryand",
    facebook: "https://www.facebook.com/share/1HjGELqPzz/",
  },
} as const;

export function whatsappLink(text?: string) {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

// ---------------------------------------------------------------------------
// Services: each one gets its own page at /services/<slug>/
// ---------------------------------------------------------------------------
export type Service = {
  slug: string;
  name: string;
  title: string; // <title> and Google headline
  description: string; // meta description (keep under ~155 chars)
  headline: string;
  intro: string;
  body: string[];
  includes: string[];
  price?: { label: string; value: string }[];
  email: keyof typeof SITE.emails;
  ogImage: string;
  image: string;
};

export const SERVICES: Service[] = [
  {
    slug: "wash-and-fold",
    name: "Wash & Fold",
    title: "Wash & Fold from KES 100/kg, Eldoret",
    description:
      "Sorted, washed, dried and neatly folded. 1 kg free for every 10 kg. Drop off at Rock Centre, Iten Road, or call 0790 212 210 for free pickup.",
    headline: "Washing made wonderful & easy",
    intro:
      "Hand us your everyday laundry and get it back clean, dry and neatly folded. We wash by the kilo, so you only pay for what you bring.",
    body: [
      "Every load is sorted by colour and fabric, washed with quality detergent and dried gently so your clothes keep their shape and colour.",
      "Drop your laundry at our shop on Eldoret–Iten Road or let us collect it from your door. Same-day pickup is available.",
    ],
    includes: ["Sorting by colour & fabric", "Eco-friendly deep wash", "Fast, gentle drying", "Neat folding, ready to wear"],
    price: [
      { label: "Bulk laundry", value: "KES 100 per kg" },
      { label: "Loyalty offer", value: "1 kg free for every 10 kg" },
    ],
    email: "order",
    ogImage: "/og/og-wash-fold.jpg",
    image: "/wash1.jpeg",
  },
  {
    slug: "ironing",
    name: "Ironing & Pressing",
    title: "Ironing & Pressing, Eldoret",
    description:
      "Crisp shirts, trousers, dresses and school uniforms, ready to wear. Free pickup from your door. Call or WhatsApp 0790 212 210.",
    headline: "Ironing perfection, delivered fast",
    intro:
      "Get that crisp, flawless look without lifting a finger. We press shirts, trousers, dresses and uniforms so they are ready to wear.",
    body: [
      "Our team irons each garment at the right temperature for its fabric, then folds or hangs it so it stays wrinkle-free until you wear it.",
      "Combine ironing with wash & fold, or bring clean clothes for pressing only.",
    ],
    includes: ["Shirts & blouses", "Trousers & skirts", "Dresses", "School & work uniforms"],
    email: "order",
    ogImage: "/og/og-ironing.jpg",
    image: "/iron.jpeg",
  },
  {
    slug: "dry-cleaning",
    name: "Dry Cleaning",
    title: "Suits, Gowns & Coats Cleaning, Eldoret",
    description:
      "Expert care for suits, wedding and graduation gowns, blazers and delicate fabrics. Rock Centre, Eldoret–Iten Road. Call 0790 212 210.",
    headline: "Suits, gowns & delicate fabrics",
    intro:
      "Some clothes need more than a washing machine. We dry clean suits, gowns, coats and delicate fabrics with gentle, expert care.",
    body: [
      "Dry cleaning removes stains and odours without water, protecting fabrics that shrink, fade or lose their shape in a normal wash.",
      "Ideal for office suits, wedding and graduation gowns, blazers, coats and special-occasion wear.",
    ],
    includes: ["Suits & blazers", "Gowns & dresses", "Coats & jackets", "Delicate fabrics"],
    email: "order",
    ogImage: "/og/og-dry-cleaning.jpg",
    image: "/iron1.jpeg",
  },
  {
    slug: "duvet-cleaning",
    name: "Duvet & Bedding Cleaning",
    title: "Duvet Cleaning from KES 400, Eldoret",
    description:
      "Duvets 4x6 KES 400, 5x6 KES 500, 6x6 KES 600, plus blankets and sheets. Washed, fully dried and folded, with free pickup. Call 0790 212 210.",
    headline: "Fresh duvets, fair prices",
    intro:
      "Duvets and blankets are too big for most home machines. We wash, dry and fold them properly so they come back fresh, fluffy and clean.",
    body: [
      "We clean duvets of all sizes, plus blankets, bedsheets and pillowcases. Large items are dried completely so they don't develop odours.",
      "Book a pickup and we will collect your bedding and deliver it back clean.",
    ],
    includes: ["Duvets (all sizes)", "Blankets", "Bedsheets", "Pillowcases"],
    price: [
      { label: "Duvet 4 × 6", value: "KES 400" },
      { label: "Duvet 5 × 6", value: "KES 500" },
      { label: "Duvet 6 × 6", value: "KES 600" },
    ],
    email: "order",
    ogImage: "/og/og-duvets.jpg",
    image: "/wash.jpeg",
  },
  {
    slug: "curtain-cleaning",
    name: "Curtain Cleaning",
    title: "Curtain Cleaning, Eldoret",
    description:
      "Home and office curtains, sheers and blackouts freed of dust and odours, colour restored. Free collection and delivery. WhatsApp 0790 212 210.",
    headline: "Bright, fresh curtains again",
    intro:
      "Curtains collect dust, smoke and odours over time. We wash them carefully to bring back their colour and freshness.",
    body: [
      "We handle home and office curtains in most fabrics, washing and drying them gently so they hang well again.",
      "Let us collect them for you and deliver them back clean.",
    ],
    includes: ["Home curtains", "Office curtains", "Sheers & nets", "Blackout curtains"],
    email: "order",
    ogImage: "/og/og-curtains.jpg",
    image: "/wash.jpeg",
  },
  {
    slug: "office-and-uniforms",
    name: "Office & Uniform Laundry",
    title: "Uniforms & Linen for Businesses, Eldoret",
    description:
      "Scheduled collection for offices, schools, hotels, salons and clinics: uniforms, linen and towels. Quotes from sales@drycleaners.co.ke.",
    headline: "Office & uniform laundry, sorted",
    intro:
      "We serve businesses as well as homes. Offices, schools, hotels, salons and clinics rely on us for clean uniforms, linen and towels.",
    body: [
      "Set up a regular pickup schedule and we take care of the rest: collection, washing, ironing and delivery back to your premises.",
      "Contact our sales team for a quote based on your volume.",
    ],
    includes: ["Staff & school uniforms", "Hotel & salon linen", "Towels", "Regular scheduled pickups"],
    email: "sales",
    ogImage: "/og/og-office-uniforms.jpg",
    image: "/iron1.jpeg",
  },
  {
    slug: "pickup-and-delivery",
    name: "Pickup & Delivery",
    title: "Free Pickup & Delivery across Eldoret",
    description:
      "Call or WhatsApp 0790 212 210 and we collect from your door, clean, and bring everything back fresh. Same-day pickup, Mon–Sat 8am–5pm.",
    headline: "We collect. We deliver.",
    intro:
      "No need to leave home. Book a pickup and we collect your laundry from your doorstep, clean it, and bring it back fresh and folded.",
    body: [
      "Call or WhatsApp us to book. Same-day pickup is available, so you can get your laundry sorted on the day you need it.",
    ],
    includes: ["Book by phone or WhatsApp", "We collect from your doorstep", "Washed & folded with care", "Delivered fresh & ready"],
    email: "order",
    ogImage: "/og/og-pickup-delivery.jpg",
    image: "/wash1.jpeg",
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}

// ---------------------------------------------------------------------------
// Prices shown on the home page and /pricing/. Edit here to change a price.
// ---------------------------------------------------------------------------
export type PriceCategory = {
  name: string;
  icon: "Package" | "WashingMachine" | "Shirt" | "Sparkles";
  items: { label: string; price: number; unit?: string }[];
  note?: string;
};

export const PRICES: PriceCategory[] = [
  {
    name: "Bulk Laundry",
    icon: "WashingMachine",
    items: [{ label: "Wash, dry & fold", price: 100, unit: "per kg" }],
    note: "1 kg free for every 10 kg washed",
  },
  {
    name: "Duvet Cleaning",
    icon: "Package",
    items: [
      { label: "4 × 6", price: 400 },
      { label: "5 × 6", price: 500 },
      { label: "6 × 6", price: 600 },
    ],
  },
];

export function formatKES(amount: number) {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

// ---------------------------------------------------------------------------
// Home page hero slides
// ---------------------------------------------------------------------------
export type HeroSlide = { label: string; body: string; ctaText: string; ctaLink?: string; imageUrl: string };

export const HERO_SLIDES: HeroSlide[] = [
  {
    label: "Ironing Perfection, Delivered Fast",
    body: "Achieve that crisp, flawless look without lifting a finger. Pure convenience starts here.",
    ctaText: "Schedule Ironing Pickup",
    imageUrl: "/iron.jpeg",
  },
  {
    label: "Washing Made Wonderful & Easy",
    body: "Experience deep, eco-friendly cleaning with effortless same-day pickup and delivery.",
    ctaText: "Start Washing Order",
    imageUrl: "/wash.jpeg",
  },
  {
    label: "Experience Unparalleled Convenience",
    body: "Our premium laundry services ensure a spotless finish and absolute peace of mind, every time.",
    ctaText: "Book Your Service Now",
    imageUrl: "/iron1.jpeg",
  },
  {
    label: "Care Beyond Compare for Fabrics",
    body: "From delicates to heavy linens, trust our experts for gentle treatment and sparkling results.",
    ctaText: "See All Pricing",
    ctaLink: "/pricing/",
    imageUrl: "/wash1.jpeg",
  },
];

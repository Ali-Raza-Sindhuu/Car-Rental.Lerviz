// All copy and image paths for the home page live here.
// Swap any image in /public/images and update the path below.
export const img = {
  hero: "/images/mustang.webp",
  heroThumb: "/images/white-supercar.webp",
  reel: "/images/bmw-m4.webp",
  motion: "/images/motion.webp",
  topSpeed: "/images/white-supercar.webp",
  torque: "/images/showroom-red.webp",
  offerCar: "/images/white-supercar.webp",
  cta: "/images/showroom-red.webp",
};

export const heroStats = [
  { value: "640 HP", label: "Horsepower" },
  { value: "300 mi", label: "Range" },
];

export const customers = { count: "95K+", label: "Happy customer", initials: ["AK", "MR", "JS"] };

export const about = {
  tag: "ABOUT US_",
  title: "Built for those\nwho choose differently",
  text: "World-class vehicles, total transparency, and absolutely zero compromise on quality.",
  reelCaption: "Pay reels by features",
  sourcing: { title: "Global sourcing", text: "Hand-picked from Japan, UK & UAE – quality without compromise." },
  specs: [
    { label: "Top speed", value: "320 km/h", image: img.topSpeed, tone: "bg-white" },
    { label: "Torque", value: "800 Nm", image: img.torque, tone: "bg-mist" },
  ],
};

export const inventory = {
  tag: "INVENTORY_",
  title: "Browse\nwhat just\nlanded",
  text: "New cars added every single day. Don't miss out.",
  items: [
    { id: "01", name: "BMW M4 Competition", image: "/images/bmw-m4.webp", text: "Track-bred power with everyday comfort and a razor-sharp chassis." },
    { id: "03", name: "Porsche 911 Turbo S", image: "/images/showroom-red.webp", text: "Breathtaking speed and precision handling wrapped in truly iconic design." },
    { id: "04", name: "Mercedes-Benz AMG GT", image: "/images/white-supercar.webp", text: "Hand-built AMG performance with a long-bonnet grand tourer stance." },
    { id: "02", name: "Ferrari Roma Spider", image: "/images/ferrari-street.webp", text: "Open-top Italian elegance with a twin-turbo V8 soundtrack." },
  ],
  defaultOpen: "03",
};

export const offer = {
  tag: "WHAT WE OFFER_",
  title: "Everything we\ndo is built\naround you",
  text: "We don't just sell cars. We build relationships that last long after delivery.",
  features: [
    { icon: "receipt", title: "Competitive Pricing", text: "No hidden charges, no markups. Just fair and honest prices every time." },
    { icon: "shield", title: "Certified Quality Guarantee", text: "Every car passes our strict 150-point inspection before it reaches you." },
    { icon: "headset", title: "Roadside Assistance", text: "Stuck on the road? Our support team is just one call away, anytime." },
    { icon: "card", title: "Easy EMI and Financing", text: "Flexible payment plans with low interest rates from 12+ top banks worldwide." },
  ],
  callouts: [
    { value: "330 km/h", label: "Top Speed", pos: "right-0 top-[18%]" },
    { value: "650 HP", label: "Horsepower", pos: "left-0 top-[54%]", red: true },
    { value: "3,745 cc", label: "Displacement", pos: "right-0 top-[72%]" },
  ],
};

export const testimonials = {
  tag: "TESTIMONIAL_",
  title: "Every review is a story\nwe are proud of",
  text: "New cars added every single day. Don't miss out.",
  items: [
    { name: "Esther Howard", role: "Businessman", image: "/images/motion.webp", text: "Bought my first luxury car from elcarro and honestly the experience was nothing like I expected.", rating: "4.9/5" },
    { name: "Robert Fox", role: "Architect", image: null, text: "The after-sales support alone is worth it. Three months after buying my car I had a small issue and they sorted it out the same day.", rating: "4.9/5" },
    { name: "Jacob Jones", role: "Doctor", image: "/images/bmw-m4.webp", text: "Best car buying experience I have had. The team was transparent and the process was completely stress free.", rating: "4.8/5" },
  ],
  stats: [
    { value: "12K+", label: "Happy customers served" },
    { value: "600+", label: "Client satisfaction rate" },
    { value: "150", label: "Projects delivered" },
    { value: "150", label: "Projects delivered" },
  ],
};

export const brands = {
  title: "The brands people actually dream\nabout – all in one place",
  items: ["Ferrari", "BMW", "Lamborghini", "Audi", "Ford"],
  more: { value: "12+", label: "More brands" },
};

export const faq = {
  tag: "FAQ_",
  title: "Let us clear things up",
  text: "We are always here to help. No question is too small.",
  items: [
    { q: "Is elcarro a trusted dealership?", a: "Yes. Every car passes a 150-point inspection and comes with a full service history and a transparent price." },
    { q: "What if I don't like the car after buying?", a: "We have a transparent return policy. Your satisfaction comes first – no questions asked." },
    { q: "Can I negotiate the price?", a: "Our prices are fair and fixed, but we are happy to review trade-ins and financing options with you." },
    { q: "Can I see the car before buying?", a: "Absolutely. Book a test drive and we will have the car ready for you at the showroom." },
  ],
  defaultOpen: "item-1",
  help: { title: "Need more clarity?", text: "Still not sure? Our team is just one call away — ready to help you with anything you need." },
};

export const cta = {
  title: "Let's find your next\ncar together",
  text: "Browse our full collection, book a test drive, or simply reach out. We are here and ready to help.",
};

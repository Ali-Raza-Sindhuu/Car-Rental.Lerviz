import { CARS } from "./cars";
import { CAR_IMAGES } from "./carImages";

// ALL values below are illustrative sample data, not verified vehicle specifications.
// Existing inventory year/model combinations are preserved unchanged.
const profiles = {
  "bmw-i8-2022": {
    "torque": 570,
    "zeroToHundred": 4.4,
    "topSpeed": 250,
    "drivetrain": "All-wheel drive",
    "doors": 2,
    "seats": 4,
    "interiorColour": "Ivory",
    "description": "A sculpted hybrid coupe with a low driving position and a distinctive sense of occasion. Its compact petrol engine and electric assistance make this an engaging choice for weekend escapes.",
    "features": [
      "Head-up display",
      "Hybrid drive modes"
    ]
  },
  "chevrolet-camaro-ss-2019": {
    "torque": 617,
    "zeroToHundred": 4.3,
    "topSpeed": 250,
    "drivetrain": "Rear-wheel drive",
    "doors": 2,
    "seats": 4,
    "interiorColour": "Black",
    "description": "A muscular coupe with a generous V8 soundtrack and a purposeful cabin. This rental suits a memorable road trip with room for a light weekend bag.",
    "features": [
      "Sport exhaust",
      "Paddle shifters"
    ]
  },
  "chevrolet-camaro-rs-2023": {
    "torque": 385,
    "zeroToHundred": 5.1,
    "topSpeed": 250,
    "drivetrain": "Rear-wheel drive",
    "doors": 2,
    "seats": 4,
    "interiorColour": "Black",
    "description": "A bright coupe that balances everyday comfort with an expressive silhouette. The automatic gearbox keeps the drive relaxed while the V6 adds character.",
    "features": [
      "Drive mode selector",
      "Sport seats"
    ]
  },
  "bmw-m2-competition-2022": {
    "torque": 550,
    "zeroToHundred": 4.4,
    "topSpeed": 250,
    "drivetrain": "Rear-wheel drive",
    "doors": 2,
    "seats": 4,
    "interiorColour": "Black",
    "description": "Compact proportions and a manual gearbox put the driver at the centre of the experience. A focused coupe for those who enjoy taking the longer route home.",
    "features": [
      "Limited-slip differential",
      "Sport seats"
    ]
  },
  "toyota-hilux-2023": {
    "torque": 500,
    "zeroToHundred": 10.7,
    "topSpeed": 175,
    "drivetrain": "Four-wheel drive",
    "doors": 4,
    "seats": 5,
    "interiorColour": "Black",
    "description": "A double-cab pickup with practical space for work and weekends. Diesel torque and four-wheel drive give this sample specification an adaptable character.",
    "features": [
      "Selectable four-wheel drive",
      "Tow preparation"
    ]
  },
  "mercedes-e-class-2019": {
    "torque": 320,
    "zeroToHundred": 7.5,
    "topSpeed": 240,
    "drivetrain": "Rear-wheel drive",
    "doors": 4,
    "seats": 5,
    "interiorColour": "Beige",
    "description": "A refined sedan with space to settle into a longer journey. Its automatic transmission and calm cabin make it a natural choice for business travel or a comfortable break.",
    "features": [
      "Heated front seats",
      "Ambient lighting"
    ]
  },
  "porsche-911-carrera-2022": {
    "torque": 450,
    "zeroToHundred": 4.2,
    "topSpeed": 293,
    "drivetrain": "Rear-wheel drive",
    "doors": 2,
    "seats": 4,
    "interiorColour": "Black",
    "description": "An enduring sports-car shape with a low seating position and a rear-mounted engine. This used example offers a distinctive balance of everyday usability and weekend character.",
    "features": [
      "Sport drive modes",
      "Power-adjustable seats"
    ]
  },
  "toyota-land-cruiser-2021": {
    "torque": 700,
    "zeroToHundred": 6.9,
    "topSpeed": 210,
    "drivetrain": "Four-wheel drive",
    "doors": 5,
    "seats": 7,
    "interiorColour": "Beige",
    "description": "A substantial SUV with generous passenger space and a composed long-distance character. Its diesel engine and four-wheel-drive layout suit journeys beyond the city.",
    "features": [
      "Low-range gearing",
      "Third-row seating"
    ]
  },
  "land-rover-defender-90-2022": {
    "torque": 430,
    "zeroToHundred": 10.2,
    "topSpeed": 175,
    "drivetrain": "Four-wheel drive",
    "doors": 3,
    "seats": 5,
    "interiorColour": "Black",
    "description": "A short-wheelbase SUV with upright visibility and a confident stance. This rental is an interesting companion for a scenic break with a compact group.",
    "features": [
      "Terrain modes",
      "Surround-view camera"
    ]
  },
  "tesla-model-3-2023": {
    "torque": 420,
    "zeroToHundred": 6.1,
    "topSpeed": 201,
    "drivetrain": "Rear-wheel drive",
    "doors": 4,
    "seats": 5,
    "interiorColour": "Black",
    "description": "A clean-lined electric sedan with a quiet cabin and a simple central interface. Smooth power delivery makes the everyday commute feel effortless.",
    "features": [
      "Navigation",
      "Heated front seats"
    ]
  },
  "audi-a4-avant-2020": {
    "torque": 400,
    "zeroToHundred": 7.9,
    "topSpeed": 235,
    "drivetrain": "Front-wheel drive",
    "doors": 5,
    "seats": 5,
    "interiorColour": "Black",
    "description": "An understated wagon with useful luggage space and a relaxed automatic transmission. A practical used choice for long trips and busy family days.",
    "features": [
      "Powered tailgate",
      "Roof rails"
    ]
  },
  "honda-civic-2021": {
    "torque": 240,
    "zeroToHundred": 8.2,
    "topSpeed": 220,
    "drivetrain": "Front-wheel drive",
    "doors": 5,
    "seats": 5,
    "interiorColour": "Black",
    "description": "An approachable hatchback that combines a manual gearbox with useful everyday space. Its compact footprint and responsive petrol engine suit varied routines.",
    "features": [
      "Rear parking camera",
      "Lane departure warning"
    ]
  },
  "ford-mustang-gt-convertible-2020": {
    "torque": 529,
    "zeroToHundred": 4.8,
    "topSpeed": 250,
    "drivetrain": "Rear-wheel drive",
    "doors": 2,
    "seats": 4,
    "interiorColour": "Black",
    "description": "An open-top V8 with a relaxed touring spirit and a bold silhouette. A rental made for taking in the scenery at your own pace.",
    "features": [
      "Power folding roof",
      "Heated front seats"
    ]
  },
  "volkswagen-golf-gti-2022": {
    "torque": 370,
    "zeroToHundred": 6.4,
    "topSpeed": 250,
    "drivetrain": "Front-wheel drive",
    "doors": 5,
    "seats": 5,
    "interiorColour": "Black",
    "description": "A familiar hatchback with a more purposeful edge. The manual gearbox and practical cabin make this sample car an appealing all-rounder.",
    "features": [
      "Sport seats",
      "Limited-slip differential"
    ]
  },
  "bmw-x5-2021": {
    "torque": 600,
    "zeroToHundred": 5.6,
    "topSpeed": 235,
    "drivetrain": "All-wheel drive",
    "doors": 5,
    "seats": 5,
    "interiorColour": "Brown",
    "description": "A spacious hybrid SUV with a comfortable driving position and a versatile cabin. This used example brings quiet urban running and long-distance flexibility together.",
    "features": [
      "Panoramic roof",
      "Powered tailgate"
    ]
  },
  "mazda-mx-5-2022": {
    "torque": 205,
    "zeroToHundred": 6.5,
    "topSpeed": 219,
    "drivetrain": "Rear-wheel drive",
    "doors": 2,
    "seats": 2,
    "interiorColour": "Black",
    "description": "A light two-seat roadster built around the simple pleasure of driving. A manual gearbox and compact proportions make even a short journey feel special.",
    "features": [
      "Folding soft top",
      "Limited-slip differential"
    ]
  },
  "ferrari-roma-2021": {
    torque: 760,
    zeroToHundred: 3.4,
    topSpeed: 320,
    drivetrain: "Rear-wheel drive",
    doors: 2,
    seats: 4,
    interiorColour: "Tan",
    description: "A front-engined grand touring coupe with a twin-turbo V8 and a carefully finished cabin. This sample listing pairs striking performance with room for a weekend away.",
    features: ["Manettino drive modes", "Adaptive suspension"],
    dealer: { name: "REVEX Downtown", city: "Example City", phone: "+1 202 555 0142", hours: "Mon–Sat 9:00–19:00, Sun 10:00–16:00" }
  },
  "nissan-gt-r-2020": {
    torque: 633,
    zeroToHundred: 2.9,
    topSpeed: 315,
    drivetrain: "All-wheel drive",
    doors: 2,
    seats: 4,
    interiorColour: "Black",
    description: "A high-performance coupe with all-wheel-drive traction and a cockpit designed around the driver. This used sample offers a focused sports-car experience.",
    features: ["Launch control", "Brembo performance brakes"],
    dealer: { name: "REVEX Riverside", city: "Example City", phone: "+1 202 555 0142", hours: "Mon–Fri 8:30–18:00, Sat 10:00–16:00" }
  },
  "hyundai-ioniq-5-2023": {
    torque: 605,
    zeroToHundred: 5.2,
    topSpeed: 185,
    drivetrain: "All-wheel drive",
    doors: 5,
    seats: 5,
    interiorColour: "Charcoal",
    description: "A spacious electric crossover with a flat floor, a quiet cabin and quick charging capability. This new sample vehicle is suited to everyday journeys and longer drives.",
    features: ["Regenerative braking", "Vehicle-to-load power"],
    dealer: { name: "REVEX Airport Park", city: "Example City", phone: "+1 202 555 0142", hours: "Daily 7:00–22:00 (rentals)" }
  },
  "kia-sportage-2022": {
    torque: 350,
    zeroToHundred: 8.0,
    topSpeed: 193,
    drivetrain: "All-wheel drive",
    doors: 5,
    seats: 5,
    interiorColour: "Black",
    description: "A practical hybrid SUV with a comfortable driving position, useful cargo space and a flexible cabin. Its sample equipment makes it a well-rounded choice for family trips.",
    features: ["Smart cruise control", "Heated front seats"],
    dealer: { name: "REVEX Downtown", city: "Example City", phone: "+1 202 555 0142", hours: "Mon–Sat 9:00–19:00, Sun 10:00–16:00" }
  },
  "toyota-corolla-2021": {
    torque: 142,
    zeroToHundred: 10.9,
    topSpeed: 180,
    drivetrain: "Front-wheel drive",
    doors: 4,
    seats: 5,
    interiorColour: "Black",
    description: "A dependable hybrid sedan with a quiet cabin and straightforward controls. This sample listing offers a comfortable, efficient option for commuting and city errands.",
    features: ["Adaptive cruise control", "Lane-tracing assist"],
    dealer: { name: "REVEX Riverside", city: "Example City", phone: "+1 202 555 0142", hours: "Mon–Fri 8:30–18:00, Sat 10:00–16:00" }
  },
  "mercedes-g-class-2022": {
    torque: 850,
    zeroToHundred: 4.5,
    topSpeed: 220,
    drivetrain: "All-wheel drive",
    doors: 5,
    seats: 5,
    interiorColour: "Black",
    description: "A distinctive luxury SUV with a commanding view of the road, a premium cabin and serious off-road hardware. This rental sample combines presence with modern comfort.",
    features: ["Three locking differentials", "Adaptive damping"],
    dealer: { name: "REVEX Airport Park", city: "Example City", phone: "+1 202 555 0142", hours: "Daily 7:00–22:00 (rentals)" }
  },
  "audi-rs6-avant-2021": {
    torque: 800,
    zeroToHundred: 3.6,
    topSpeed: 280,
    drivetrain: "All-wheel drive",
    doors: 5,
    seats: 5,
    interiorColour: "Black",
    description: "A performance wagon that pairs a twin-turbo V8 with generous luggage space and a refined cabin. This sample RS6 Avant is equally at home on a long trip or a quiet commute.",
    features: ["Adaptive air suspension", "Sport differential"],
    dealer: { name: "REVEX Downtown", city: "Example City", phone: "+1 202 555 0142", hours: "Mon–Sat 9:00–19:00, Sun 10:00–16:00" }
  },
  "volvo-v60-2020": {
    torque: 400,
    zeroToHundred: 7.9,
    topSpeed: 220,
    drivetrain: "All-wheel drive",
    doors: 5,
    seats: 5,
    interiorColour: "Charcoal",
    description: "A restrained estate car with supportive seats, balanced road manners and room for everyday gear. This diesel sample is suited to relaxed, longer-distance driving.",
    features: ["Pilot Assist", "Powered tailgate"],
    dealer: { name: "REVEX Riverside", city: "Example City", phone: "+1 202 555 0142", hours: "Mon–Fri 8:30–18:00, Sat 10:00–16:00" }
  },
  "ford-f-150-raptor-2022": {
    torque: 691,
    zeroToHundred: 5.5,
    topSpeed: 180,
    drivetrain: "Four-wheel drive",
    doors: 4,
    seats: 5,
    interiorColour: "Black",
    description: "A wide-track pickup with long-travel suspension, a spacious double cab and ample utility. This new sample vehicle is built for demanding roads and outdoor weekends.",
    features: ["Selectable terrain modes", "Off-road suspension"],
    dealer: { name: "REVEX Downtown", city: "Example City", phone: "+1 202 555 0142", hours: "Mon–Sat 9:00–19:00, Sun 10:00–16:00" }
  },
  "mazda-mx-5-rf-2021": {
    torque: 205,
    zeroToHundred: 6.8,
    topSpeed: 215,
    drivetrain: "Rear-wheel drive",
    doors: 2,
    seats: 2,
    interiorColour: "Black",
    description: "A compact roadster with a retractable hardtop, direct steering and an engaging manual gearbox. This rental sample is a natural fit for a scenic drive.",
    features: ["Retractable hardtop", "Limited-slip differential"],
    dealer: { name: "REVEX Airport Park", city: "Example City", phone: "+1 202 555 0142", hours: "Daily 7:00–22:00 (rentals)" }
  },
  "bmw-z4-m40i-2022": {
    torque: 500,
    zeroToHundred: 4.5,
    topSpeed: 250,
    drivetrain: "Rear-wheel drive",
    doors: 2,
    seats: 2,
    interiorColour: "Magma Red",
    description: "A two-seat convertible with a turbocharged six-cylinder engine and a power-operated soft top. This new sample balances open-air touring with confident performance.",
    features: ["Adaptive M suspension", "Power soft top"],
    dealer: { name: "REVEX Downtown", city: "Example City", phone: "+1 202 555 0142", hours: "Mon–Sat 9:00–19:00, Sun 10:00–16:00" }
  },
  "volkswagen-polo-2019": {
    torque: 175,
    zeroToHundred: 10.8,
    topSpeed: 187,
    drivetrain: "Front-wheel drive",
    doors: 5,
    seats: 5,
    interiorColour: "Grey",
    description: "A compact hatchback with easy-to-use controls, a practical boot and a manual gearbox. This used sample is an approachable companion for urban driving.",
    features: ["Front assist", "Rear parking sensors"],
    dealer: { name: "REVEX Riverside", city: "Example City", phone: "+1 202 555 0142", hours: "Mon–Fri 8:30–18:00, Sat 10:00–16:00" }
  },
  "porsche-taycan-2023": {
    torque: 650,
    zeroToHundred: 4.8,
    topSpeed: 230,
    drivetrain: "All-wheel drive",
    doors: 4,
    seats: 4,
    interiorColour: "Slate Grey",
    description: "An electric sports sedan with immediate acceleration, composed handling and a carefully appointed interior. This new sample is designed for quiet daily use and confident longer journeys.",
    features: ["Adaptive air suspension", "Regenerative braking"],
    dealer: { name: "REVEX Downtown", city: "Example City", phone: "+1 202 555 0142", hours: "Mon–Sat 9:00–19:00, Sun 10:00–16:00" }
  },
  "range-rover-sport-2020": {
    torque: 700,
    zeroToHundred: 6.9,
    topSpeed: 209,
    drivetrain: "All-wheel drive",
    doors: 5,
    seats: 5,
    interiorColour: "Ebony",
    description: "A refined diesel SUV with a raised driving position, supportive seats and versatile cargo room. This rental sample is suited to comfortable touring and varied road conditions.",
    features: ["Terrain response", "Electronic air suspension"],
    dealer: { name: "REVEX Airport Park", city: "Example City", phone: "+1 202 555 0142", hours: "Daily 7:00–22:00 (rentals)" }
  }
};

export const CAR_DETAILS = Object.fromEntries(CARS.map((car, index) => {
  const profile = profiles[car.id];
  return [car.id, {
    ...profile,
    sample: true,
    features: ["Climate control", "Bluetooth audio", "USB connectivity", "Cruise control", "Alloy wheels", "Parking sensors", "Electronic stability control", "Tyre pressure monitoring", ...profile.features],
    ownershipHistory: car.condition === "new" ? "Unregistered sample vehicle" : "Two previous keepers; sample history, documents to be verified",
    warranty: "Sample 12-month cover; eligibility and terms unconfirmed",
    vin: `SAMPLE-VIN-${String(index + 1).padStart(6, "0")}`,
    dealer: profile.dealer ?? { name: "REVEX Downtown", city: "Example City", phone: "+1 202 555 0142", hours: "Mon–Sat 9:00–19:00, Sun 10:00–16:00" },
    gallery: CAR_IMAGES[car.id].gallery,
  }];
}));

export const getSimilarCars = (car, count = 3) => {
  const rank = (candidate) => candidate.bodyType === car.bodyType ? 0 : candidate.make === car.make ? 1 : 2;
  return CARS.filter((candidate) => candidate.id !== car.id)
    .sort((first, second) => rank(first) - rank(second))
    .slice(0, Math.max(0, count));
};

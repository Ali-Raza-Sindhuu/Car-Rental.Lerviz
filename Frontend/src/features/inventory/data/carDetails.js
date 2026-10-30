import { CARS } from "./cars";

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
    dealer: { name: "REVEX Example Motors", city: "Example City", phone: "+1 202 555 0142", hours: "Mon–Sat, 9am–6pm (sample hours)" },
    gallery: Array.from({ length: 4 }, (_, photo) => `/image/inventory/details/${car.id}-${String(photo + 1).padStart(2, "0")}.png`),
  }];
}));

export const getSimilarCars = (car, count = 3) => {
  const rank = (candidate) => candidate.bodyType === car.bodyType ? 0 : candidate.make === car.make ? 1 : 2;
  return CARS.filter((candidate) => candidate.id !== car.id)
    .sort((first, second) => rank(first) - rank(second))
    .slice(0, Math.max(0, count));
};


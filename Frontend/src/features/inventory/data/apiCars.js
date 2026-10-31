const number = (value) => Number(value ?? 0);

export const mapCar = (row) => ({
  id: row.id,
  make: row.make,
  model: row.model,
  yearRange: row.year_range,
  year: number(row.year),
  condition: row.condition,
  listingType: row.listing_type,
  status: row.status,
  price: number(row.price),
  bodyType: row.body_type,
  fuel: row.fuel,
  transmission: row.transmission,
  cc: number(row.cc),
  bhp: number(row.bhp),
  mileage: number(row.mileage),
  colour: row.colour,
  image: row.image_url,
});

export const mapCarDetails = (row) => {
  const specs = row.details?.specs ?? {};
  return {
    description: row.details?.description ?? "Details are not available for this listing.",
    torque: number(specs.torque),
    zeroToHundred: number(specs.zeroToHundred),
    topSpeed: number(specs.topSpeed),
    drivetrain: specs.drivetrain ?? "Not specified",
    doors: number(specs.doors),
    seats: number(specs.seats),
    interiorColour: specs.interiorColour ?? "Not specified",
    ownershipHistory: specs.ownershipHistory ?? "Not verified",
    warranty: specs.warranty ?? "Not verified",
    vin: row.details?.vin ?? "",
    dealer: row.details?.dealer ?? {
      name: "Dealer details unavailable",
      city: "",
      phone: "",
      hours: "",
    },
    features: Array.isArray(row.features) && row.features.length
      ? row.features
      : [],
    gallery: Array.isArray(row.gallery) && row.gallery.length
      ? row.gallery.map((image) => image.image_url)
      : [row.image_url],
  };
};

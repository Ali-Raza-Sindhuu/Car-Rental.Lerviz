import { createRequire } from "node:module";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const backendRoot = resolve(scriptDir, "..");
const frontendRoot = resolve(backendRoot, "..", "Frontend");
const requireFrontend = createRequire(resolve(frontendRoot, "package.json"));
const viteEntry = requireFrontend.resolve("vite");
const { createServer } = await import(pathToFileURL(viteEntry).href);

const assetFilename = (assetUrl) => {
  if (typeof assetUrl !== "string" || !assetUrl) {
    throw new Error("A frontend car is missing its image asset.");
  }
  const parsed = assetUrl.startsWith("file:")
    ? new URL(assetUrl)
    : new URL(assetUrl, "http://localhost");
  return basename(decodeURIComponent(parsed.pathname));
};

const vite = await createServer({
  root: frontendRoot,
  configFile: resolve(frontendRoot, "vite.config.js"),
  server: { middlewareMode: true },
  appType: "custom",
  optimizeDeps: { noDiscovery: true, entries: [] },
  logLevel: "error",
});

try {
  const [{ CARS }, { CAR_DETAILS }] = await Promise.all([
    vite.ssrLoadModule("/src/features/inventory/data/cars.js"),
    vite.ssrLoadModule("/src/features/inventory/data/carDetails.js"),
  ]);
  const cars = CARS.map((car) => {
    const details = CAR_DETAILS[car.id];
    if (!details) throw new Error(`Missing sample details for car ${car.id}.`);
    return {
      id: car.id,
      make: car.make,
      model: car.model,
      year_range: car.yearRange,
      year: car.year,
      condition: car.condition,
      listing_type: car.listingType,
      price: car.price,
      body_type: car.bodyType,
      fuel: car.fuel,
      transmission: car.transmission,
      cc: car.cc,
      bhp: car.bhp,
      mileage: car.mileage,
      colour: car.colour,
      image_file: assetFilename(car.image),
      details: {
        description: details.description,
        specs: {
          torque: details.torque,
          zeroToHundred: details.zeroToHundred,
          topSpeed: details.topSpeed,
          drivetrain: details.drivetrain,
          doors: details.doors,
          seats: details.seats,
          interiorColour: details.interiorColour,
          ownershipHistory: details.ownershipHistory,
          warranty: details.warranty,
        },
        dealer: details.dealer,
        vin: details.vin,
      },
      features: details.features,
      gallery_files: details.gallery.map(assetFilename),
    };
  });
  const outputPath = resolve(backendRoot, "db", "seed-data", "cars.json");
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify({ cars }, null, 2)}\n`, "utf8");
  console.log(`Exported ${cars.length} sample cars to db/seed-data/cars.json`);
} finally {
  await vite.close();
}

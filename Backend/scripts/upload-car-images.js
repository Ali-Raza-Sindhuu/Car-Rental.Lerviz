import "dotenv/config";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, extname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import cloudinary from "../src/config/cloudinary.js";
import { configureCloudinary } from "../src/config/cloudinary.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const backendRoot = resolve(scriptDir, "..");
const frontendAssets = resolve(backendRoot, "..", "Frontend", "src", "assets");
const carsPath = resolve(backendRoot, "db", "seed-data", "cars.json");
const imageMapPath = resolve(backendRoot, "db", "seed-data", "image-map.json");

const mainAssetKey = (filename) => `main:${filename}`;
const galleryAssetKey = (filename) => `gallery:${filename}`;
const publicIdFor = (folder, filename) => {
  const publicId = basename(filename, extname(filename));
  return `${folder}/${publicId}`;
};

const loadCars = async () => {
  try {
    const data = JSON.parse(await readFile(carsPath, "utf8"));
    if (!Array.isArray(data.cars) || data.cars.length === 0) throw new Error("no cars");
    return data.cars;
  } catch {
    throw new Error("Missing or invalid db/seed-data/cars.json. Run node scripts/export-frontend-cars.js first.");
  }
};

configureCloudinary();
const cars = await loadCars();
const assets = new Map();
for (const car of cars) {
  assets.set(mainAssetKey(car.image_file), {
    filename: car.image_file,
    folder: "revex/cars",
  });
  for (const filename of car.gallery_files ?? []) {
    assets.set(galleryAssetKey(filename), {
      filename,
      folder: "revex/cars/details",
    });
  }
}

const imageMap = {};
const failures = [];
for (const [key, asset] of assets) {
  const localPath = resolve(frontendAssets, asset.filename);
  if (dirname(localPath) !== frontendAssets || basename(localPath) !== asset.filename) {
    failures.push({ key, reason: "invalid asset path" });
    continue;
  }
  const publicId = publicIdFor(asset.folder, asset.filename);
  try {
    let uploaded;
    try {
      uploaded = await cloudinary.uploader.upload(localPath, {
        folder: asset.folder,
        public_id: basename(asset.filename, extname(asset.filename)),
        overwrite: false,
        unique_filename: false,
        transformation: [{ fetch_format: "auto", quality: "auto" }],
      });
    } catch (error) {
      const alreadyExists = error.http_code === 409
        || (error.http_code === 400 && /already exists|already taken/i.test(error.message || ""));
      if (!alreadyExists) throw error;
      uploaded = await cloudinary.api.resource(publicId, { resource_type: "image" });
    }
    imageMap[key] = {
      publicId,
      secureUrl: cloudinary.url(publicId, {
        secure: true,
        transformation: [{ fetch_format: "auto", quality: "auto" }],
      }),
    };
  } catch (error) {
    failures.push({ key, reason: error.http_code ? `Cloudinary HTTP ${error.http_code}` : "upload failed" });
  }
}

await writeFile(imageMapPath, `${JSON.stringify(imageMap, null, 2)}\n`, "utf8");
console.log(`Car images uploaded or reused: ${Object.keys(imageMap).length}`);
console.log(`Car image upload failures: ${failures.length}`);
if (failures.length) {
  for (const failure of failures) console.error(`${failure.key}: ${failure.reason}`);
  process.exitCode = 1;
}

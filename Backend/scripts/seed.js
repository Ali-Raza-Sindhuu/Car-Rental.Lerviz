import "dotenv/config";
import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pool from "../src/config/database.js";

const backendRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const seedDir = resolve(backendRoot, "db", "seed-data");

const readJson = async (name) => {
  try {
    return JSON.parse(await readFile(resolve(seedDir, name), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`Missing db/seed-data/${name}. Run the required export and image upload steps first.`);
    }
    throw new Error(`Could not read db/seed-data/${name}: ${error.message}`);
  }
};

const assetMapping = (imageMap, type, filename, carId) => {
  const mapping = imageMap[`${type}:${filename}`];
  if (!mapping?.publicId || !mapping?.secureUrl) {
    throw new Error(`Missing ${type} image mapping for car ${carId}: ${filename}`);
  }
  return mapping;
};

const seed = async () => {
  const { cars } = await readJson("cars.json");
  const imageMap = await readJson("image-map.json");
  if (!Array.isArray(cars) || !cars.length) throw new Error("cars.json must contain a non-empty cars array.");

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (const car of cars) {
      const mainImage = assetMapping(imageMap, "main", car.image_file, car.id);
      const gallery = (car.gallery_files ?? []).map((filename) => ({
        filename,
        ...assetMapping(imageMap, "gallery", filename, car.id),
      }));
      await connection.execute(
        `INSERT INTO cars
          (id, make, model, year_range, year, \`condition\`, listing_type, price,
           body_type, fuel, transmission, cc, bhp, mileage, colour,
           image_url, image_public_id, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')
         ON DUPLICATE KEY UPDATE
          make = VALUES(make), model = VALUES(model), year_range = VALUES(year_range),
          year = VALUES(year), \`condition\` = VALUES(\`condition\`), listing_type = VALUES(listing_type),
          price = VALUES(price), body_type = VALUES(body_type), fuel = VALUES(fuel),
          transmission = VALUES(transmission), cc = VALUES(cc), bhp = VALUES(bhp),
          mileage = VALUES(mileage), colour = VALUES(colour), image_url = VALUES(image_url),
          image_public_id = VALUES(image_public_id)`,
        [
          car.id, car.make, car.model, car.year_range, car.year, car.condition,
          car.listing_type, car.price, car.body_type, car.fuel, car.transmission,
          car.cc, car.bhp, car.mileage, car.colour, mainImage.secureUrl, mainImage.publicId,
        ],
      );
      await connection.execute(
        `INSERT INTO car_details (car_id, description, specs, dealer, vin)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE description = VALUES(description),
          specs = VALUES(specs), dealer = VALUES(dealer), vin = VALUES(vin)`,
        [
          car.id,
          car.details.description,
          JSON.stringify(car.details.specs),
          JSON.stringify(car.details.dealer),
          car.details.vin,
        ],
      );

      for (let index = 0; index < car.features.length; index += 1) {
        await connection.execute(
          `INSERT INTO car_features (car_id, label, sort_order) VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE label = VALUES(label)`,
          [car.id, car.features[index], index],
        );
      }
      await connection.execute(
        "DELETE FROM car_features WHERE car_id = ? AND sort_order >= ?",
        [car.id, car.features.length],
      );
      for (let index = 0; index < gallery.length; index += 1) {
        await connection.execute(
          `INSERT INTO car_gallery (car_id, image_url, image_public_id, sort_order)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE image_url = VALUES(image_url),
            image_public_id = VALUES(image_public_id)`,
          [car.id, gallery[index].secureUrl, gallery[index].publicId, index],
        );
      }
      await connection.execute(
        "DELETE FROM car_gallery WHERE car_id = ? AND sort_order >= ?",
        [car.id, gallery.length],
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  const [carsCount] = await pool.execute("SELECT COUNT(*) AS count FROM cars");
  const [detailsCount] = await pool.execute("SELECT COUNT(*) AS count FROM car_details");
  const [featuresCount] = await pool.execute("SELECT COUNT(*) AS count FROM car_features");
  const [galleryCount] = await pool.execute("SELECT COUNT(*) AS count FROM car_gallery");
  console.log(
    `Seed complete: cars=${carsCount[0].count} details=${detailsCount[0].count} ` +
    `features=${featuresCount[0].count} gallery=${galleryCount[0].count}`,
  );
};

try {
  await seed();
} catch (error) {
  console.error(`Could not seed cars: ${error.message}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}

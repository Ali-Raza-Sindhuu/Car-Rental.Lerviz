import pool from "../config/database.js";
import { AppError } from "../lib/errors.js";

const SORT_SQL = {
  newest: "year DESC, created_at DESC, id ASC",
  "price-asc": "price ASC, id ASC",
  "price-desc": "price DESC, id ASC",
  year: "year ASC, id ASC",
};

const appendFilter = (filters, values, field, value, operator = "=") => {
  if (value === undefined || value === "") return;
  filters.push(`${field} ${operator} ?`);
  values.push(value);
};

const buildCarFilters = (query) => {
  const filters = ["status = 'available'"];
  const values = [];
  appendFilter(filters, values, "`condition`", query.condition);
  appendFilter(filters, values, "listing_type", query.listingType);
  appendFilter(filters, values, "make", query.make);
  appendFilter(filters, values, "model", query.model);
  appendFilter(filters, values, "year", query.year);
  appendFilter(filters, values, "body_type", query.bodyType);
  appendFilter(filters, values, "fuel", query.fuel);
  appendFilter(filters, values, "transmission", query.transmission);
  appendFilter(filters, values, "colour", query.colour);
  appendFilter(filters, values, "year", query.minYear, ">=");
  appendFilter(filters, values, "year", query.maxYear, "<=");
  appendFilter(filters, values, "mileage", query.maxMileage, "<=");

  if (query.minPrice !== undefined) {
    filters.push("(listing_type = 'rent' OR price >= ?)");
    values.push(query.minPrice);
  }
  if (query.maxPrice !== undefined) {
    filters.push("(listing_type = 'rent' OR price <= ?)");
    values.push(query.maxPrice);
  }
  return { where: filters.join(" AND "), values };
};

export const listCars = async (query) => {
  const { where, values } = buildCarFilters(query);
  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total FROM cars WHERE ${where}`,
    values,
  );
  const total = Number(countRows[0].total);
  const offset = (query.page - 1) * query.pageSize;
  const [items] = await pool.execute(
    `SELECT * FROM cars WHERE ${where}
     ORDER BY ${SORT_SQL[query.sort]}
     LIMIT ? OFFSET ?`,
    [...values, query.pageSize, offset],
  );
  return {
    items,
    total,
    page: query.page,
    pageCount: Math.ceil(total / query.pageSize),
  };
};

export const getCarFacets = async () => {
  const [makes, models, years, bodyTypes] = await Promise.all([
    pool.execute("SELECT DISTINCT make FROM cars WHERE status = 'available' ORDER BY make"),
    pool.execute("SELECT DISTINCT make, model FROM cars WHERE status = 'available' ORDER BY make, model"),
    pool.execute("SELECT DISTINCT year FROM cars WHERE status = 'available' ORDER BY year DESC"),
    pool.execute("SELECT DISTINCT body_type FROM cars WHERE status = 'available' ORDER BY body_type"),
  ]);
  const modelsByMake = {};
  for (const row of models[0]) {
    (modelsByMake[row.make] ??= []).push(row.model);
  }
  return {
    makes: makes[0].map((row) => row.make),
    modelsByMake,
    years: years[0].map((row) => Number(row.year)),
    bodyTypes: bodyTypes[0].map((row) => row.body_type),
  };
};

export const getCarById = async (carId) => {
  const [cars] = await pool.execute("SELECT * FROM cars WHERE id = ? LIMIT 1", [carId]);
  if (!cars.length) throw new AppError(404, "Car not found");

  const [[details], [features], [gallery]] = await Promise.all([
    pool.execute("SELECT description, specs, dealer, vin FROM car_details WHERE car_id = ? LIMIT 1", [carId]),
    pool.execute("SELECT label FROM car_features WHERE car_id = ? ORDER BY sort_order", [carId]),
    pool.execute(
      "SELECT image_url, image_public_id, sort_order FROM car_gallery WHERE car_id = ? ORDER BY sort_order",
      [carId],
    ),
  ]);
  return {
    ...cars[0],
    details: details[0] ?? null,
    features: features.map((row) => row.label),
    gallery,
  };
};

export const getCarAvailability = async (carId, from, to) => {
  const [cars] = await pool.execute("SELECT id FROM cars WHERE id = ? LIMIT 1", [carId]);
  if (!cars.length) throw new AppError(404, "Car not found");
  if (to < from) throw new AppError(400, "Availability end date must be on or after the start date.");

  const [bookedRanges] = await pool.execute(
    `SELECT DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date,
            DATE_FORMAT(end_date, '%Y-%m-%d') AS end_date
     FROM bookings
     WHERE car_id = ? AND status = 'confirmed'
       AND start_date <= ? AND end_date >= ?
     ORDER BY start_date`,
    [carId, to, from],
  );
  return {
    bookedRanges: bookedRanges.map((row) => ({
      startDate: row.start_date,
      endDate: row.end_date,
    })),
  };
};

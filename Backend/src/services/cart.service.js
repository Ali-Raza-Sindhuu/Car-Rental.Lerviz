import pool from "../config/database.js";
import { AppError } from "../lib/errors.js";
import {
  rentalRangesOverlap,
  validateRentalDates,
} from "./rental.rules.js";
import { cartItemSchema } from "../validators/car.validators.js";

const getOrCreateCartId = async (userId, connection = pool) => {
  await connection.execute(
    "INSERT INTO carts (user_id) VALUES (?) ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)",
    [userId],
  );
  const [rows] = await connection.execute("SELECT id FROM carts WHERE user_id = ? LIMIT 1", [userId]);
  return String(rows[0].id);
};

const mapCartItem = (row) => ({
  id: String(row.id),
  listing_type: row.listing_type,
  start_date: row.start_date,
  end_date: row.end_date,
  added_at: row.added_at,
  car: {
    id: row.car_id,
    make: row.make,
    model: row.model,
    year: row.year,
    year_range: row.year_range,
    price: row.price,
    listing_type: row.car_listing_type,
    image_url: row.image_url,
    status: row.status,
  },
});

export const getCart = async (userId) => {
  const cartId = await getOrCreateCartId(userId);
  const [rows] = await pool.execute(
    `SELECT ci.id, ci.listing_type,
            DATE_FORMAT(ci.start_date, '%Y-%m-%d') AS start_date,
            DATE_FORMAT(ci.end_date, '%Y-%m-%d') AS end_date, ci.added_at,
            c.id AS car_id, c.make, c.model, c.year, c.year_range, c.price,
            c.listing_type AS car_listing_type, c.image_url, c.status
     FROM cart_items ci
     JOIN cars c ON c.id = ci.car_id
     WHERE ci.cart_id = ?
     ORDER BY ci.added_at, ci.id`,
    [cartId],
  );
  return { cart: { id: cartId, items: rows.map(mapCartItem) } };
};

const getCarForCart = async (carId) => {
  const [rows] = await pool.execute(
    "SELECT id, listing_type, status FROM cars WHERE id = ? LIMIT 1",
    [carId],
  );
  if (!rows.length) throw new AppError(404, "Car not found");
  return rows[0];
};

const validateCartItem = async (car, item) => {
  if (car.listing_type !== item.listingType) {
    throw new AppError(409, "The selected listing type does not match this car.");
  }
  if (car.status === "sold") throw new AppError(409, "This car has already been sold.");

  if (item.listingType === "buy") {
    if (item.startDate || item.endDate) {
      throw new AppError(400, "Purchase items must not include rental dates.");
    }
    return;
  }

  if (!item.startDate || !item.endDate) {
    throw new AppError(400, "Rental start and end dates are required.");
  }
  const dateError = validateRentalDates({
    startDate: item.startDate,
    endDate: item.endDate,
  });
  if (dateError) throw new AppError(400, dateError);

  const [bookings] = await pool.execute(
    `SELECT DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date,
            DATE_FORMAT(end_date, '%Y-%m-%d') AS end_date
     FROM bookings
     WHERE car_id = ? AND status = 'confirmed'
       AND start_date <= ? AND end_date >= ?`,
    [car.id, item.endDate, item.startDate],
  );
  const requestedRange = { startDate: item.startDate, endDate: item.endDate };
  if (bookings.some((booking) => rentalRangesOverlap(requestedRange, {
    startDate: booking.start_date,
    endDate: booking.end_date,
  }))) {
    throw new AppError(409, "This car is unavailable for the selected rental dates.");
  }
};

const createCartItem = async (userId, item) => {
  const car = await getCarForCart(item.carId);
  await validateCartItem(car, item);
  const cartId = await getOrCreateCartId(userId);
  try {
    const [result] = await pool.execute(
      `INSERT INTO cart_items (cart_id, car_id, listing_type, start_date, end_date)
       VALUES (?, ?, ?, ?, ?)`,
      [
        cartId,
        item.carId,
        item.listingType,
        item.startDate ?? null,
        item.endDate ?? null,
      ],
    );
    const [rows] = await pool.execute(
      `SELECT ci.id, ci.listing_type,
              DATE_FORMAT(ci.start_date, '%Y-%m-%d') AS start_date,
              DATE_FORMAT(ci.end_date, '%Y-%m-%d') AS end_date, ci.added_at,
              c.id AS car_id, c.make, c.model, c.year, c.year_range, c.price,
              c.listing_type AS car_listing_type, c.image_url, c.status
       FROM cart_items ci
       JOIN cars c ON c.id = ci.car_id
       WHERE ci.id = ?`,
      [result.insertId],
    );
    return mapCartItem(rows[0]);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new AppError(409, "Already in your garage");
    }
    throw error;
  }
};

export const addCartItem = (userId, item) => createCartItem(userId, item);

export const mergeCartItems = async (userId, items) => {
  const addedItems = [];
  const skipped = [];
  for (const candidate of items) {
    const parsed = cartItemSchema.safeParse(candidate);
    const carId = typeof candidate?.carId === "string" ? candidate.carId : "unknown";
    if (!parsed.success) {
      skipped.push({ carId, reason: parsed.error.issues[0]?.message || "Invalid cart item." });
      continue;
    }
    try {
      addedItems.push(await createCartItem(userId, parsed.data));
    } catch (error) {
      if (error instanceof AppError && error.status >= 400 && error.status < 500) {
        skipped.push({ carId: parsed.data.carId, reason: error.message });
        continue;
      }
      throw error;
    }
  }
  return { added: addedItems.length, skipped };
};

export const removeCartItem = async (userId, itemId) => {
  const cartId = await getOrCreateCartId(userId);
  const [result] = await pool.execute(
    "DELETE FROM cart_items WHERE id = ? AND cart_id = ?",
    [itemId, cartId],
  );
  if (!result.affectedRows) throw new AppError(404, "Cart item not found");
};

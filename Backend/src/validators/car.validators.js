import { z } from "zod";
import { isValidCalendarDate } from "../services/rental.rules.js";

const date = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")
  .refine(isValidCalendarDate, "Use a valid calendar date");
const optionalText = z.string().trim().optional();
const optionalNumber = z.coerce.number().finite().nonnegative().optional();

export const carListQuerySchema = z.object({
  condition: z.enum(["new", "used"]).optional(),
  listingType: z.enum(["buy", "rent"]).optional(),
  make: optionalText,
  model: optionalText,
  year: z.coerce.number().int().min(1886).max(2200).optional(),
  minPrice: optionalNumber,
  maxPrice: optionalNumber,
  bodyType: optionalText,
  fuel: optionalText,
  transmission: optionalText,
  colour: optionalText,
  minYear: z.coerce.number().int().min(1886).max(2200).optional(),
  maxYear: z.coerce.number().int().min(1886).max(2200).optional(),
  maxMileage: optionalNumber,
  sort: z.enum(["newest", "price-asc", "price-desc", "year"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(9),
});

export const carIdSchema = z.string().min(1).max(64);

export const availabilityQuerySchema = z.object({
  from: date,
  to: date,
});

export const cartItemSchema = z.object({
  carId: carIdSchema,
  listingType: z.enum(["buy", "rent"]),
  startDate: date.optional(),
  endDate: date.optional(),
});

export const addCartItemSchema = cartItemSchema;

export const mergeCartSchema = z.object({
  items: z.array(z.unknown()).max(100),
});

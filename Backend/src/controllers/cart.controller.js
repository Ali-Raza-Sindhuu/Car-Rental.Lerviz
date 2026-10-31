import { AppError } from "../lib/errors.js";
import {
  addCartItem,
  getCart,
  mergeCartItems,
  removeCartItem,
} from "../services/cart.service.js";
import { addCartItemSchema, mergeCartSchema } from "../validators/car.validators.js";

const parse = (schema, value) => {
  const result = schema.safeParse(value);
  if (!result.success) {
    const errors = {};
    for (const issue of result.error.issues) {
      const field = issue.path.join(".") || "body";
      errors[field] ??= issue.message;
    }
    throw new AppError(400, "Validation failed", errors);
  }
  return result.data;
};

export const getCartController = async (req, res) => {
  res.status(200).json(await getCart(req.userId));
};

export const addCartItemController = async (req, res) => {
  const item = parse(addCartItemSchema, req.body);
  res.status(201).json({ item: await addCartItem(req.userId, item) });
};

export const mergeCartController = async (req, res) => {
  const body = parse(mergeCartSchema, req.body);
  res.status(200).json(await mergeCartItems(req.userId, body.items));
};

export const removeCartItemController = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) throw new AppError(400, "Invalid cart item id");
  await removeCartItem(req.userId, id);
  res.status(200).json({ message: "Cart item removed." });
};

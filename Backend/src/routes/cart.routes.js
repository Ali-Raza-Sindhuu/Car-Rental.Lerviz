import { Router } from "express";
import {
  addCartItemController,
  getCartController,
  mergeCartController,
  removeCartItemController,
} from "../controllers/cart.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);
router.get("/", getCartController);
router.post("/items", addCartItemController);
router.post("/merge", mergeCartController);
router.delete("/items/:id", removeCartItemController);

export default router;

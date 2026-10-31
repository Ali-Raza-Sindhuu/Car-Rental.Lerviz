import { Router } from "express";
import {
  carAvailabilityController,
  carDetailsController,
  carFacetsController,
  listCarsController,
} from "../controllers/cars.controller.js";
import { validateQuery } from "../middleware/validate.js";
import {
  availabilityQuerySchema,
  carListQuerySchema,
} from "../validators/car.validators.js";

const router = Router();

router.get("/", validateQuery(carListQuerySchema), listCarsController);
router.get("/facets", carFacetsController);
router.get("/:id/availability", validateQuery(availabilityQuerySchema), carAvailabilityController);
router.get("/:id", carDetailsController);

export default router;

import {
  getCarAvailability,
  getCarById,
  getCarFacets,
  listCars,
} from "../services/cars.service.js";
import { AppError } from "../lib/errors.js";
import { carIdSchema } from "../validators/car.validators.js";

const parseCarId = (value) => {
  const result = carIdSchema.safeParse(value);
  if (!result.success) throw new AppError(400, "Invalid car id");
  return result.data;
};

export const listCarsController = async (req, res) => {
  res.status(200).json(await listCars(req.validatedQuery));
};

export const carFacetsController = async (req, res) => {
  res.status(200).json(await getCarFacets());
};

export const carDetailsController = async (req, res) => {
  res.status(200).json(await getCarById(parseCarId(req.params.id)));
};

export const carAvailabilityController = async (req, res) => {
  res.status(200).json(
    await getCarAvailability(parseCarId(req.params.id), req.validatedQuery.from, req.validatedQuery.to),
  );
};

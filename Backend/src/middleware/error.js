import { AppError } from "../lib/errors.js";

export const notFound = (req, res, next) => {
  next(new AppError(404, "Route not found"));
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 600
    ? error.status
    : 500;
  if (status === 500) console.error("[api-error]", error);

  const message = status === 500 ? "Internal server error" : error.message;
  const response = { message, error: { message } };
  if (error.errors) response.errors = error.errors;
  res.status(status).json(response);
};

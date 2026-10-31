import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes.js";
import carRoutes from "./routes/cars.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { validateMailConfiguration } from "./services/mail.service.js";
import { configureCloudinary } from "./config/cloudinary.js";

const missingRequiredEnvironment = [
  !process.env.JWT_SECRET && "JWT_SECRET",
  !process.env.GOOGLE_CLIENT_ID && "GOOGLE_CLIENT_ID",
  !process.env.CLOUDINARY_CLOUD_NAME && "CLOUDINARY_CLOUD_NAME",
  !process.env.CLOUDINARY_API_KEY && "CLOUDINARY_API_KEY",
  !process.env.CLOUDINARY_API_SECRET && "CLOUDINARY_API_SECRET",
].filter(Boolean);
if (missingRequiredEnvironment.length) {
  throw new Error(`Missing required environment variable(s): ${missingRequiredEnvironment.join(", ")}`);
}
validateMailConfiguration();
configureCloudinary();

const app = express();
const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(helmet());
app.use(cors({ origin: frontendOrigin, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
app.use("/api/cars", carRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api", authRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;

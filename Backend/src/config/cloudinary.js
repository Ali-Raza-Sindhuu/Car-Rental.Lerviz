import { v2 as cloudinary } from "cloudinary";

export const validateCloudinaryConfiguration = () => {
  const missing = [
    !process.env.CLOUDINARY_CLOUD_NAME && "CLOUDINARY_CLOUD_NAME",
    !process.env.CLOUDINARY_API_KEY && "CLOUDINARY_API_KEY",
    !process.env.CLOUDINARY_API_SECRET && "CLOUDINARY_API_SECRET",
  ].filter(Boolean);
  if (missing.length) {
    throw new Error(`Missing required environment variable(s): ${missing.join(", ")}`);
  }
};

export const configureCloudinary = () => {
  validateCloudinaryConfiguration();
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
};

export default cloudinary;

import dotenv from "dotenv";

dotenv.config({ quiet: true });

// Key-value pairs for environment variables
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  CLIENT_URL: process.env.CLIENT_URL,
  GOOGLE_ADDRESS_API_KEY: process.env.GOOGLE_ADDRESS_API_KEY,
  GOOGLE_ADDRESS_API_BASE_URL: process.env.GOOGLE_ADDRESS_API_BASE_URL,
};

// Validate required environment variables
const required = [
  "DB_URL",
  "CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "INNGEST_SIGNING_KEY",
  "ADMIN_EMAIL",
  "CLIENT_URL",
  "GOOGLE_ADDRESS_API_KEY",
  "GOOGLE_ADDRESS_API_BASE_URL",
  "STRIPE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY",
];

const missing = required.filter((key) => !ENV[key]);
if (missing.length) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
}

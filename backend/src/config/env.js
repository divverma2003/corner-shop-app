import dotenv from "dotenv";

dotenv.config({ quiet: true });

// Key-value pairs for environment variables
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  CLIENT_URL: process.env.CLIENT_URL,
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
];

const missing = required.filter((key) => !ENV[key]);
if (missing.length) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
}

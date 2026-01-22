import dotenv from "dotenv";

dotenv.config();

// Key-value pairs for environment variables
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
};

// Validate required environment variables
const required = ["DB_URL"];
const missing = required.filter((key) => !ENV[key]);
if (missing.length) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
}

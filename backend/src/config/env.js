import dotenv from "dotenv";

dotenv.config();

// Key-value pairs for environment variables
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
};

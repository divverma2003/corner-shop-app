import mongoose from "mongoose";
import { ENV } from "./env.js";

// Connect to MongoDB
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.DB_URL);
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MONGODB Connection error: ${error}`);
    process.exit(1); // Exit process with failure
  }
};

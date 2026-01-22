import express from "express";
import path from "path";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();
const __dirname = path.resolve();

app.use(clerkMiddleware()); // adds auth object to request => req.auth
// test route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API success" });
});

// deployment for frontend
// serve static files and index.html in production
// this will allow the frontend and backend to be hosted on the same domain
if (ENV.NODE_ENV !== "development") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));

  // display index.html for any route not handled by the backend
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
  });
}

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
  connectDB();
});

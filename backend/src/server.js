import express from "express";
import path from "path";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./config/inngest.js";
import adminRoutes from "./routes/admin.route.js";

const app = express();
const __dirname = path.resolve();

app.use(clerkMiddleware()); // adds auth object to request => req.auth
app.use(express.json());

app.use("/api/inngest", serve({ client: inngest, functions }));
// test route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API success" });
});
app.use("/api/admin", adminRoutes);
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

const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
  });
};

startServer();

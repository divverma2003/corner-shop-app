import express from "express";
import path from "path";
import cors from "cors";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./config/inngest.js";

import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js";
import orderRoutes from "./routes/order.route.js";
import reviewRoutes from "./routes/review.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";

const app = express();
const __dirname = path.resolve();

app.use(clerkMiddleware()); // adds auth object to request => req.auth
app.use(express.json());
// enable CORS for frontend-backend communication
// this will allow requests from the frontend domain to access backend resources
// credentials: true allows cookies to be sent with requests to the server
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use("/api/inngest", serve({ client: inngest, functions }));
// test route

app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
// deployment for frontend
// serve static files and index.html in production
// this will allow the frontend and backend to be hosted on the same domain

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API success" });
});
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

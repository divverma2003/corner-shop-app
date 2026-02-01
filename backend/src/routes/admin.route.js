import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getAllCustomers,
  getAllOrders,
  getDashboardStats,
  updateProduct,
  updateOrderStatus,
  deleteProduct,
} from "../controllers/admin.controller.js";

import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();

// code optimization
router.use(protectRoute, adminOnly);

router.post("/products", upload.array("images", 3), createProduct); // each product can use a max of 3 images ("images" is our chosen key)
router.get("/products", getAllProducts);
router.put("/products/:productId", upload.array("images", 3), updateProduct);
router.get("/orders", getAllOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);
router.delete("/products/:productId", deleteProduct);
router.get("/customers", getAllCustomers);
router.get("/stats", getDashboardStats);
export default router;

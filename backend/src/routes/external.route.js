import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { validateAddress } from "../controllers/external.controllers.js";

const router = Router();

// router.use(protectRoute);

router.post("/validate-address", validateAddress);

export default router;

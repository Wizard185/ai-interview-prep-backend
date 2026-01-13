import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middlewares.js";
import { requireRole } from "../middlewares/role.middlewares.js";
import { getAllUsers } from "../controllers/admin.controllers.js";

const router = Router();

/**
 * Admin-only route
 */
router.get(
  "/users",
  requireAuth,
  requireRole("admin"),
  getAllUsers
);

export default router;

import { Router } from "express";
import { getMe } from "../controllers/user.controllers.js";
import { requireAuth } from "../middlewares/auth.middlewares.js";

const router = Router();

router.get("/me", requireAuth, getMe);

export default router;

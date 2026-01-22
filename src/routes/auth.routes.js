import { Router } from "express";
import { register, login, refresh, logout } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { registerSchema, loginSchema } from "../validators/auth.schemas.js";
import { authLimiter} from "../middlewares/limits/authLimiter.js"
import { requireAuth } from "../middlewares/auth.middlewares.js";
import { logoutAll } from "../controllers/auth.controllers.js";
const router = Router();

router.post("/register",authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter,validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/logout-all", requireAuth, logoutAll);

export default router;

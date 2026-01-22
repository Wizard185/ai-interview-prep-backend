import { Router } from "express";
import { validate } from "../middlewares/validate.middlewares.js";
import { getMe } from "../controllers/user.controllers.js";
import { requireAuth } from "../middlewares/auth.middlewares.js";
import { changeUserPassword } from "../controllers/user.controllers.js";
import { changePasswordSchema } from "../validators/user.schemas.js";
const router = Router();

router.get("/me", requireAuth, getMe);
router.patch(
  "/change-password",
  requireAuth,
  validate(changePasswordSchema),
  changeUserPassword
);

export default router;

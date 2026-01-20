import { Router } from "express";
import { getMe, changePassword } from "../controllers/user.controllers.js";
import { requireAuth } from "../middlewares/auth.middlewares.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { changePasswordSchema, updateFullNameSchema, } from "../validators/user.schemas.js";
import { updateFullName } from "../controllers/user.controllers.js";
const router = Router();

router.get("/me", requireAuth, getMe);
router.patch(
    "/change-password",
    requireAuth,
    validate(changePasswordSchema),
    changePassword
  );
  router.patch(
    "/update-name",
    requireAuth,
    validate(updateFullNameSchema),
    updateFullName
  );

export default router;

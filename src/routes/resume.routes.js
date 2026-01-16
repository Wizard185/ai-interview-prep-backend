import { Router } from "express";
import { analyzeResume } from "../controllers/resume.controllers.js";
import { uploadResume } from "../middlewares/upload.middlewares.js";
import { requireAuth } from "../middlewares/auth.middlewares.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { resumeAnalysisSchema } from "../validators/resume.schemas.js";
import { apiLimiter } from "../middlewares/limits/apiLimiter.js";

const router = Router();

router.post(
  "/analyze",
  requireAuth,
  apiLimiter,
  uploadResume,                 // MUST be before validate
  validate(resumeAnalysisSchema),
  analyzeResume
);



export default router;

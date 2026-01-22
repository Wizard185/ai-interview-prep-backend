import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middlewares.js";

import {
  getAnalysisHistory,
  deleteAnalysisById,
  deleteAllAnalysisHistory,
} from "../controllers/analysis.controllers.js";
const router = Router();

/**
 * User analysis history
 */
router.get("/history", requireAuth, getAnalysisHistory);
router.get("/history", requireAuth, getAnalysisHistory);
router.delete("/:id", requireAuth, deleteAnalysisById);
router.delete("/", requireAuth, deleteAllAnalysisHistory);

export default router;

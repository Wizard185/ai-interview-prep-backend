import { Router } from "express";
import { healthCheck } from "../controllers/healthcare.controllers.js";

const router = Router();    //healthcare router

router.get("/", healthCheck);

export default router;

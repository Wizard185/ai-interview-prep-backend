import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import cookieParser from "cookie-parser";
import { apiLimiter } from "./middlewares/limits/apiLimiter.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js"
import resumeRoutes from "./routes/resume.routes.js"
import analysisRoutes from "./routes/analysis.routes.js";


const app = express();
app.set("trust proxy", 1);

app.use(cors({
  origin: [
        "https://atswizard.vercel.app",
       "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api",apiLimiter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/resume", resumeRoutes);
app.use("/api/v1/analysis", analysisRoutes);




app.use(errorHandler);
export {app};
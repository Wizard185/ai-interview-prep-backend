import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
const app = express();

app.use(cors(
    {
        origin: true,
        credentials: true,
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);
export {app};
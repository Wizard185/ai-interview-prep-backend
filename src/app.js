import express from "express";
import cors from "cors";
import { env } from "./config/env.js";

const app = express();

app.use(cors(
    {
        origin: "*",
        credentials: true,
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import healthcareRouter from "./routes/healthcare.routes.js";

app.use("/api/v1/health", healthcareRouter);

export {app};
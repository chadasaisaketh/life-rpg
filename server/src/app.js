import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./modules/auth/auth.routes.js";
import habitsRoutes from "./modules/habits/habits.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/habits", habitsRoutes); // 🔥 THIS WAS MISSING

export default app;

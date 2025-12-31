import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import habitsRoutes from "./modules/habits/habits.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/habits", habitsRoutes);

export default router;

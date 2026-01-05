import express from "express";

import authRoutes from "./modules/auth/auth.routes.js";
import habitsRoutes from "./modules/habits/habits.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import skillsRoutes from "./modules/skills/skills.routes.js";
import workoutsRoutes from "./modules/workouts/workouts.routes.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/habits", habitsRoutes);
router.use("/users", userRoutes);
router.use("/skills", skillsRoutes);
router.use("/workouts", workoutsRoutes);
export default router;

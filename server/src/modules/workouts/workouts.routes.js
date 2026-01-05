import express from "express";
import auth from "../../middleware/authMiddleware.js";
import {
  addWorkout,
  getWeeklyWorkouts,
  getMuscleHeatmap,
} from "./workouts.controller.js";
import { getAvatarStats } from "./workouts.controller.js";
import { getMuscleBalance } from "./workouts.controller.js";

const router = express.Router();

router.post("/", auth, addWorkout);
router.get("/week", auth, getWeeklyWorkouts);
router.get("/muscles/week", auth, getMuscleHeatmap);
router.get("/avatar-stats", auth, getAvatarStats);
router.get("/balance", auth, getMuscleBalance);

export default router;

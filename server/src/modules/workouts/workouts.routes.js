import express from "express";
import auth from "../../middleware/authMiddleware.js";
import {
  addWorkout,
  getWeeklyWorkouts,
  getMuscleHeatmap,
} from "./workouts.controller.js";

const router = express.Router();

router.post("/", auth, addWorkout);
router.get("/week", auth, getWeeklyWorkouts);
router.get("/muscles/week", auth, getMuscleHeatmap);

export default router;

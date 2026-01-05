import express from "express";
import auth from "../../middleware/authMiddleware.js";
import {
  getTargets,
  saveTargets,
  addMeal,
  getTodaySummary,
  getWeekSummary,
} from "./nutrition.controller.js";

const router = express.Router();

router.get("/targets", auth, getTargets);
router.post("/targets", auth, saveTargets);

router.post("/meal", auth, addMeal);
router.get("/today", auth, getTodaySummary);
router.get("/week", auth, getWeekSummary);

export default router;

import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";

import {
  createHabit,
  logHabitAction,
  getTodayHabits,
  getWeekHabits,
  getWeekCategorySummary,
  getMonthCategorySummary,
} from "./habits.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createHabit);
router.post("/log", authMiddleware, logHabitAction);

router.get("/today", authMiddleware, getTodayHabits);
router.get("/week/habits", authMiddleware, getWeekHabits);

router.get("/week/categories", authMiddleware, getWeekCategorySummary);
router.get("/month/categories", authMiddleware, getMonthCategorySummary);

export default router;

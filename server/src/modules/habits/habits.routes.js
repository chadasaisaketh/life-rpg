import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import {
  createHabit,
  logHabitAction,
  getTodayHabits,
} from "./habits.controller.js";

const router = express.Router();

/**
 * POST /api/habits
 * Create a habit (definition)
 */
router.post("/", authMiddleware, createHabit);

/**
 * POST /api/habits/log
 * Log daily habit action (done / skipped / did / resisted)
 */
router.post("/log", authMiddleware, logHabitAction);

/**
 * GET /api/habits/today
 * Get today's habits with status
 */
router.get("/today", authMiddleware, getTodayHabits);

export default router;

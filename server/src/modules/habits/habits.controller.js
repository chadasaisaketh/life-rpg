import * as habitsService from "./habits.service.js";

/**
 * Create a habit
 */
export async function createHabit(req, res, next) {
  try {
    const habit = await habitsService.createHabit(
      req.user.id,
      req.body
    );
    res.status(201).json(habit);
  } catch (err) {
    next(err);
  }
}

/**
 * Log habit action
 */
export async function logHabitAction(req, res, next) {
  try {
    const result = await habitsService.logHabitAction(
      req.user.id,
      req.body
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * Get today's habits
 */
export async function getTodayHabits(req, res, next) {
  try {
    const habits = await habitsService.getTodayHabits(
      req.user.id
    );
    res.json(habits);
  } catch (err) {
    next(err);
  }
}

/**
 * Weekly habit grid (per habit, per day)
 */
export async function getWeekHabits(req, res, next) {
  try {
    const { start } = req.query;

    if (!start) {
      return res.status(400).json({
        error: "start date (YYYY-MM-DD) required",
      });
    }

    const data = await habitsService.getWeekHabits(
      req.user.id,
      start
    );

    res.json(data);
  } catch (err) {
    next(err);
  }
}

/**
 * Weekly category summary
 */
export async function getWeekCategorySummary(req, res, next) {
  try {
    const { start } = req.query;

    if (!start) {
      return res.status(400).json({
        error: "start date (YYYY-MM-DD) required",
      });
    }

    const data = await habitsService.getWeekCategorySummary(
      req.user.id,
      start
    );

    res.json(data);
  } catch (err) {
    next(err);
  }
}

/**
 * Monthly category summary
 */
export async function getMonthCategorySummary(req, res, next) {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({
        error: "month (YYYY-MM) required",
      });
    }

    const data = await habitsService.getMonthCategorySummary(
      req.user.id,
      month
    );

    res.json(data);
  } catch (err) {
    next(err);
  }
}

import * as habitsService from "./habits.service.js";

/**
 * Create a habit (definition)
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
 * Log a habit action for today
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

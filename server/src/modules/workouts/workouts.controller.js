import * as service from "./workouts.service.js";

export async function addWorkout(req, res, next) {
  try {
    const result = await service.addWorkout(req.user.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getWeeklyWorkouts(req, res, next) {
  try {
    const data = await service.getWeeklyWorkouts(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
export async function getMuscleHeatmap(req, res, next) {
  try {
    const data = await service.getWeeklyMuscleHeatmap(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
export async function getAvatarStats(req, res, next) {
  try {
    const stats = await service.getAvatarStats(req.user.id);
    res.json(stats);
  } catch (err) {
    next(err);
  }
}
export async function getMuscleBalance(req, res, next) {
  try {
    const data = await service.getMuscleBalance(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

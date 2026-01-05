import * as service from "./nutrition.service.js";

export async function getTargets(req, res, next) {
  try {
    res.json(await service.getTargets(req.user.id));
  } catch (e) {
    next(e);
  }
}

export async function saveTargets(req, res, next) {
  try {
    res.json(await service.saveTargets(req.user.id, req.body));
  } catch (e) {
    next(e);
  }
}

export async function addMeal(req, res, next) {
  try {
    await service.addMeal(req.user.id, req.body);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
}

export async function getTodaySummary(req, res, next) {
  try {
    res.json(await service.getTodaySummary(req.user.id));
  } catch (e) {
    next(e);
  }
}

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

export async function addMeal(req, res) {
  await service.addMeal(req.user.id, req.body);

  const xpResult = await awardNutritionXP(req.user.id);

  res.json({ success: true, xp: xpResult.xp });
}


export async function getTodaySummary(req, res, next) {
  try {
    res.json(await service.getTodaySummary(req.user.id));
  } catch (e) {
    next(e);
  }
}
export async function getWeekSummary(req, res) {
  const { start } = req.query;
  res.json(await service.getWeekSummary(req.user.id, start));
}

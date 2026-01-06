import * as service from "./spiritual.service.js";

export async function addPractice(req, res) {
  const result = await service.addPractice(req.user.id, req.body);
  res.json(result);
}

export async function getToday(req, res) {
  res.json(await service.getTodaySummary(req.user.id));
}

export async function getStreak(req, res) {
  res.json({ streak: await service.getStreak(req.user.id) });
}

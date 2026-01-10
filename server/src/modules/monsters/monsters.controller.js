import { getMonsters as getAllMonsters } from "./monsters.service.js";

export async function getMonsters(req, res, next) {
  try {
    const monsters = await getAllMonsters(req.user.id);
    res.json(monsters);
  } catch (err) {
    next(err);
  }
}

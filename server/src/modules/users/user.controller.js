import * as userService from "./user.service.js";

export async function getProfile(req, res, next) {
  try {
    const user = await userService.getProfile(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const updated = await userService.updateProfile(
      req.user.id,
      req.body
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

import * as service from "./skills.service.js";

export async function createSkill(req, res, next) {
  try {
    const { name, components } = req.body;
    const skill = await service.createSkill(req.user.id, name, components);
    res.json(skill);
  } catch (e) {
    next(e);
  }
}

export async function getActiveSkills(req, res, next) {
  res.json(await service.getActiveSkills(req.user.id));
}

export async function getCompletedSkills(req, res, next) {
  res.json(await service.getCompletedSkills(req.user.id));
}

export async function completeComponent(req, res, next) {
  const { componentId, skillId } = req.body;
  res.json(
    await service.completeComponent(req.user.id, componentId, skillId)
  );

  
}
export async function getSkillComponents(req, res, next) {
  try {
    const components = await service.getSkillComponents(
      req.params.skillId
    );
    res.json(components);
  } catch (err) {
    next(err);
  }
}


import api from "./api";

/* ---------------- ACTIVE SKILLS ---------------- */
export const getActiveSkills = async () => {
  const res = await api.get("/skills/active");
  return res.data;
};

/* ---------------- COMPLETED SKILLS ---------------- */
export const getCompletedSkills = async () => {
  const res = await api.get("/skills/completed");
  return res.data;
};

/* ---------------- CREATE SKILL ---------------- */
export const createSkill = async (data) => {
  const res = await api.post("/skills", data);
  return res.data;
};

/* ---------------- GET SKILL COMPONENTS ---------------- */
export const getSkillComponents = async (skillId) => {
  const res = await api.get(`/skills/${skillId}/components`);
  return res.data;
};

/* ---------------- COMPLETE COMPONENT ---------------- */
export const completeComponent = async ({ componentId, skillId }) => {
  const res = await api.post("/skills/complete", {
    componentId,
    skillId,
  });
  return res.data;
};

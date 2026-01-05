import api from "./api";

export const getTargets = async () => {
  const res = await api.get("/nutrition/targets");
  return res.data;
};

export const saveTargets = async (data) => {
  const res = await api.post("/nutrition/targets", data);
  return res.data;
};

export const getTodaySummary = async () => {
  const res = await api.get("/nutrition/today");
  return res.data;
};

export const addMeal = async (data) => {
  const res = await api.post("/nutrition/meal", data);
  return res.data;
};

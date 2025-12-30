import api from "./api";

/* GET today habits (planning) */
export const getTodayHabits = async () => {
  const res = await api.get("/habits/today");
  return res.data;
};
export const getWeekHabits = () =>
  api.get("/habits/week").then(res => res.data);

export const addHabit = (data) =>
  api.post("/habits", data);

/* LOG habit completion / skip */
export const logHabit = async ({ habitId, completed }) => {
  const res = await api.post("/habits/log", {
    habitId,
    completed,
  });
  return res.data;
};

/* GET weekly stats */
export const getWeeklyStats = async () => {
  const res = await api.get("/habits/week");
  return res.data;
};

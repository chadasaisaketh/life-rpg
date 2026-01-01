import api from "./api";

/* GET today's habits */
export const getTodayHabits = async () => {
  const res = await api.get("/habits/today");
  return res.data;
};

/* ADD habit (definition) */
export const addHabit = async (data) => {
  const res = await api.post("/habits", data);
  return res.data;
};

/* LOG habit action */
export const logHabit = async ({
  habit_id,
  status,
  type,
  difficulty,
}) => {
  const res = await api.post("/habits/log", {
    habit_id,
    status,
    type,
    difficulty,
  });
  return res.data; // { xp }
};
/**
 * Get weekly habits with logs
 */
/* GET weekly habits grid */
export const getWeekHabits = async (startDate) => {
  const res = await api.get("/habits/week/habits", {
    params: { start: startDate },
  });
  return res.data;
};

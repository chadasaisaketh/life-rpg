import api from "./api";

export const addWorkout = async (data) => {
  const res = await api.post("/workouts", data);
  return res.data;
};

export const getWeeklyWorkouts = async () => {
  const res = await api.get("/workouts/week");
  return res.data;
};
export const getMuscleHeatmap = async () => {
  const res = await api.get("/workouts/muscles/week");
  return res.data;
};

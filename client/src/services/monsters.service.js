import api from "./api";

export async function getMonsters() {
  const res = await api.get("/monsters");
  return res.data;
}

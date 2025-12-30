import { registerUser, loginUser } from "./auth.service.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await registerUser(name, email, password);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

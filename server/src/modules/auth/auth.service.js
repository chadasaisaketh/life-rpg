import  db  from "../../config/db.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import { generateToken } from "../../utils/jwt.js";

export const registerUser = async (name, email, password) => {
  const hashed = await hashPassword(password);

  await db.run(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, hashed]
  );

  return { message: "User registered successfully" };
};

export const loginUser = async (email, password) => {
  const user = await db.get(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (!user) throw new Error("User not found");

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) throw new Error("Invalid credentials");

  const token = generateToken({ id: user.id, email: user.email });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

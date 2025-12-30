import { useState } from "react";
import { motion } from "framer-motion";
import { login, register } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const { login: loginUser } = useAuth();   // ✅ FIXED
  const navigate = useNavigate();           // ✅ WILL BE USED

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        const data = await login(form.email, form.password);
        loginUser(data);                     // save user + token
        navigate("/dashboard");              // ✅ REDIRECT
      } else {
        await register(form.name, form.email, form.password);
        setMode("login");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg flex items-center justify-center relative overflow-hidden">

      {/* Neon Orbs */}
      <div className="absolute w-[500px] h-[500px] bg-neonPurple/30 blur-[140px] -top-40 -left-40" />
      <div className="absolute w-[400px] h-[400px] bg-neonBlue/30 blur-[140px] bottom-[-120px] right-[-120px]" />

      {/* Portal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md p-[2px] rounded-2xl
                   bg-gradient-to-r from-neonPurple via-neonBlue to-neonPink"
      >
        <div className="bg-cardBg rounded-2xl p-8 shadow-neon">

          <h1 className="text-center text-2xl font-bold tracking-widest text-neonBlue mb-2">
            {mode === "login" ? "ENTER THE REALM" : "CREATE AVATAR"}
          </h1>

          <p className="text-center text-gray-400 text-sm mb-6">
            Life is the game. Discipline is XP.
          </p>

          {error && (
            <p className="text-center text-red-400 text-sm mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {mode === "signup" && (
              <input
                name="name"
                placeholder="Avatar Name"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-black/60 text-white
                           border border-white/10 focus:border-neonBlue
                           focus:shadow-neon outline-none"
              />
            )}

            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-black/60 text-white
                         border border-white/10 focus:border-neonBlue
                         focus:shadow-neon outline-none"
            />

            <input
              name="password"
              type="password"
              placeholder="Secret Key"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-black/60 text-white
                         border border-white/10 focus:border-neonPurple
                         focus:shadow-neon outline-none"
            />

            <button
              type="submit"
              className="w-full mt-4 py-3 rounded-xl font-semibold tracking-widest
                         bg-gradient-to-r from-neonPurple to-neonBlue
                         text-black shadow-neonStrong hover:scale-105 transition"
            >
              {mode === "login" ? "ENTER" : "CREATE"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            {mode === "login" ? (
              <>
                New player?{" "}
                <span
                  onClick={() => setMode("signup")}
                  className="text-neonPurple cursor-pointer"
                >
                  Create Avatar
                </span>
              </>
            ) : (
              <>
                Already initiated?{" "}
                <span
                  onClick={() => setMode("login")}
                  className="text-neonBlue cursor-pointer"
                >
                  Enter Realm
                </span>
              </>
            )}
          </p>

        </div>
      </motion.div>
    </div>
  );
}

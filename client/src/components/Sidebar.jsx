import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-64 bg-cardBg border-r border-white/10 p-4 flex flex-col">
      <h2 className="text-neonPurple text-xl font-bold tracking-widest mb-6">
        LIFE RPG
      </h2>

      <nav className="flex flex-col gap-2 flex-1">
        {[
          "Dashboard",
          "Habits",
          "Learnings",
          "Body",
          "Nutrition",
          "Spiritual",
          "Monsters",
          "Achievements",
          "Profile",
        ].map((name) => (
          <NavLink
            key={name}
            to={`/${name.toLowerCase()}`}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-neonPurple/20 text-neonPurple shadow-neon"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            {name}
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition"
      >
        Logout
      </button>
    </aside>
  );
}

import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Habits", path: "/habits" },
  { name: "Learnings", path: "/learnings" },
  { name: "Body", path: "/body" },
  { name: "Nutrition", path: "/nutrition" },
  { name: "Spiritual", path: "/spiritual" },
  { name: "Monsters", path: "/monsters" },
  { name: "Achievements", path: "/achievements" },
  { name: "Profile", path: "/profile" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-cardBg border-r border-white/10 p-4 flex flex-col">
      <h2 className="text-neonPurple text-xl font-bold tracking-widest mb-6">
        LIFE RPG
      </h2>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition
               ${
                 isActive
                   ? "bg-neonPurple/20 text-neonPurple shadow-neon"
                   : "text-gray-400 hover:text-white hover:bg-white/5"
               }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

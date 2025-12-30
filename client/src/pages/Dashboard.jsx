import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-darkBg text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {user?.name || "Player"}
      </h1>

      <p className="text-gray-400 mb-6">
        This is your Life RPG Dashboard.
      </p>

      <button
        onClick={logout}
        className="px-6 py-3 rounded-xl bg-neonPurple text-black font-semibold"
      >
        Logout
      </button>
    </div>
  );
}

import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold">Welcome, {user.name} 👑</h1>
      <p className="mt-2 text-gray-400">Life RPG Dashboard</p>

      <button
        onClick={logout}
        className="mt-6 bg-red-600 px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

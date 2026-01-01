import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import HabitItem from "../components/HabitItem";
import AddHabitModal from "../components/AddHabitModal";
import WeekView from "../components/WeekView";
import {
  getTodayHabits,
  addHabit,
  logHabit,
} from "../services/habit.service";

export default function Habits() {
  const { user, updateXP } = useAuth();

  const [view, setView] = useState("day");
  const [showModal, setShowModal] = useState(false);
  const [habits, setHabits] = useState([]);
  const [xpFlash, setXpFlash] = useState(null);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    const data = await getTodayHabits();
    setHabits(data);
  };

  const handleAddHabit = async (habit) => {
    await addHabit(habit);
    fetchHabits();
  };

  const handleAction = async (habit, action) => {
    const res = await logHabit({
      habit_id: habit.id,
      status: action,
      type: habit.type,
      difficulty: habit.difficulty,
    });

    // 🔥 GLOBAL XP UPDATE
    if (res.xp !== 0) {
      updateXP(res.total_xp);
      setXpFlash(`${res.xp > 0 ? "+" : ""}${res.xp} XP`);
      setTimeout(() => setXpFlash(null), 800);
    }

    // Remove habit from today view
    setHabits((prev) => prev.filter((h) => h.id !== habit.id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-neonPurple">Habits</h1>

        <div className="flex gap-4 items-center">
          <span className="text-neonBlue font-semibold">
            Total XP: {user?.total_xp ?? 0}
          </span>

          <div className="flex gap-2">
            {["day", "week", "month"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-lg ${
                  view === v
                    ? "bg-neonPurple text-black"
                    : "bg-white/10 text-gray-400"
                }`}
              >
                {v.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {xpFlash && (
        <div className="fixed top-20 right-10 text-green-400 text-xl font-bold animate-pulse">
          {xpFlash}
        </div>
      )}

      {view === "day" && (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="mb-4 px-4 py-2 bg-neonBlue text-black font-semibold rounded-lg"
          >
            + Add Habit
          </button>

          <div className="flex flex-col gap-4">
            {habits.length === 0 && (
              <p className="text-gray-400">No habits planned for today.</p>
            )}

            {habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onAction={(action) => handleAction(habit, action)}
              />
            ))}
          </div>
        </>
      )}

      {view === "week" && <WeekView data={[]} />}

      {showModal && (
        <AddHabitModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddHabit}
        />
      )}
    </div>
  );
}

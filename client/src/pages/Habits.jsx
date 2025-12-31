import { useEffect, useState } from "react";
import HabitItem from "../components/HabitItem";
import AddHabitModal from "../components/AddHabitModal";
import WeekView from "../components/WeekView";
import {
  getTodayHabits,
  addHabit,
  logHabit,
} from "../services/habit.service";

export default function Habits() {
  const [view, setView] = useState("day");
  const [showModal, setShowModal] = useState(false);
  const [habits, setHabits] = useState([]);
  const [dailyXP, setDailyXP] = useState(0);
  const [xpFlash, setXpFlash] = useState(null);

  /* FETCH TODAY HABITS */
  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    const data = await getTodayHabits();
    setHabits(data);
  };

  /* ADD HABIT */
  const handleAddHabit = async (habit) => {
    await addHabit(habit);
    fetchHabits();
  };

  /* LOG HABIT ACTION */
  const handleAction = async (habit, action) => {
    const res = await logHabit({
      habit_id: habit.id,
      status: action,
      type: habit.type,
      difficulty: habit.difficulty,
    });

    if (res.xp > 0) {
      setDailyXP((xp) => xp + res.xp);
      setXpFlash(`+${res.xp} XP`);
      setTimeout(() => setXpFlash(null), 800);
    }

    fetchHabits();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-neonPurple">
          Habits
        </h1>

        <div className="flex gap-4 items-center">
          <span className="text-neonBlue font-semibold">
            Today XP: {dailyXP}
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

      {/* XP Flash */}
      {xpFlash && (
        <div className="fixed top-20 right-10 text-green-400 text-xl font-bold animate-pulse">
          {xpFlash}
        </div>
      )}

      {/* DAY VIEW */}
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
              <p className="text-gray-400">
                No habits planned for today.
              </p>
            )}

            {habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onAction={(action) =>
                  handleAction(habit, action)
                }
              />
            ))}
          </div>
        </>
      )}

      {view === "week" && (
        <WeekView data={[]} />
      )}

      {view === "month" && (
        <p className="text-gray-400">
          Month view coming next.
        </p>
      )}

      {showModal && (
        <AddHabitModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddHabit}
        />
      )}
    </div>
  );
}

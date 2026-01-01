import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import HabitItem from "../components/HabitItem";
import AddHabitModal from "../components/AddHabitModal";
import WeekView from "../components/WeekView";
import { startOfWeek, format } from "date-fns";

import {
  getTodayHabits,
  addHabit,
  logHabit,
  getWeekHabits,
} from "../services/habit.service";

export default function Habits() {
  const { user, updateXP } = useAuth();

  const [view, setView] = useState("day");
  const [showModal, setShowModal] = useState(false);

  // Day view
  const [habits, setHabits] = useState([]);

  // Week view
  const [weekData, setWeekData] = useState([]);

  const [xpFlash, setXpFlash] = useState(null);

  /* ---------------- DAY VIEW ---------------- */

  useEffect(() => {
    if (view === "day") {
      fetchTodayHabits();
    }
  }, [view]);

  const fetchTodayHabits = async () => {
    const data = await getTodayHabits();
    setHabits(data);
  };

  const handleAddHabit = async (habit) => {
    await addHabit(habit);
    fetchTodayHabits();
  };

  const handleAction = async (habit, action) => {
    const res = await logHabit({
      habit_id: habit.id,
      status: action,
      type: habit.type,
      difficulty: habit.difficulty,
    });

    if (res.xp !== 0) {
      updateXP(res.total_xp);
      setXpFlash(`${res.xp > 0 ? "+" : ""}${res.xp} XP`);
      setTimeout(() => setXpFlash(null), 800);
    }

    // remove from today view
    setHabits((prev) => prev.filter((h) => h.id !== habit.id));
  };

  /* ---------------- WEEK VIEW ---------------- */

  useEffect(() => {
    if (view === "week") {
      fetchWeekData();
    }
  }, [view]);

  const fetchWeekData = async () => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const startDate = format(weekStart, "yyyy-MM-dd");

    const rows = await getWeekHabits(startDate);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const map = {};

    rows.forEach((row) => {
      if (!map[row.habit_id]) {
        map[row.habit_id] = {
          id: row.habit_id,
          name: row.name,
          category: row.category,
          week: {
            Mon: null,
            Tue: null,
            Wed: null,
            Thu: null,
            Fri: null,
            Sat: null,
            Sun: null,
          },
        };
      }

      if (row.date) {
        const dayIndex = (new Date(row.date).getDay() + 6) % 7;
        const day = days[dayIndex];

        map[row.habit_id].week[day] =
          row.status === "done" || row.status === "resisted"
            ? "success"
            : "fail";
      }
    });

    setWeekData(Object.values(map));
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div>
      {/* HEADER */}
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

      {/* XP FLASH */}
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

      {/* WEEK VIEW */}
      {view === "week" && <WeekView data={weekData} />}

      {/* MONTH VIEW (NEXT) */}
      {view === "month" && (
        <p className="text-gray-400">Month view coming next.</p>
      )}

      {/* MODAL */}
      {showModal && (
        <AddHabitModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddHabit}
        />
      )}
    </div>
  );
}

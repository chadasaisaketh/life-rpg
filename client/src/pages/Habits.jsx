import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import HabitItem from "../components/HabitItem";
import AddHabitModal from "../components/AddHabitModal";
import WeekView from "../components/WeekView";
import { startOfWeek, format } from "date-fns";
import WeeklyCategoryBars from "../components/WeeklyCategoryBars";
import CategoryLegend from "../components/CategoryLegend";

import MonthlyHeatmap from "../components/MonthlyHeatmap";
import { getMonthCategorySummary } from "../services/habit.service";
import MonthlyCalendar from "../components/MonthlyCalendar";
import MonthlyTrend from "../components/MonthlyTrend";



import {
  getTodayHabits,
  addHabit,
  logHabit,
  getWeekCategorySummary,
} from "../services/habit.service";

export default function Habits() {
  const { user, updateXP } = useAuth();

  const [view, setView] = useState("day");
  const [showModal, setShowModal] = useState(false);

  // DAY VIEW
  const [habits, setHabits] = useState([]);

  // WEEK VIEW
  const [weekData, setWeekData] = useState([]);

  const [xpFlash, setXpFlash] = useState(null);
  const [monthData, setMonthData] = useState([]);
  
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

    // GLOBAL XP UPDATE
    if (res.xp !== 0) {
      updateXP(res.total_xp);
      setXpFlash(`${res.xp > 0 ? "+" : ""}${res.xp} XP`);
      setTimeout(() => setXpFlash(null), 800);
    }

    // Remove habit from today list
    setHabits((prev) => prev.filter((h) => h.id !== habit.id));
  };

  /* ---------------- WEEK VIEW ---------------- */

  /* ---------------- WEEK VIEW ---------------- */

useEffect(() => {
  if (view === "week") {
    fetchWeekCategoryData();
  }
}, [view]);

const fetchWeekCategoryData = async () => {
  try {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const startDate = format(weekStart, "yyyy-MM-dd");

    const data = await getWeekCategorySummary(startDate);

    setWeekData(data); // 👈 VERY IMPORTANT
  } catch (err) {
    console.error("Failed to fetch week data", err);
    setWeekData([]);
  }
};
useEffect(() => {
  if (view === "month") {
    const month = format(new Date(), "yyyy-MM");
    getMonthCategorySummary(month).then(setMonthData);
  }
}, [view]);


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
      {view === "week" && (
  <>
    <WeekView data={weekData} />

    <WeeklyCategoryBars
      data={weekData}
    />
  </>
)}


      {/* MONTH VIEW */}
      {view === "month" && (
  <>
    <MonthlyCalendar data={monthData} />
    <CategoryLegend />
    <MonthlyTrend data={monthData} />
  </>
)}




      {/* ADD MODAL */}
      {showModal && (
        <AddHabitModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddHabit}
        />
      )}
    </div>
  );
}
function aggregateWeeklyCategory(data) {
  const map = {};

  data.forEach((row) => {
    map[row.category] = (map[row.category] || 0) + row.count;
  });

  return Object.entries(map).map(([category, total]) => ({
    category,
    total,
  }));
}

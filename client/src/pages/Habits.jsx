import { useState } from "react";
import HabitItem from "../components/HabitItem";
import AddHabitModal from "../components/AddHabitModal";
import WeekView from "../components/WeekView";

const XP_BY_DIFFICULTY = {
  easy: 10,
  medium: 25,
  hard: 50,
};

export default function Habits() {
  const [view, setView] = useState("day");
  const [showModal, setShowModal] = useState(false);
  const [habits, setHabits] = useState([]);
  const [dailyXP, setDailyXP] = useState(0);
  const [xpFlash, setXpFlash] = useState(null);

  const weeklyData = []; // unchanged

  const handleAddHabit = (habit) => {
    setHabits((prev) => [
      ...prev,
      { id: Date.now(), ...habit, status: "pending" },
    ]);
  };

  const handleAction = (id, action) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;

        let gainedXP = 0;
        const xpValue = XP_BY_DIFFICULTY[h.difficulty];

        if (
          (h.type === "good" && action === "done") ||
          (h.type === "bad" && action === "resisted")
        ) {
          gainedXP = xpValue;
        }

        if (gainedXP > 0) {
          setDailyXP((xp) => xp + gainedXP);
          setXpFlash(`+${gainedXP} XP`);
          setTimeout(() => setXpFlash(null), 800);
        }

        return { ...h, status: action };
      })
    );
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

      {/* Views */}
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
                No habits planned for today. Add your first quest.
              </p>
            )}

            {habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onAction={(action) =>
                  handleAction(habit.id, action)
                }
              />
            ))}
          </div>
        </>
      )}

      {view === "week" && <WeekView data={weeklyData} />}

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

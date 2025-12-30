import { useState } from "react";

export default function AddHabitModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    hour: "06",
    minute: "00",
    period: "AM",
    type: "good",
    category: "Body",
    difficulty: "easy",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name) return;

    const time = `${form.hour}:${form.minute} ${form.period}`;

    onAdd({
      name: form.name,
      time,
      type: form.type,
      category: form.category,
      difficulty: form.difficulty,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-cardBg w-full max-w-md rounded-2xl p-6 border border-white/10 shadow-neon">

        <h2 className="text-xl font-bold text-neonPurple mb-4">
          Add Habit for Today
        </h2>

        <div className="space-y-4">

          {/* Habit Name */}
          <input
            name="name"
            placeholder="Habit name (e.g. Morning Run)"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-black/60 text-white border border-white/10 outline-none"
          />

          {/* Time Picker */}
          <div>
            <p className="text-sm text-gray-400 mb-1">Time</p>
            <div className="flex gap-2">
              <select
                name="hour"
                value={form.hour}
                onChange={handleChange}
                className="px-3 py-2 rounded-lg bg-black/60 text-white border border-white/10"
              >
                {[...Array(12)].map((_, i) => {
                  const h = String(i + 1).padStart(2, "0");
                  return <option key={h}>{h}</option>;
                })}
              </select>

              <select
                name="minute"
                value={form.minute}
                onChange={handleChange}
                className="px-3 py-2 rounded-lg bg-black/60 text-white border border-white/10"
              >
                {["00", "15", "30", "45"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>

              <select
                name="period"
                value={form.period}
                onChange={handleChange}
                className="px-3 py-2 rounded-lg bg-black/60 text-white border border-white/10"
              >
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
          </div>

          {/* Type & Difficulty */}
          <div className="flex gap-2">
            <select
              name="type"
              onChange={handleChange}
              className="flex-1 px-3 py-2 rounded-lg bg-black/60 text-white border border-white/10"
            >
              <option value="good">Good Habit</option>
              <option value="bad">Bad Habit</option>
            </select>

            <select
              name="difficulty"
              onChange={handleChange}
              className="flex-1 px-3 py-2 rounded-lg bg-black/60 text-white border border-white/10"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Category */}
          <select
            name="category"
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-black/60 text-white border border-white/10"
          >
            <option>Body</option>
            <option>Learning</option>
            <option>Spiritual</option>
            <option>Mind</option>
            <option>Wealth</option>
          </select>

        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-neonPurple text-black font-semibold rounded-lg"
          >
            Add
          </button>
        </div>

      </div>
    </div>
  );
}

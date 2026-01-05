import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  addWorkout,
  getWeeklyWorkouts,
  getMuscleHeatmap,
  getAvatarStats,
  getMuscleBalance,
} from "../services/workouts.service";

import MuscleMap from "../components/MuscleMap";
import AvatarStats from "../components/AvatarStats";
import MuscleBalance from "../components/MuscleBalance";

const MUSCLE_OPTIONS = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "abs",
  "legs",
  "calves",
];

export default function Body() {
  const { updateXP } = useAuth();

  const [week, setWeek] = useState([]);
  const [muscles, setMuscles] = useState([]);
  const [stats, setStats] = useState(null);
  const [balance, setBalance] = useState(null);

  const [form, setForm] = useState({
    type: "gym",
    duration_minutes: "",
    distance_km: "",
    muscles: [],
  });

  /* ---------------- LOAD ALL DATA ---------------- */

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setWeek(await getWeeklyWorkouts());
    setMuscles(await getMuscleHeatmap());
    setStats(await getAvatarStats());
    setBalance(await getMuscleBalance());
  };

  /* ---------------- MUSCLE TOGGLE ---------------- */

  const toggleMuscle = (muscle) => {
    setForm((prev) => ({
      ...prev,
      muscles: prev.muscles.includes(muscle)
        ? prev.muscles.filter((m) => m !== muscle)
        : [...prev.muscles, muscle],
    }));
  };

  /* ---------------- ADD WORKOUT ---------------- */

  const submit = async () => {
    if (!form.duration_minutes) return;

    const res = await addWorkout({
      type: form.type,
      duration_minutes: Number(form.duration_minutes),
      distance_km: form.distance_km
        ? Number(form.distance_km)
        : null,
      muscles: form.muscles,
    });

    updateXP(res.xp);

    setForm({
      type: "gym",
      duration_minutes: "",
      distance_km: "",
      muscles: [],
    });

    loadAll();
  };

  /* ---------------- UI ---------------- */

  return (
    <div>
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-neonPurple mb-6">
        Body
      </h1>

      {/* AVATAR STATS */}
      <h2 className="text-xl mb-3 text-neonPurple">
        Avatar Stats
      </h2>
      {stats && <AvatarStats stats={stats} />}

      {/* MUSCLE BALANCE */}
      <h2 className="text-xl mt-6 mb-3 text-neonPurple">
        Muscle Balance
      </h2>
      {balance && <MuscleBalance data={balance} />}

      {/* LOG WORKOUT */}
      <div className="p-4 my-8 bg-black/40 rounded-xl border border-white/10">
        <h2 className="text-lg mb-4 text-neonBlue">
          Log Workout
        </h2>

        <div className="flex gap-3 flex-wrap mb-4">
          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
            className="bg-black/60 border border-white/10 rounded px-3 py-2"
          >
            <option value="gym">Gym</option>
            <option value="run">Run</option>
            <option value="walk">Walk</option>
            <option value="yoga">Yoga</option>
          </select>

          <input
            placeholder="Minutes"
            type="number"
            value={form.duration_minutes}
            onChange={(e) =>
              setForm({
                ...form,
                duration_minutes: e.target.value,
              })
            }
            className="bg-black/60 border border-white/10 rounded px-3 py-2"
          />

          <input
            placeholder="Distance (km)"
            type="number"
            value={form.distance_km}
            onChange={(e) =>
              setForm({
                ...form,
                distance_km: e.target.value,
              })
            }
            className="bg-black/60 border border-white/10 rounded px-3 py-2"
          />
        </div>

        {/* MUSCLE SELECT */}
        {form.type === "gym" && (
          <>
            <p className="text-sm text-gray-400 mb-2">
              Muscles Trained
            </p>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {MUSCLE_OPTIONS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleMuscle(m)}
                  className={`px-2 py-1 rounded text-sm border transition
                    ${
                      form.muscles.includes(m)
                        ? "bg-neonPurple text-black border-neonPurple"
                        : "bg-black/60 text-gray-400 border-white/10"
                    }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </>
        )}

        <button
          onClick={submit}
          className="px-4 py-2 bg-neonBlue text-black rounded"
        >
          Add Workout
        </button>
      </div>

      {/* WEEKLY SUMMARY */}
      <h2 className="text-xl mb-3 text-neonGreen">
        This Week
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-10">
        {week.length === 0 && (
          <p className="text-gray-400">
            No workouts logged this week.
          </p>
        )}

        {week.map((w) => (
          <div
            key={w.type}
            className="p-4 bg-black/40 rounded-xl border border-white/10"
          >
            <p className="font-semibold">
              {w.type.toUpperCase()}
            </p>
            <p className="text-sm text-gray-400">
              Sessions: {w.sessions}
            </p>
            <p className="text-sm text-gray-400">
              Minutes: {w.total_minutes}
            </p>
            {w.total_km && (
              <p className="text-sm text-gray-400">
                Distance: {w.total_km} km
              </p>
            )}
          </div>
        ))}
      </div>

      {/* MUSCLE HEATMAP */}
      <h2 className="text-xl mb-3 text-neonPurple">
        Muscle Heatmap (Last 7 Days)
      </h2>

      <MuscleMap data={muscles} />
    </div>
  );
}

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import AuraMeter from "../components/AuraMeter";

const PRACTICES = [
  { type: "meditation", label: "Meditation (min)" },
  { type: "yoga", label: "Yoga (min)" },
  { type: "silence", label: "Silence (min)" },
  { type: "chanting", label: "Chanting (count)" },
];

export default function Spiritual() {
  const { user, updateXP } = useAuth();

  const [form, setForm] = useState({
    type: "meditation",
    value: "",
  });
  const [today, setToday] = useState([]);
  const [streak, setStreak] = useState(0);
  const [xpFlash, setXpFlash] = useState(null);

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const todayRes = await api.get("/spiritual/today");
    const streakRes = await api.get("/spiritual/streak");

    setToday(todayRes.data);
    setStreak(streakRes.data.streak);
  };

  /* ---------------- ADD PRACTICE ---------------- */

  const submit = async () => {
    if (!form.value) return;

    const payload =
      form.type === "chanting"
        ? { type: form.type, count: Number(form.value) }
        : {
            type: form.type,
            duration_minutes: Number(form.value),
          };

    const res = await api.post("/spiritual", payload);

    if (res.data.xp > 0) {
      updateXP(res.data.xp);
      setXpFlash(`+${res.data.xp} XP`);
      setTimeout(() => setXpFlash(null), 1200);
    }

    setForm({ ...form, value: "" });
    load();
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-4xl">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-neonPurple">
          Spirituality
        </h1>
        <span className="text-neonBlue font-semibold">
          Total XP: {user?.total_xp ?? 0}
        </span>
      </div>

      {/* XP FLASH */}
      {xpFlash && (
        <div className="fixed top-20 right-10 text-green-400 text-xl font-bold animate-pulse">
          {xpFlash}
        </div>
      )}

      {/* AURA METER */}
      <AuraMeter streak={streak} />

      {/* LOG PRACTICE */}
      <div className="p-4 bg-black/40 rounded-xl border border-white/10 mb-8">
        <h2 className="text-neonBlue mb-3">
          Log Practice
        </h2>

        <div className="flex gap-3 flex-wrap">
          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
            className="bg-black/60 border border-white/10 rounded px-3 py-2"
          >
            {PRACTICES.map((p) => (
              <option key={p.type} value={p.type}>
                {p.label}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Value"
            value={form.value}
            onChange={(e) =>
              setForm({ ...form, value: e.target.value })
            }
            className="bg-black/60 border border-white/10 rounded px-3 py-2"
          />

          <button
            onClick={submit}
            className="px-4 py-2 bg-neonPurple text-black rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* TODAY SUMMARY */}
      <h2 className="text-neonGreen mb-3">
        Today’s Practice
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {today.length === 0 && (
          <p className="text-gray-400">
            No practices logged today.
          </p>
        )}

        {today.map((t) => (
          <div
            key={t.type}
            className="p-4 bg-black/40 rounded-xl border border-white/10"
          >
            <p className="font-semibold capitalize">
              {t.type}
            </p>
            {t.minutes && (
              <p className="text-gray-400">
                Minutes: {t.minutes}
              </p>
            )}
            {t.count && (
              <p className="text-gray-400">
                Count: {t.count}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

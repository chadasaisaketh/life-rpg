import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getTargets,
  saveTargets,
  getTodaySummary,
  addMeal,
} from "../services/nutrition.service";
import AddMealModal from "../components/AddMealModal";
import ProgressRing from "../components/ProgressRing";

/* ---------------- FIELD GROUPS ---------------- */

const MACROS = ["calories", "protein", "carbs", "fats"];

const VITAMINS = [
  "vitamin_a",
  "vitamin_b1",
  "vitamin_b2",
  "vitamin_b3",
  "vitamin_b6",
  "vitamin_b12",
  "vitamin_c",
  "vitamin_d",
  "vitamin_e",
  "vitamin_k",
  "folate",
];

const MINERALS = [
  "calcium",
  "iron",
  "magnesium",
  "zinc",
  "phosphorus",
  "selenium",
  "sodium",
  "potassium",
];

const LABELS = {
  calories: "Calories",
  protein: "Protein",
  carbs: "Carbs",
  fats: "Fats",

  vitamin_a: "Vitamin A",
  vitamin_b1: "Vitamin B1",
  vitamin_b2: "Vitamin B2",
  vitamin_b3: "Vitamin B3",
  vitamin_b6: "Vitamin B6",
  vitamin_b12: "Vitamin B12",
  vitamin_c: "Vitamin C",
  vitamin_d: "Vitamin D",
  vitamin_e: "Vitamin E",
  vitamin_k: "Vitamin K",
  folate: "Folate",

  calcium: "Calcium",
  iron: "Iron",
  magnesium: "Magnesium",
  zinc: "Zinc",
  phosphorus: "Phosphorus",
  selenium: "Selenium",
  sodium: "Sodium",
  potassium: "Potassium",
};

export default function Nutrition() {
  const { user, updateXP } = useAuth();

  const [targets, setTargets] = useState({});
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [xpFlash, setXpFlash] = useState(null);

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const t = await getTargets();
    const s = await getTodaySummary();
    setTargets(t || {});
    setSummary(s || {});
    setLoading(false);
  };

  /* ---------------- TARGET HANDLERS ---------------- */

  const handleChange = (key, value) => {
    setTargets((prev) => ({
      ...prev,
      [key]: value === "" ? null : Number(value),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await saveTargets(targets);
    setSaving(false);
  };

  /* ---------------- MEAL HANDLER ---------------- */

  const handleAddMeal = async (mealData) => {
    const res = await addMeal(mealData);

    const s = await getTodaySummary();
    setSummary(s || {});

    if (res?.xp > 0) {
      updateXP(res.xp);
      setXpFlash(`+${res.xp} XP`);
      setTimeout(() => setXpFlash(null), 1200);
    }
  };

  if (loading) {
    return <p className="text-gray-400">Loading nutrition…</p>;
  }

  return (
    <div className="max-w-6xl">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-neonPurple">
          Nutrition
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

      {/* MACROS */}
      <Section title="Macros (Today)">
        <RingGrid
          fields={MACROS}
          targets={targets}
          summary={summary}
        />
      </Section>

      {/* VITAMINS */}
      <Section title="Vitamins (Today)">
        <RingGrid
          fields={VITAMINS}
          targets={targets}
          summary={summary}
        />
      </Section>

      {/* MINERALS */}
      <Section title="Minerals (Today)">
        <RingGrid
          fields={MINERALS}
          targets={targets}
          summary={summary}
        />
      </Section>

      {/* TARGET SETTINGS */}
      <Section title="Daily Targets">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(LABELS).map((key) => (
            <div key={key}>
              <label className="block text-sm text-gray-400 mb-1">
                {LABELS[key]}
              </label>
              <input
                type="number"
                value={targets[key] ?? ""}
                onChange={(e) =>
                  handleChange(key, e.target.value)
                }
                className="w-full px-3 py-2 rounded bg-black/50 border border-white/10
                           focus:outline-none focus:border-neonBlue text-white"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 px-6 py-3 bg-neonBlue text-black font-semibold rounded-lg"
        >
          {saving ? "Saving…" : "Save Targets"}
        </button>
      </Section>

      {/* ADD MEAL */}
      <button
        onClick={() => setShowMealModal(true)}
        className="mt-10 px-4 py-2 bg-neonPurple text-black rounded"
      >
        + Add Meal
      </button>

      {showMealModal && (
        <AddMealModal
          onClose={() => setShowMealModal(false)}
          onAdd={handleAddMeal}
        />
      )}
    </div>
  );
}

/* ---------------- REUSABLE UI ---------------- */

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl mb-4 text-neonGreen">
        {title}
      </h2>
      {children}
    </div>
  );
}

function RingGrid({ fields, targets, summary }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {fields.map((key) => (
        <ProgressRing
          key={key}
          label={LABELS[key]}
          value={summary[key] ?? 0}
          target={targets[key] ?? 0}
        />
      ))}
    </div>
  );
}

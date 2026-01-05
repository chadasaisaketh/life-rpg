import { useEffect, useState } from "react";
import {
  getTargets,
  saveTargets,
  getTodaySummary,
  addMeal,
} from "../services/nutrition.service";
import AddMealModal from "../components/AddMealModal";
import ProgressRing from "../components/ProgressRing";

/* ---------------- TARGET FIELDS ---------------- */

const TARGET_FIELDS = [
  { key: "calories", label: "Calories (kcal)" },
  { key: "protein", label: "Protein (g)" },
  { key: "carbs", label: "Carbs (g)" },
  { key: "fats", label: "Fats (g)" },
  { key: "fiber", label: "Fiber (g)" },
  { key: "sugar", label: "Sugar (g)" },
  { key: "sodium", label: "Sodium (mg)" },
  { key: "potassium", label: "Potassium (mg)" },

  // Vitamins
  { key: "vitamin_a", label: "Vitamin A (µg)" },
  { key: "vitamin_b1", label: "Vitamin B1 (mg)" },
  { key: "vitamin_b2", label: "Vitamin B2 (mg)" },
  { key: "vitamin_b3", label: "Vitamin B3 (mg)" },
  { key: "vitamin_b6", label: "Vitamin B6 (mg)" },
  { key: "vitamin_b12", label: "Vitamin B12 (µg)" },
  { key: "vitamin_c", label: "Vitamin C (mg)" },
  { key: "vitamin_d", label: "Vitamin D (IU)" },
  { key: "vitamin_e", label: "Vitamin E (mg)" },
  { key: "vitamin_k", label: "Vitamin K (µg)" },
  { key: "folate", label: "Folate (µg)" },

  // Minerals
  { key: "calcium", label: "Calcium (mg)" },
  { key: "iron", label: "Iron (mg)" },
  { key: "magnesium", label: "Magnesium (mg)" },
  { key: "zinc", label: "Zinc (mg)" },
  { key: "phosphorus", label: "Phosphorus (mg)" },
  { key: "selenium", label: "Selenium (µg)" },
];

export default function Nutrition() {
  const [targets, setTargets] = useState({});
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);

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

  /* ---------------- MEAL HANDLERS ---------------- */

  const handleAddMeal = async (mealData) => {
    await addMeal(mealData);
    const s = await getTodaySummary();
    setSummary(s || {});
  };

  if (loading) {
    return <p className="text-gray-400">Loading nutrition…</p>;
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-5xl">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-neonPurple mb-6">
        Nutrition
      </h1>

      {/* TARGETS */}
      <h2 className="text-xl text-neonBlue mb-2">
        Daily Targets
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {TARGET_FIELDS.map((field) => (
          <div key={field.key}>
            <label className="block text-sm text-gray-400 mb-1">
              {field.label}
            </label>
            <input
              type="number"
              value={targets[field.key] ?? ""}
              onChange={(e) =>
                handleChange(field.key, e.target.value)
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
        className="px-6 py-3 bg-neonBlue text-black font-semibold rounded-lg"
      >
        {saving ? "Saving…" : "Save Targets"}
      </button>

      {/* TODAY SUMMARY */}
      <h2 className="text-xl mt-10 mb-3 text-neonGreen">
        Today’s Intake
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {["calories", "protein", "carbs", "fats"].map((k) => (
          <div
            key={k}
            className="p-4 bg-black/40 rounded-xl border border-white/10"
          >
            <p className="text-sm text-gray-400">
              {k.toUpperCase()}
            </p>
            <p className="text-lg font-semibold text-white">
              {summary?.[k] ?? 0}
            </p>
          </div>
        ))}
      </div>

      {/* PROGRESS RINGS */}
      <h2 className="text-xl mb-4 text-neonPurple">
        Macro Progress
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <ProgressRing
          label="Calories"
          value={summary?.calories ?? 0}
          target={targets?.calories ?? 0}
          unit="kcal"
        />
        <ProgressRing
          label="Protein"
          value={summary?.protein ?? 0}
          target={targets?.protein ?? 0}
          unit="g"
        />
        <ProgressRing
          label="Carbs"
          value={summary?.carbs ?? 0}
          target={targets?.carbs ?? 0}
          unit="g"
        />
        <ProgressRing
          label="Fats"
          value={summary?.fats ?? 0}
          target={targets?.fats ?? 0}
          unit="g"
        />
      </div>

      {/* ADD MEAL */}
      <button
        onClick={() => setShowMealModal(true)}
        className="px-4 py-2 bg-neonPurple text-black rounded"
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

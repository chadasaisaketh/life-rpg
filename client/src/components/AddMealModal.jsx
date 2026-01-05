import { useState } from "react";

/* ---------- FIELD GROUPS ---------- */

const MACROS = [
  { key: "calories", label: "Calories (kcal)" },
  { key: "protein", label: "Protein (g)" },
  { key: "carbs", label: "Carbs (g)" },
  { key: "fats", label: "Fats (g)" },
  { key: "fiber", label: "Fiber (g)" },
  { key: "sugar", label: "Sugar (g)" },
  { key: "sodium", label: "Sodium (mg)" },
];

const VITAMINS = [
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
];

const MINERALS = [
  { key: "calcium", label: "Calcium (mg)" },
  { key: "iron", label: "Iron (mg)" },
  { key: "magnesium", label: "Magnesium (mg)" },
  { key: "zinc", label: "Zinc (mg)" },
  { key: "phosphorus", label: "Phosphorus (mg)" },
  { key: "selenium", label: "Selenium (µg)" },
  { key: "potassium", label: "Potassium (mg)" },
];

export default function AddMealModal({ onClose, onAdd }) {
  const [meal, setMeal] = useState("Meal 1");
  const [data, setData] = useState({});

  const handleChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value === "" ? null : Number(value),
    }));
  };

  const submit = () => {
    onAdd({
      meal,
      ...data,
    });
    onClose();
  };

  const renderGroup = (title, fields) => (
    <>
      <h3 className="text-neonBlue font-semibold mt-4 mb-2">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {fields.map((f) => (
          <input
            key={f.key}
            type="number"
            placeholder={f.label}
            onChange={(e) =>
              handleChange(f.key, e.target.value)
            }
            className="px-3 py-2 bg-black/50 border border-white/10 rounded text-white"
          />
        ))}
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-cardBg p-6 rounded-xl w-full max-w-3xl border border-white/10">
        <h2 className="text-2xl text-neonPurple mb-4">
          Add Meal
        </h2>

        <select
          value={meal}
          onChange={(e) => setMeal(e.target.value)}
          className="mb-4 w-full px-3 py-2 bg-black/50 border border-white/10 rounded"
        >
          <option>Meal 1</option>
          <option>Meal 2</option>
          <option>Meal 3</option>
          <option>Snack</option>
          <option>Dinner</option>
        </select>

        {renderGroup("Macros", MACROS)}
        {renderGroup("Vitamins", VITAMINS)}
        {renderGroup("Minerals", MINERALS)}

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="text-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-6 py-2 bg-neonBlue text-black font-semibold rounded"
          >
            Save Meal
          </button>
        </div>
      </div>
    </div>
  );
}

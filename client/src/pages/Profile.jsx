import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/user.service";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    age: "",
    height_cm: "",
    weight_kg: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile().then((data) => {
      setForm({
        name: data.name ?? "",
        age: data.age ?? "",
        height_cm: data.height_cm ?? "",
        weight_kg: data.weight_kg ?? "",
      });
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({
      name: form.name || null,
      age: form.age ? Number(form.age) : null,
      height_cm: form.height_cm ? Number(form.height_cm) : null,
      weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
    });
    setSaving(false);
  };

  /* ---------------- BMI LOGIC ---------------- */

  const bmi =
    form.height_cm && form.weight_kg
      ? (
          form.weight_kg /
          ((form.height_cm / 100) ** 2)
        ).toFixed(1)
      : null;

  const getBmiCategory = (bmi) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-400" };
    if (bmi < 25) return { label: "Normal", color: "text-green-400" };
    if (bmi < 30) return { label: "Overweight", color: "text-yellow-400" };
    return { label: "Obese", color: "text-red-400" };
  };

  const bmiCategory = getBmiCategory(bmi);

  if (loading) return <p className="text-gray-400">Loading profile…</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold text-neonPurple mb-6">
        Profile
      </h1>

      {/* CHARACTER STATS */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard label="Level" value={user?.level ?? 1} />
        <StatCard label="Total XP" value={user?.total_xp ?? 0} />
      </div>

      {/* FORM */}
      <div className="space-y-4">
        <Input label="Name" name="name" value={form.name} onChange={handleChange} />
        <Input label="Age" name="age" type="number" value={form.age} onChange={handleChange} />
        <Input label="Height (cm)" name="height_cm" type="number" value={form.height_cm} onChange={handleChange} />
        <Input label="Weight (kg)" name="weight_kg" type="number" value={form.weight_kg} onChange={handleChange} />

        {/* BMI DISPLAY */}
        {bmi && (
          <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/10">
            <p className="text-gray-400 text-sm">BMI</p>
            <p className="text-2xl font-bold text-white">{bmi}</p>
            <p className={`font-semibold ${bmiCategory.color}`}>
              {bmiCategory.label}
            </p>

            {/* BMI SCALE */}
            <div className="mt-4 h-2 w-full bg-white/10 rounded-full relative">
              <div
                className="absolute top-0 h-2 rounded-full bg-neonBlue"
                style={{
                  width: `${Math.min((bmi / 40) * 100, 100)}%`,
                }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Under</span>
              <span>Normal</span>
              <span>Over</span>
              <span>Obese</span>
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 px-6 py-2 bg-neonBlue text-black font-semibold rounded-lg"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-gray-400 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg
                   focus:outline-none focus:border-neonBlue text-white"
      />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="p-4 rounded-xl bg-black/40 border border-white/10">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-neonBlue">{value}</p>
    </div>
  );
}

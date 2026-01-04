import { useState } from "react";
import { createSkill } from "../services/skills.service";

export default function AddSkillModal({ onClose, onAdded }) {
  const [name, setName] = useState("");
  const [componentsText, setComponentsText] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    const components = componentsText
      .split("\n")
      .map((c) => c.trim())
      .filter(Boolean);

    if (!name || components.length === 0) return;

    setSaving(true);
    await createSkill({ name, components });
    setSaving(false);

    onAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-cardBg rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-neonPurple mb-4">
          Add Skill
        </h2>

        <div className="space-y-4">
          <input
            placeholder="Skill name (e.g. React)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white"
          />

          <textarea
            placeholder={`Components (one per line)
Example:
JSX
Hooks
Routing
State Management`}
            value={componentsText}
            onChange={(e) => setComponentsText(e.target.value)}
            rows={6}
            className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white"
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-4 py-2 bg-neonBlue text-black font-semibold rounded-lg"
            >
              {saving ? "Adding..." : "Add Skill"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

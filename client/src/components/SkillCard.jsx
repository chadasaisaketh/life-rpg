import { useEffect, useState } from "react";
import {
  getSkillComponents,
  completeComponent,
} from "../services/skills.service";
import { useAuth } from "../context/AuthContext";


export default function SkillCard({ skill, onUpdated }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateXP } = useAuth();

  useEffect(() => {
    loadComponents();
  }, [skill.id]);

  const loadComponents = async () => {
    setLoading(true);
    const data = await getSkillComponents(skill.id);
    setComponents(data);
    setLoading(false);
  };
  const handleComplete = async (componentId) => {
  const res = await completeComponent({
    componentId,
    skillId: skill.id,
  });

  if (res?.total_xp !== undefined) {
    updateXP(res.total_xp);
  }

  loadComponents();

  if (onUpdated) {
    onUpdated();
  }
};

  const handleCheck = async (component) => {
    if (component.is_completed) return;

    const res = await completeComponent({
      componentId: component.id,
      skillId: skill.id,
    });

    // ✅ Safe global XP update
    if (res?.total_xp !== undefined) {
      updateXP(res.total_xp);
    } else if (res?.xp) {
      updateXP(res.xp, true);
    }

    await loadComponents();
    onUpdated();
  };

  const progress =
    skill.total_components > 0
      ? (skill.completed_components / skill.total_components) * 100
      : 0;

  return (
    <div className="p-4 bg-black/40 rounded-xl border border-white/10">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold">{skill.name}</p>
        <span className="text-sm text-gray-400">
          {skill.completed_components}/{skill.total_components}
        </span>
      </div>

      {/* PROGRESS BAR */}
      <div className="h-2 bg-white/10 rounded-full mb-4">
        <div
          className="h-2 bg-neonBlue rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* COMPONENT LIST */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading components…</p>
      ) : (
        <div className="space-y-2">
          {components.map((c) => (
            <label
              key={c.id}
              className={`flex items-center gap-2 cursor-pointer
                ${c.is_completed ? "text-green-400" : "text-gray-300"}
              `}
            >
              <input
                type="checkbox"
                checked={!!c.is_completed}
                onChange={() => handleCheck(c)}
                className="accent-neonBlue"
              />
              <span className="text-sm">{c.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

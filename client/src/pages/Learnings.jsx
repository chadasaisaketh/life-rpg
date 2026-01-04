import { useEffect, useState } from "react";
import {
  getActiveSkills,
  getCompletedSkills,
} from "../services/skills.service";
import AddSkillModal from "../components/AddSkillModal";
import SkillCard from "../components/SkillCard";

export default function Learnings() {
  const [active, setActive] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setActive(await getActiveSkills());
    setCompleted(await getCompletedSkills());
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-neonPurple">
          Learnings
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-neonBlue text-black font-semibold rounded-lg"
        >
          + Add Skill
        </button>
      </div>

      {/* ACTIVE SKILLS */}
      <h2 className="text-xl mb-2 text-neonBlue">
        Active Skills
      </h2>

      <div className="space-y-4 mb-8">
        {active.length === 0 && (
          <p className="text-gray-400">
            No active skills. Add one to begin.
          </p>
        )}

        <div className="space-y-4 mb-8">
  {active.length === 0 && (
    <p className="text-gray-400">
      No active skills. Add one to begin.
    </p>
  )}

  {active.map((skill) => (
    <SkillCard
      key={skill.id}
      skill={skill}
      onUpdated={load}
    />
  ))}
</div>


      </div>

      {/* KNOWLEDGE BASE */}
      <h2 className="text-xl mb-2 text-neonGreen">
        Knowledge Base
      </h2>

      <div className="space-y-3">
        {completed.length === 0 && (
          <p className="text-gray-400">
            No completed skills yet.
          </p>
        )}

        {completed.map((s) => (
          <div
            key={s.name}
            className="p-4 bg-black/40 rounded-xl border border-neonGreen/30"
          >
            <p className="font-semibold">{s.name}</p>
            <p className="text-sm text-gray-400">
              Completed in {s.duration_days} days
            </p>
          </div>
        ))}
      </div>

      {showModal && (
        <AddSkillModal
          onClose={() => setShowModal(false)}
          onAdded={load}
        />
      )}
    </div>
  );
}

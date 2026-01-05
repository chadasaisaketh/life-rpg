import { useEffect, useState } from "react";
import {
  getActiveSkills,
  getCompletedSkills,
} from "../services/skills.service";
import AddSkillModal from "../components/AddSkillModal";
import SkillCard from "../components/SkillCard";
import KnowledgeTimeline from "../components/KnowledgeTimeline";
import { useAuth } from "../context/AuthContext";

export default function Learnings() {
  const [active, setActive] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [xpFlash, setXpFlash] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setActive(await getActiveSkills());
    setCompleted(await getCompletedSkills());
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-neonPurple">
          Learnings
        </h1>

        <div className="flex gap-4 items-center">
          <span className="text-neonBlue font-semibold">
            Total XP: {user?.total_xp ?? 0}
          </span>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-neonBlue text-black font-semibold rounded-lg"
          >
            + Add Skill
          </button>
        </div>
      </div>

      {/* XP FLASH */}
      {xpFlash && (
        <div className="fixed top-20 right-10 text-green-400 text-xl font-bold animate-pulse">
          {xpFlash}
        </div>
      )}

      {/* ACTIVE SKILLS */}
      <h2 className="text-xl mb-3 text-neonBlue">
        Active Skills
      </h2>

      <div className="space-y-4 mb-10">
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
            onXP={(xp) => {
              setXpFlash(`+${xp} XP`);
              setTimeout(() => setXpFlash(null), 800);
            }}
          />
        ))}
      </div>

      {/* KNOWLEDGE BASE TIMELINE */}
      <h2 className="text-xl mb-4 text-neonGreen">
        Knowledge Base
      </h2>

      <KnowledgeTimeline skills={completed} />

      {/* ADD MODAL */}
      {showModal && (
        <AddSkillModal
          onClose={() => setShowModal(false)}
          onAdded={load}
        />
      )}
    </div>
  );
}

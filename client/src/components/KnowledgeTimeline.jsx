export default function KnowledgeTimeline({ skills }) {
  if (skills.length === 0) {
    return (
      <p className="text-gray-400">
        No completed skills yet. Finish a skill to build your knowledge base.
      </p>
    );
  }

  return (
    <div className="relative border-l border-white/10 pl-6 space-y-6">
      {skills.map((skill, index) => (
        <div key={index} className="relative">
          {/* DOT */}
          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-neonGreen shadow-neon" />

          {/* CARD */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white">
              {skill.name}
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              {formatDate(skill.started_at)} → {formatDate(skill.completed_at)}
            </p>

            <p className="text-sm text-neonBlue mt-1">
              Completed in {skill.duration_days} days
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- UTIL ---------------- */

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

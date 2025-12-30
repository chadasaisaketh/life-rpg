export default function HabitItem({ habit, onAction }) {
  const { name, time, category, difficulty, type } = habit;

  const categoryColor = {
    Body: "text-green-400",
    Learning: "text-blue-400",
    Spiritual: "text-purple-400",
    Mind: "text-red-400",
    Wealth: "text-yellow-400",
  }[category];

  const difficultyBadge = {
    easy: "bg-green-500/20 text-green-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    hard: "bg-red-500/20 text-red-400",
  }[difficulty];

  return (
    <div className="bg-cardBg border border-white/10 rounded-xl p-4 flex justify-between items-center">
      <div>
        <p className="text-xs text-gray-400">{time}</p>
        <h3 className="text-lg font-semibold">{name}</h3>
        <div className="flex gap-2 mt-1">
          <span className={`text-xs ${categoryColor}`}>{category}</span>
          <span className={`text-xs px-2 py-0.5 rounded ${difficultyBadge}`}>
            {difficulty.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {type === "good" ? (
          <>
            <button
              onClick={() => onAction("done")}
              className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
            >
              ✔ Done
            </button>
            <button
              onClick={() => onAction("skipped")}
              className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded hover:bg-gray-500/30"
            >
              ✖ Skip
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onAction("did")}
              className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
            >
              ❌ Did
            </button>
            <button
              onClick={() => onAction("resisted")}
              className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
            >
              🛡️ Resisted
            </button>
          </>
        )}
      </div>
    </div>
  );
}

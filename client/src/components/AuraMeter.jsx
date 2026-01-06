export default function AuraMeter({ streak }) {
  let label = "Dormant";
  let color = "bg-gray-500";
  let glow = "";

  if (streak >= 30) {
    label = "Transcendent";
    color = "bg-yellow-400";
    glow = "shadow-[0_0_40px_10px_rgba(255,215,0,0.6)]";
  } else if (streak >= 14) {
    label = "Radiant";
    color = "bg-purple-500";
    glow = "shadow-[0_0_30px_8px_rgba(168,85,247,0.6)]";
  } else if (streak >= 7) {
    label = "Strong";
    color = "bg-green-400";
    glow = "shadow-[0_0_25px_6px_rgba(34,197,94,0.6)]";
  } else if (streak >= 3) {
    label = "Stable";
    color = "bg-blue-400";
    glow = "shadow-[0_0_20px_4px_rgba(59,130,246,0.6)]";
  }

  return (
    <div className="flex items-center gap-6 mb-6">
      <div
        className={`w-24 h-24 rounded-full ${color} ${glow} transition-all`}
      />
      <div>
        <p className="text-gray-400 text-sm">Aura Level</p>
        <p className="text-xl font-bold text-white">
          {label}
        </p>
        <p className="text-sm text-gray-400">
          Streak: {streak} days
        </p>
      </div>
    </div>
  );
}

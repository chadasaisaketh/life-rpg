export default function AvatarStats({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Stat label="Strength" value={stats.strength} />
      <Stat label="Endurance" value={stats.endurance} />
      <Stat label="Recovery" value={stats.recovery} />
      <Stat label="Discipline" value={stats.discipline} />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="p-4 bg-black/40 rounded-xl border border-white/10">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-neonBlue">
        {value}
      </p>
    </div>
  );
}

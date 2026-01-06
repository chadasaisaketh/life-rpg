export default function AuraMeter({ value }) {
  const glow =
    value >= 80
      ? "shadow-[0_0_40px_#a855f7]"
      : value >= 50
      ? "shadow-[0_0_25px_#22d3ee]"
      : "shadow-[0_0_15px_#64748b]";

  const color =
    value >= 80
      ? "from-purple-500 to-pink-500"
      : value >= 50
      ? "from-cyan-400 to-blue-500"
      : "from-gray-500 to-gray-700";

  return (
    <div className="flex flex-col items-center mb-6">
      <div
        className={`w-40 h-40 rounded-full flex items-center justify-center
        bg-gradient-to-br ${color} ${glow} transition-all`}
      >
        <span className="text-3xl font-bold text-black">
          {value}
        </span>
      </div>
      <p className="mt-2 text-gray-400 text-sm">
        Aura Level
      </p>
    </div>
  );
}

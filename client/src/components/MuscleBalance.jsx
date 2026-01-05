export default function MuscleBalance({ data }) {
  const color =
    data.balance >= 80
      ? "text-green-400"
      : data.balance >= 60
      ? "text-yellow-400"
      : "text-red-500";

  return (
    <div className="p-4 bg-black/40 rounded-xl border border-white/10">
      <h3 className="text-neonBlue font-semibold mb-2">
        Muscle Balance
      </h3>

      <p className="text-sm text-gray-400">
        Upper Body: {data.upper}
      </p>
      <p className="text-sm text-gray-400">
        Lower Body: {data.lower}
      </p>

      <p className={`text-2xl font-bold mt-2 ${color}`}>
        {data.balance}%
      </p>

      {data.balance < 70 && (
        <p className="text-xs text-red-400 mt-1">
          ⚠️ Imbalance detected — train weaker side
        </p>
      )}
    </div>
  );
}

const MUSCLES = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "abs",
  "legs",
  "calves",
];

export default function MuscleMap({ data }) {
  const map = {};
  data.forEach((m) => {
    map[m.muscle] = m;
  });

  const getStyle = (m) => {
    if (!m) return "bg-gray-800";

    if (m.overtrained) {
      return "bg-red-600 animate-pulse";
    }

    if (m.intensity >= 3) return "bg-orange-500";
    if (m.intensity >= 1) return "bg-yellow-500";

    return "bg-gray-800";
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {MUSCLES.map((muscle) => (
          <div
            key={muscle}
            className={`p-4 rounded-xl text-center text-sm font-semibold ${getStyle(
              map[muscle]
            )}`}
          >
            {muscle.toUpperCase()}
          </div>
        ))}
      </div>

      {/* LEGEND */}
      <div className="mt-4 text-sm text-gray-400 space-y-1">
        <p>🟡 Light training</p>
        <p>🟠 Heavy training</p>
        <p>🔴 Overtrained (recover)</p>
      </div>
    </div>
  );
}

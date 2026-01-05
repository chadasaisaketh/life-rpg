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
  data.forEach((m) => (map[m.muscle] = m.intensity));

  const color = (v = 0) =>
    v === 0
      ? "bg-gray-800"
      : v < 3
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="grid grid-cols-2 gap-4">
      {MUSCLES.map((m) => (
        <div
          key={m}
          className={`p-4 rounded-xl text-center ${color(map[m])}`}
        >
          {m.toUpperCase()}
        </div>
      ))}
    </div>
  );
}

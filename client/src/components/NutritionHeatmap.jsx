import { startOfWeek, addDays, format } from "date-fns";
import { getDayScore, getHeatColor } from "../utils/nutritionHeat";

export default function NutritionHeatmap({ data, targets }) {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });

  const days = Array.from({ length: 7 }).map((_, i) => {
    const date = format(addDays(start, i), "yyyy-MM-dd");
    const dayData = data.find((d) => d.date === date);
    const score = getDayScore(dayData, targets);

    return {
      label: format(addDays(start, i), "EEE"),
      score,
    };
  });

  return (
    <div className="flex gap-3 mt-4">
      {days.map((d) => (
        <div key={d.label} className="text-center">
          <div
            className={`w-12 h-12 rounded-lg ${getHeatColor(
              d.score
            )}`}
          />
          <p className="text-xs mt-1 text-gray-300">
            {d.label}
          </p>
        </div>
      ))}
    </div>
  );
}

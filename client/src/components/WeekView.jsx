import { startOfWeek, addDays, format } from "date-fns";

const CATEGORIES = ["Body", "Learning", "Mind", "Spiritual", "Wealth"];

export default function WeekView({ data }) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = [...Array(7)].map((_, i) =>
    format(addDays(weekStart, i), "yyyy-MM-dd")
  );

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-left text-gray-400">Category</th>
            {days.map((d) => (
              <th key={d} className="p-2 text-gray-300">
                {format(new Date(d), "EEE")}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {CATEGORIES.map((cat) => (
            <tr key={cat} className="border-t border-white/10">
              <td className="p-2 font-semibold text-neonBlue">
                {cat}
              </td>

              {days.map((day) => {
                const entry = data.find(
                  (d) => d.date === day && d.category === cat
                );

                return (
                  <td key={day} className="p-2 text-center">
                    {entry ? (
                      <span className="text-green-400 font-bold">
                        {entry.count}
                      </span>
                    ) : (
                      <span className="text-gray-600">•</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

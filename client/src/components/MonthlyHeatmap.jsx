import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

export default function MonthlyHeatmap({ data, month }) {
  const days = eachDayOfInterval({
    start: startOfMonth(new Date(month)),
    end: endOfMonth(new Date(month)),
  }).map((d) => format(d, "yyyy-MM-dd"));

  const categories = [...new Set(data.map((d) => d.category))];

  const lookup = {};
  data.forEach((d) => {
    lookup[`${d.category}_${d.date}`] = d.count;
  });

  const getColor = (count) => {
    if (!count) return "bg-white/5";
    if (count === 1) return "bg-green-500/40";
    if (count === 2) return "bg-green-500/60";
    return "bg-green-500";
  };

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="border-separate border-spacing-1">
        <thead>
          <tr>
            <th></th>
            {days.map((d) => (
              <th
                key={d}
                className="text-xs text-gray-400 text-center"
              >
                {format(new Date(d), "d")}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat}>
              <td className="pr-2 text-sm text-neonBlue">
                {cat}
              </td>

              {days.map((d) => {
                const count = lookup[`${cat}_${d}`] || 0;
                return (
                  <td key={d}>
                    <div
                      title={`${count} completed`}
                      className={`w-4 h-4 rounded ${getColor(
                        count
                      )}`}
                    />
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

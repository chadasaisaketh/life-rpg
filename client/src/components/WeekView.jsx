const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeekView({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left text-gray-400 py-2">Habit</th>
            {days.map((day) => (
              <th key={day} className="text-center text-gray-400">
                {day}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((habit) => (
            <tr key={habit.id} className="border-t border-white/10">
              <td className="py-3">
                <div>
                  <p className="font-semibold">{habit.name}</p>
                  <span
                    className={`text-xs ${
                      {
                        Body: "text-green-400",
                        Learning: "text-blue-400",
                        Spiritual: "text-purple-400",
                        Mind: "text-red-400",
                        Wealth: "text-yellow-400",
                      }[habit.category]
                    }`}
                  >
                    {habit.category}
                  </span>
                </div>
              </td>

              {days.map((day) => {
                const status = habit.week[day];

                let color = "bg-gray-600";
                if (status === "success") color = "bg-green-500";
                if (status === "fail") color = "bg-red-500";

                return (
                  <td key={day} className="text-center">
                    <span
                      className={`inline-block w-4 h-4 rounded-full ${color}`}
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

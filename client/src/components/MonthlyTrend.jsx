import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MonthlyTrend({ data }) {
  const map = {};

  data.forEach((d) => {
    map[d.date] = (map[d.date] || 0) + d.count;
  });

  const chartData = Object.keys(map).map((date) => ({
    date: date.slice(8), // show day only
    value: map[date],
  }));

  return (
    <div className="h-64 bg-cardBg p-4 rounded-xl mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="date" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#22c55e"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

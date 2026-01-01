import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function WeeklyCategoryBar({ data }) {
  // aggregate counts per category
  const categoryMap = {};

  data.forEach((row) => {
    categoryMap[row.category] =
      (categoryMap[row.category] || 0) + row.count;
  });

  const labels = Object.keys(categoryMap);
  const values = Object.values(categoryMap);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Completed habits",
        data: values,
        backgroundColor: [
          "#22c55e", // green
          "#3b82f6", // blue
          "#a855f7", // purple
          "#f97316", // orange
          "#eab308", // yellow
        ],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="mt-8 bg-cardBg p-6 rounded-xl border border-white/10">
      <h3 className="text-lg font-semibold text-neonBlue mb-4">
        Weekly Focus Distribution
      </h3>

      {labels.length === 0 ? (
        <p className="text-gray-400">No data this week</p>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
}

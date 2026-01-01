import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import { format } from "date-fns";
import { CATEGORY_COLORS } from "../utils/categoryColors";

export default function MonthlyCalendar({ data }) {
  const [hoverData, setHoverData] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Build day map
  const dayMap = {};
  data.forEach(({ date, category, count }) => {
    if (!dayMap[date]) {
      dayMap[date] = { total: 0, categories: {} };
    }
    dayMap[date].total += count;
    dayMap[date].categories[category] =
      (dayMap[date].categories[category] || 0) + count;
  });

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return null;

    const key = format(date, "yyyy-MM-dd");
    const day = dayMap[key];

    if (!day) return "cal-0";

    let intensity = "cal-1";
    if (day.total > 2) intensity = "cal-2";
    if (day.total > 5) intensity = "cal-3";

    const dominantCategory = Object.entries(day.categories)
      .sort((a, b) => b[1] - a[1])[0][0];

    const categoryClass =
      CATEGORY_COLORS[dominantCategory] || "";

    return `${intensity} ${categoryClass}`;
  };

  const handleHover = (date, event) => {
    const key = format(date, "yyyy-MM-dd");
    if (!dayMap[key]) return;

    setHoverData({ date: key, ...dayMap[key] });
    setPosition({ x: event.clientX, y: event.clientY });
  };

  const clearHover = () => setHoverData(null);

  return (
    <div className="relative bg-cardBg p-4 rounded-xl">
      <Calendar
        view="month"
        showNeighboringMonth={false}
        tileClassName={tileClassName}
        tileContent={({ date, view }) =>
          view === "month" ? (
            <div
              onMouseEnter={(e) => handleHover(date, e)}
              onMouseLeave={clearHover}
              className="w-full h-full"
            />
          ) : null
        }
      />

      {/* HOVER POPUP */}
      {hoverData && (
        <div
          className="fixed z-50 bg-black/90 text-white p-3 rounded-lg shadow-lg text-sm"
          style={{
            top: position.y + 10,
            left: position.x + 10,
          }}
        >
          <div className="font-semibold text-neonBlue mb-1">
            {hoverData.date}
          </div>

          <div className="space-y-1">
            {Object.entries(hoverData.categories).map(
              ([cat, count]) => (
                <div key={cat} className="flex justify-between">
                  <span>{cat}</span>
                  <span className="text-neonPurple">{count}</span>
                </div>
              )
            )}
          </div>

          <div className="mt-2 text-green-400 font-bold">
            Total: {hoverData.total}
          </div>
        </div>
      )}
    </div>
  );
}

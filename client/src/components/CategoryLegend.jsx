import { CATEGORY_COLORS } from "../utils/categoryColors";

export default function CategoryLegend() {
  return (
    <div className="flex gap-4 text-sm text-gray-300 mt-4">
      {Object.keys(CATEGORY_COLORS).map((cat) => (
        <div key={cat} className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded ${CATEGORY_COLORS[cat]}`}
          />
          {cat}
        </div>
      ))}
    </div>
  );
}

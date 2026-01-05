export default function ProgressRing({
  label,
  value = 0,
  target = 0,
  unit = "",
}) {
  const percent = target
    ? Math.min(Math.round((value / target) * 100), 150)
    : 0;

  let color = "stroke-red-500";
  if (percent >= 90 && percent <= 110) color = "stroke-green-400";
  else if (percent >= 70) color = "stroke-yellow-400";

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="8"
          fill="none"
          className={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>

      <p className="mt-2 text-sm text-gray-400">
        {label}
      </p>
      <p className="text-sm font-semibold text-white">
        {value}/{target} {unit}
      </p>
    </div>
  );
}

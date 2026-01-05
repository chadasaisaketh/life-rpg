export function getDayScore(day, targets) {
  if (!day || !targets) return 0;

  const keys = ["calories", "protein", "carbs", "fats"];

  const percents = keys.map((k) => {
    if (!targets[k]) return 0;
    return Math.min((day[k] || 0) / targets[k], 1);
  });

  const avg =
    percents.reduce((a, b) => a + b, 0) / keys.length;

  return avg;
}

export function getHeatColor(score) {
  if (score >= 0.9) return "bg-green-500/80";
  if (score >= 0.6) return "bg-yellow-400/80";
  return "bg-red-500/80";
}

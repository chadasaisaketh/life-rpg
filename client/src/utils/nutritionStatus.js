export function getStatus(value, target) {
  if (!target || target === 0) return null;

  const percent = (value / target) * 100;

  if (percent >= 100) {
    return { label: "Optimal", color: "text-green-400" };
  }
  if (percent >= 70) {
    return { label: "Low", color: "text-yellow-400" };
  }
  return { label: "Deficient", color: "text-red-400" };
}

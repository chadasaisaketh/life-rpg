/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0a0a0f",
        cardBg: "#111827",
        neonPurple: "#a855f7",
        neonBlue: "#22d3ee",
        neonPink: "#ec4899",
      },
      boxShadow: {
        neon: "0 0 20px rgba(168,85,247,0.6)",
        neonStrong: "0 0 40px rgba(34,211,238,0.8)",
      },
    },
  },
  plugins: [],
};

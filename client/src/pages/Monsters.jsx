import { useEffect, useState } from "react";
import { getMonsters } from "../services/monsters.service";

export default function Monsters() {
  const [monsters, setMonsters] = useState([]);

  useEffect(() => {
    getMonsters().then(setMonsters);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-neonPurple mb-6">
        Monsters
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {monsters.map((m) => (
          <div
            key={m.type}
            className={`p-4 rounded-xl border
              ${
                m.is_shadow
                  ? "bg-black/60 border-white/10 opacity-40"
                  : m.is_alive
                  ? "bg-black/40 border-red-500 shadow-red-500/40"
                  : "bg-black/20 border-gray-600"
              }`}
          >
            <h2 className="font-semibold mb-2">{m.name}</h2>

            {m.is_shadow && (
              <p className="text-sm text-gray-500">
                Shadow form — awaken conditions unmet
              </p>
            )}

            {!m.is_shadow && m.is_alive && (
              <>
                <div className="w-full bg-black/60 h-2 rounded">
                  <div
                    className="bg-red-500 h-2 rounded"
                    style={{
                      width: `${m.hp}%`,
                    }}
                  />
                </div>
                <p className="text-xs mt-2 text-gray-400">
                  HP: {m.hp} / {m.max_hp}
                </p>
              </>
            )}

            {!m.is_shadow && !m.is_alive && (
              <p className="text-green-400 font-semibold">
                Defeated 🏆
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

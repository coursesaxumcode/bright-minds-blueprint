import { useState, useEffect } from "react";
import { GameShell } from "@/components/game/GameShell";
import { RewardOverlay } from "@/components/game/RewardOverlay";
import { completeGame } from "@/lib/store";
import { playPop, playSuccess, playWrong, speak } from "@/lib/feedback";

interface Item {
  key: string;
  emoji: string;
  cat: "fruit" | "veg";
}

const ITEMS: Item[] = [
  { key: "apple", emoji: "🍎", cat: "fruit" },
  { key: "banana", emoji: "🍌", cat: "fruit" },
  { key: "orange", emoji: "🍊", cat: "fruit" },
  { key: "carrot", emoji: "🥕", cat: "veg" },
  { key: "broccoli", emoji: "🥦", cat: "veg" },
  { key: "corn", emoji: "🌽", cat: "veg" },
];

export function Sorting() {
  const [done, setDone] = useState<string[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [glow, setGlow] = useState<string | null>(null);
  const [shake, setShake] = useState<string | null>(null);
  const [won, setWon] = useState(false);

  useEffect(() => {
    speak("Put the food in the right basket");
  }, []);

  function drop(cat: "fruit" | "veg") {
    if (!selected) return;
    if (selected.cat === cat) {
      playSuccess();
      setGlow(cat);
      setTimeout(() => setGlow(null), 500);
      const next = [...done, selected.key];
      setDone(next);
      setSelected(null);
      if (next.length >= ITEMS.length) {
        completeGame("sorting", "sorting", 100);
        setTimeout(() => setWon(true), 500);
      }
    } else {
      playWrong();
      setShake(cat);
      setTimeout(() => setShake(null), 400);
    }
  }

  const remaining = ITEMS.filter((i) => !done.includes(i.key));

  return (
    <GameShell title="Fruit Basket" instruction="Tap a food, then its basket">
      <div className="flex w-full max-w-xl flex-col gap-8">
        <div className="flex min-h-[120px] flex-wrap items-center justify-center gap-4">
          {remaining.map((it) => (
            <button
              key={it.key}
              onClick={() => {
                playPop();
                setSelected(it);
              }}
              className={`flex size-24 items-center justify-center rounded-4xl bg-card text-6xl shadow-pop transition-transform active:scale-95 ${
                selected?.key === it.key ? "ring-4 ring-primary" : ""
              }`}
            >
              {it.emoji}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-5">
          {(["fruit", "veg"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => drop(cat)}
              className={`flex min-h-[160px] flex-1 flex-col items-center justify-center gap-2 rounded-4xl bg-muted p-4 shadow-pop transition-all active:scale-95 ${
                shake === cat ? "animate-wiggle" : ""
              } ${glow === cat ? "bg-success/30 ring-4 ring-success" : ""}`}
            >
              <span className="text-6xl">{cat === "fruit" ? "🍓" : "🥬"}</span>
              <span className="text-xl font-extrabold text-foreground">
                {cat === "fruit" ? "Fruits" : "Veggies"}
              </span>
            </button>
          ))}
        </div>
      </div>
      {won && <RewardOverlay stars={3} />}
    </GameShell>
  );
}

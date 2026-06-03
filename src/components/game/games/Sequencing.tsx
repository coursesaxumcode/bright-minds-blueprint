import { useState, useEffect } from "react";
import { GameShell } from "@/components/game/GameShell";
import { RewardOverlay } from "@/components/game/RewardOverlay";
import { completeGame } from "@/lib/store";
import { playPop, playSuccess, playWrong, speak } from "@/lib/feedback";

interface Step {
  key: string;
  emoji: string;
  label: string;
}

// correct order top-to-bottom
const STEPS: Step[] = [
  { key: "pick", emoji: "🪥", label: "Pick Brush" },
  { key: "paste", emoji: "🧴", label: "Add Paste" },
  { key: "brush", emoji: "😬", label: "Brush Teeth" },
  { key: "rinse", emoji: "🚿", label: "Rinse" },
];

function shuffle<T>(a: T[]): T[] {
  return [...a].sort(() => Math.random() - 0.5);
}

export function Sequencing() {
  const [pool] = useState(() => shuffle(STEPS));
  const [order, setOrder] = useState<string[]>([]);
  const [shake, setShake] = useState<string | null>(null);
  const [won, setWon] = useState(false);

  useEffect(() => {
    speak("Put the steps in the right order");
  }, []);

  function tap(step: Step) {
    if (order.includes(step.key)) return;
    const expected = STEPS[order.length].key;
    if (step.key === expected) {
      playSuccess();
      const next = [...order, step.key];
      setOrder(next);
      if (next.length >= STEPS.length) {
        completeGame("sequencing", "sequencing", 100);
        setTimeout(() => setWon(true), 500);
      }
    } else {
      playWrong();
      setShake(step.key);
      setTimeout(() => setShake(null), 400);
    }
  }

  return (
    <GameShell title="Brush Teeth Order" instruction="What comes first? Tap in order">
      <div className="flex w-full max-w-md flex-col gap-4">
        {pool.map((s) => {
          const idx = order.indexOf(s.key);
          const placed = idx >= 0;
          return (
            <button
              key={s.key}
              onClick={() => {
                playPop();
                tap(s);
              }}
              className={`flex min-h-[88px] items-center gap-4 rounded-4xl bg-card p-4 shadow-pop transition-transform active:scale-95 ${
                shake === s.key ? "animate-wiggle" : ""
              } ${placed ? "bg-success/20 ring-4 ring-success" : ""}`}
            >
              <span className="text-5xl">{s.emoji}</span>
              <span className="flex-1 text-left text-2xl font-extrabold text-foreground">{s.label}</span>
              {placed && (
                <span className="flex size-10 items-center justify-center rounded-full bg-success text-xl font-extrabold text-success-foreground">
                  {idx + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {won && <RewardOverlay stars={3} />}
    </GameShell>
  );
}

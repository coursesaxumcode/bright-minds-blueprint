import { useState, useEffect } from "react";
import { GameShell } from "@/components/game/GameShell";
import { RewardOverlay } from "@/components/game/RewardOverlay";
import { completeGame } from "@/lib/store";
import { playPop, playSuccess, playWrong, speak } from "@/lib/feedback";

const FACES = [
  { key: "happy", emoji: "🙂", name: "happy" },
  { key: "sad", emoji: "😢", name: "sad" },
  { key: "angry", emoji: "😡", name: "angry" },
  { key: "scared", emoji: "😨", name: "scared" },
];

const ROUNDS = ["happy", "sad", "angry"];

export function Emotions() {
  const [round, setRound] = useState(0);
  const [shake, setShake] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const target = ROUNDS[round];

  useEffect(() => {
    speak(`Tap the ${target} face`);
  }, [target]);

  function pick(key: string) {
    if (key === target) {
      playSuccess();
      if (round + 1 >= ROUNDS.length) {
        completeGame("emotions", "social", 100);
        setTimeout(() => setWon(true), 400);
      } else {
        setTimeout(() => setRound(round + 1), 400);
      }
    } else {
      playWrong();
      setShake(key);
      setTimeout(() => setShake(null), 400);
    }
  }

  return (
    <GameShell title="Find The Feeling" instruction={`Tap the ${target} face`}>
      <div className="grid grid-cols-2 gap-5">
        {FACES.map((f) => (
          <button
            key={f.key}
            onClick={() => {
              playPop();
              pick(f.key);
            }}
            className={`flex size-32 items-center justify-center rounded-4xl bg-card text-7xl shadow-pop transition-transform active:scale-95 ${
              shake === f.key ? "animate-wiggle" : ""
            }`}
          >
            {f.emoji}
          </button>
        ))}
      </div>
      {won && <RewardOverlay stars={3} />}
    </GameShell>
  );
}

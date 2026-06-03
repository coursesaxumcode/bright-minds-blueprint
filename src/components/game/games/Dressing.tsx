import { useState, useEffect } from "react";
import { GameShell } from "@/components/game/GameShell";
import { RewardOverlay } from "@/components/game/RewardOverlay";
import { completeGame } from "@/lib/store";
import { playPop, playSuccess, playWrong, speak } from "@/lib/feedback";

interface Round {
  weather: string;
  label: string;
  answer: string;
  choices: { key: string; emoji: string }[];
}

const ROUNDS: Round[] = [
  {
    weather: "☀️",
    label: "It is sunny and hot",
    answer: "tshirt",
    choices: [
      { key: "tshirt", emoji: "👕" },
      { key: "jacket", emoji: "🧥" },
      { key: "scarf", emoji: "🧣" },
    ],
  },
  {
    weather: "❄️",
    label: "It is cold and snowy",
    answer: "jacket",
    choices: [
      { key: "tshirt", emoji: "👕" },
      { key: "jacket", emoji: "🧥" },
      { key: "shorts", emoji: "🩳" },
    ],
  },
];

export function Dressing() {
  const [round, setRound] = useState(0);
  const [shake, setShake] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const r = ROUNDS[round];

  useEffect(() => {
    speak(`${r.label}. What should we wear?`);
  }, [r.label]);

  function pick(key: string) {
    if (key === r.answer) {
      playSuccess();
      if (round + 1 >= ROUNDS.length) {
        completeGame("dressing", "dressing", 100);
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
    <GameShell title="Dress For Weather" instruction={r.label}>
      <div className="mb-10 flex flex-col items-center gap-2">
        <span className="text-[7rem] leading-none">{r.weather}</span>
      </div>
      <div className="flex gap-5">
        {r.choices.map((c) => (
          <button
            key={c.key}
            onClick={() => {
              playPop();
              pick(c.key);
            }}
            className={`flex size-28 items-center justify-center rounded-4xl bg-card text-6xl shadow-pop transition-transform active:scale-95 ${
              shake === c.key ? "animate-wiggle" : ""
            }`}
          >
            {c.emoji}
          </button>
        ))}
      </div>
      {won && <RewardOverlay stars={3} />}
    </GameShell>
  );
}

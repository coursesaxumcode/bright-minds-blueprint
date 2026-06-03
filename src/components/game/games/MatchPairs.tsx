import { useState, useEffect } from "react";
import { GameShell } from "@/components/game/GameShell";
import { RewardOverlay } from "@/components/game/RewardOverlay";
import { completeGame } from "@/lib/store";
import { playPop, playSuccess, playWrong, speak } from "@/lib/feedback";
import type { SkillId } from "@/lib/worlds";

interface MatchItem {
  key: string;
  label: string; // emoji or color
  isColor?: boolean;
  color?: string;
}

interface MatchPairsProps {
  gameId: string;
  skill: SkillId;
  title: string;
  instruction: string;
  items: MatchItem[];
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function MatchPairs({ gameId, skill, title, instruction, items }: MatchPairsProps) {
  const [bottom] = useState(() => shuffle(items));
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [won, setWon] = useState(false);

  useEffect(() => {
    speak(instruction);
  }, [instruction]);

  function renderFace(it: MatchItem, big = false) {
    if (it.isColor) {
      return (
        <span
          className={`block rounded-full ${big ? "size-16" : "size-14"}`}
          style={{ backgroundColor: it.color }}
        />
      );
    }
    return <span className={big ? "text-6xl" : "text-5xl"}>{it.label}</span>;
  }

  function tapBottom(it: MatchItem) {
    if (matched.includes(it.key) || won) return;
    if (selected === it.key) {
      playSuccess();
      const next = [...matched, it.key];
      setMatched(next);
      setSelected(null);
      if (next.length >= items.length) {
        completeGame(gameId, skill, 100);
        setTimeout(() => setWon(true), 500);
      }
    } else {
      playWrong();
      setWrong(it.key);
      setTimeout(() => setWrong(null), 400);
    }
  }

  return (
    <GameShell title={title} instruction={instruction}>
      <div className="flex w-full max-w-xl flex-col gap-10">
        <div className="flex flex-wrap justify-center gap-4">
          {items.map((it) => {
            const isDone = matched.includes(it.key);
            return (
              <button
                key={it.key}
                onClick={() => {
                  if (!isDone) {
                    playPop();
                    setSelected(it.key);
                  }
                }}
                className={`flex size-24 items-center justify-center rounded-4xl bg-card shadow-pop transition-transform active:scale-95 ${
                  selected === it.key ? "ring-4 ring-primary" : ""
                } ${isDone ? "opacity-30" : ""}`}
              >
                {renderFace(it, true)}
              </button>
            );
          })}
        </div>

        <div className="text-center text-lg font-bold text-muted-foreground">⬇ Match below ⬇</div>

        <div className="flex flex-wrap justify-center gap-4">
          {bottom.map((it) => {
            const isDone = matched.includes(it.key);
            return (
              <button
                key={it.key}
                onClick={() => tapBottom(it)}
                className={`flex size-24 items-center justify-center rounded-4xl bg-muted shadow-pop transition-transform active:scale-95 ${
                  wrong === it.key ? "animate-wiggle" : ""
                } ${isDone ? "bg-success/30 ring-4 ring-success" : ""}`}
              >
                {renderFace(it)}
              </button>
            );
          })}
        </div>
      </div>
      {won && <RewardOverlay stars={3} />}
    </GameShell>
  );
}

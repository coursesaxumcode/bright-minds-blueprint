import { useState, useEffect, useRef } from "react";
import { GameShell } from "@/components/game/GameShell";
import { RewardOverlay } from "@/components/game/RewardOverlay";
import { completeGame } from "@/lib/store";
import { playPop, speak } from "@/lib/feedback";

const TARGET = 5;

export function TapStar() {
  const [count, setCount] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [won, setWon] = useState(false);
  const sparkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    speak("Tap the star");
  }, []);

  useEffect(() => {
    if (won) return;
    const t = setInterval(() => {
      setPos({ x: 15 + Math.random() * 70, y: 15 + Math.random() * 70 });
    }, 1600);
    return () => clearInterval(t);
  }, [won]);

  function tap() {
    playPop();
    const next = count + 1;
    setCount(next);
    setPos({ x: 15 + Math.random() * 70, y: 15 + Math.random() * 70 });
    if (next >= TARGET) {
      completeGame("tap-star", "attention", 100);
      setWon(true);
    }
  }

  return (
    <GameShell title="Tap The Star" instruction="Tap the star! ⭐">
      <div className="mb-6 text-3xl font-extrabold text-star">
        {"⭐".repeat(count)}
        <span className="opacity-20">{"⭐".repeat(Math.max(0, TARGET - count))}</span>
      </div>
      <div className="relative h-[60vh] w-full max-w-xl rounded-4xl bg-gradient-to-b from-primary/10 to-accent/10">
        <button
          onClick={tap}
          aria-label="Star"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 text-7xl transition-all duration-700 ease-out active:scale-125"
        >
          ⭐
        </button>
        <div ref={sparkRef} />
      </div>
      {won && <RewardOverlay stars={3} />}
    </GameShell>
  );
}

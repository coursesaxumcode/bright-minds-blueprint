import { useState, useEffect } from "react";
import { GameShell } from "@/components/game/GameShell";
import { RewardOverlay } from "@/components/game/RewardOverlay";
import { completeGame } from "@/lib/store";
import { playPop, playSuccess, speak } from "@/lib/feedback";

interface Scene {
  voice: string;
  action: string; // emoji button
  visual: string;
}

const SCENES: Scene[] = [
  { voice: "Turn on the water", action: "🚰", visual: "🚰" },
  { voice: "Use the soap", action: "🧼", visual: "🫧" },
  { voice: "Rub your hands together", action: "👐", visual: "🤲" },
  { voice: "Rinse your hands", action: "💧", visual: "💦" },
  { voice: "Dry your hands", action: "🧻", visual: "✨" },
];

export function HandWashing() {
  const [step, setStep] = useState(0);
  const [won, setWon] = useState(false);
  const scene = SCENES[step];

  useEffect(() => {
    if (scene) speak(scene.voice);
  }, [step, scene]);

  function tap() {
    playSuccess();
    if (step + 1 >= SCENES.length) {
      completeGame("handwashing", "hygiene", 100);
      setTimeout(() => setWon(true), 500);
    } else {
      setTimeout(() => setStep(step + 1), 400);
    }
  }

  return (
    <GameShell title="Wash Hands" instruction={scene?.voice}>
      <div className="flex w-full max-w-md flex-col items-center gap-10">
        {/* progress dots */}
        <div className="flex gap-2">
          {SCENES.map((_, i) => (
            <span
              key={i}
              className={`size-4 rounded-full ${i <= step ? "bg-success" : "bg-muted"}`}
            />
          ))}
        </div>

        <div className="flex h-56 w-full items-center justify-center rounded-4xl bg-gradient-to-b from-primary/10 to-accent/10 text-[7rem]">
          <span key={step} className="animate-pop">{scene.visual}</span>
        </div>

        <button
          onClick={() => {
            playPop();
            tap();
          }}
          className="flex size-32 items-center justify-center rounded-full bg-primary text-7xl shadow-pop transition-transform active:scale-90"
          aria-label={scene.voice}
        >
          {scene.action}
        </button>
      </div>
      {won && <RewardOverlay stars={3} />}
    </GameShell>
  );
}

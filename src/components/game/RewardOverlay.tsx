import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { playCheer, speak } from "@/lib/feedback";

interface RewardOverlayProps {
  stars: number; // 1-3
}

/** Simple, non-overstimulating celebration shown after an activity. */
export function RewardOverlay({ stars }: RewardOverlayProps) {
  const navigate = useNavigate();

  useEffect(() => {
    playCheer();
    speak("Great job!");
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background/95 px-6 text-center">
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="animate-pop text-7xl"
            style={{ animationDelay: `${i * 0.18}s`, opacity: i < stars ? 1 : 0.2 }}
          >
            ⭐
          </span>
        ))}
      </div>

      <h2 className="text-5xl text-success">Great Job!</h2>

      <div className="flex gap-4 text-2xl font-bold text-foreground">
        <span className="rounded-2xl bg-card px-5 py-3 shadow-pop">+20 XP</span>
        <span className="rounded-2xl bg-card px-5 py-3 shadow-pop">+5 🪙</span>
      </div>

      <button
        onClick={() => navigate({ to: "/map" })}
        className="mt-4 min-h-[88px] w-full max-w-sm rounded-3xl bg-primary text-3xl font-extrabold text-primary-foreground shadow-pop transition-transform active:scale-95"
      >
        Next →
      </button>
    </div>
  );
}

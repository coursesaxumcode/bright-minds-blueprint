import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCurrentProfile, overallProgress } from "@/lib/store";
import { playPop, speak } from "@/lib/feedback";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Home — SkillQuest" }] }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const profile = useCurrentProfile();

  useEffect(() => {
    if (!profile) navigate({ to: "/profiles" });
  }, [profile, navigate]);

  if (!profile) return null;
  const progress = overallProgress(profile);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-primary/10 via-background to-accent/10 px-5 py-6">
      <header className="flex items-center justify-between text-xl font-extrabold">
        <span className="rounded-2xl bg-card px-4 py-2 text-star shadow-pop">⭐ {profile.stars}</span>
        <span className="rounded-2xl bg-card px-4 py-2 text-secondary shadow-pop">❤️ Level {profile.level}</span>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="animate-float text-[8rem] leading-none">{profile.avatar}</div>
        <h1 className="text-4xl text-foreground">Hi, {profile.name}!</h1>
        <p className="text-2xl font-bold text-primary">🌟 Foundation World</p>

        <button
          onClick={() => {
            playPop();
            speak("Let's play!");
            navigate({ to: "/map" });
          }}
          className="min-h-[100px] w-full max-w-md rounded-4xl bg-primary text-4xl font-extrabold text-primary-foreground shadow-pop transition-transform active:scale-95"
        >
          ▶ Play
        </button>

        <div className="w-full max-w-md">
          <div className="mb-2 text-lg font-bold text-muted-foreground">Progress {progress}%</div>
          <div className="h-6 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-success transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillQuest — Learning Games for Every Child" },
      { name: "description", content: "Gentle, voice-guided learning games for special-needs children." },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/profiles" }), 2200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-primary/15 via-background to-accent/15 px-6 text-center">
      <div className="animate-float text-[7rem] leading-none">🌈</div>
      <h1 className="text-6xl text-primary">SkillQuest</h1>
      <p className="text-2xl font-bold text-muted-foreground">Learning, one happy step at a time</p>
      <div className="mt-2 flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-4 animate-pop rounded-full bg-primary"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}

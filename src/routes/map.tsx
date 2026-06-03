import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { WORLDS } from "@/lib/worlds";
import { useCurrentProfile } from "@/lib/store";
import { playPop } from "@/lib/feedback";

export const Route = createFileRoute("/map")({
  head: () => ({ meta: [{ title: "World Map — SkillQuest" }] }),
  component: WorldMap,
});

function WorldMap() {
  const navigate = useNavigate();
  const profile = useCurrentProfile();

  useEffect(() => {
    if (!profile) navigate({ to: "/profiles" });
  }, [profile, navigate]);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-background/90 px-4 py-4 backdrop-blur">
        <Link
          to="/home"
          aria-label="Go home"
          className="flex size-14 items-center justify-center rounded-2xl bg-card shadow-pop active:scale-90"
        >
          <ArrowLeft className="size-7" />
        </Link>
        <h1 className="text-3xl text-primary">Adventure Map</h1>
      </header>

      <div className="mx-auto flex max-w-xl flex-col gap-10 px-5 pt-4">
        {WORLDS.map((world) => (
          <section key={world.id}>
            <div className="mb-5 flex items-center gap-3">
              <span className="text-4xl">{world.emoji}</span>
              <h2 className="text-2xl text-foreground">{world.title}</h2>
            </div>

            <div className="flex flex-col gap-5">
              {world.games.map((game, i) => {
                const done = profile.completed.includes(game.id);
                return (
                  <button
                    key={game.id}
                    onClick={() => {
                      playPop();
                      navigate({ to: "/play/$gameId", params: { gameId: game.id } });
                    }}
                    style={{ marginLeft: `${(i % 3) * 22}%` }}
                    className="flex min-h-[96px] w-[78%] items-center gap-4 rounded-4xl bg-card p-4 text-left shadow-pop transition-transform active:scale-95"
                  >
                    <span className="flex size-16 shrink-0 items-center justify-center rounded-3xl bg-muted text-4xl">
                      {game.emoji}
                    </span>
                    <span className="flex-1 text-xl font-extrabold text-foreground">{game.title}</span>
                    {done && (
                      <span className="flex size-10 items-center justify-center rounded-full bg-success text-success-foreground">
                        <Check className="size-6" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        {/* Locked future worlds hint */}
        <section className="opacity-60">
          <div className="flex items-center gap-3 rounded-4xl border-4 border-dashed border-muted-foreground/30 p-5">
            <Lock className="size-8 text-muted-foreground" />
            <span className="text-xl font-extrabold text-muted-foreground">More worlds coming soon</span>
          </div>
        </section>
      </div>
    </div>
  );
}

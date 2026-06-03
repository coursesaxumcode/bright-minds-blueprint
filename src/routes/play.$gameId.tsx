import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { findGame } from "@/lib/worlds";
import { useCurrentProfile } from "@/lib/store";
import { TapStar } from "@/components/game/games/TapStar";
import { MatchPairs } from "@/components/game/games/MatchPairs";
import { Sorting } from "@/components/game/games/Sorting";
import { Patterns } from "@/components/game/games/Patterns";
import { Memory } from "@/components/game/games/Memory";
import { Sequencing } from "@/components/game/games/Sequencing";
import { CauseEffect } from "@/components/game/games/CauseEffect";
import { Emotions } from "@/components/game/games/Emotions";
import { HandWashing } from "@/components/game/games/HandWashing";
import { Dressing } from "@/components/game/games/Dressing";

export const Route = createFileRoute("/play/$gameId")({
  head: () => ({ meta: [{ title: "Play — SkillQuest" }] }),
  component: Play,
});

function Play() {
  const { gameId } = Route.useParams();
  const navigate = useNavigate();
  const profile = useCurrentProfile();
  const game = findGame(gameId);

  useEffect(() => {
    if (!profile) navigate({ to: "/profiles" });
  }, [profile, navigate]);

  if (!profile) return null;

  if (!game) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-7xl">🤔</span>
        <h1 className="text-3xl text-foreground">Game not found</h1>
        <Link to="/map" className="rounded-2xl bg-primary px-6 py-3 text-xl font-extrabold text-primary-foreground">
          Back to map
        </Link>
      </div>
    );
  }

  switch (gameId) {
    case "tap-star":
      return <TapStar />;
    case "match-colors":
      return (
        <MatchPairs
          gameId="match-colors"
          skill="matching"
          title="Match Colors"
          instruction="Match the same colors"
          items={[
            { key: "red", label: "red", isColor: true, color: "#ef4444" },
            { key: "blue", label: "blue", isColor: true, color: "#3b82f6" },
            { key: "green", label: "green", isColor: true, color: "#22c55e" },
            { key: "yellow", label: "yellow", isColor: true, color: "#eab308" },
          ]}
        />
      );
    case "sorting":
      return <Sorting />;
    case "patterns":
      return <Patterns />;
    case "memory":
      return <Memory />;
    case "sequencing":
      return <Sequencing />;
    case "cause-effect":
      return <CauseEffect />;
    case "emotions":
      return <Emotions />;
    case "handwashing":
      return <HandWashing />;
    case "dressing":
      return <Dressing />;
    default:
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-7xl">🚧</span>
          <h1 className="text-3xl text-foreground">Coming soon!</h1>
          <Link to="/map" className="rounded-2xl bg-primary px-6 py-3 text-xl font-extrabold text-primary-foreground">
            Back to map
          </Link>
        </div>
      );
  }
}

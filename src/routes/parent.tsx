import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import { WORLDS, SKILL_LABELS, type SkillId } from "@/lib/worlds";

export const Route = createFileRoute("/parent")({
  head: () => ({ meta: [{ title: "Parent Dashboard — SkillQuest" }] }),
  component: Parent,
});

function ParentGate({ onPass }: { onPass: () => void }) {
  const [a] = useState(() => 3 + Math.floor(Math.random() * 6));
  const [b] = useState(() => 2 + Math.floor(Math.random() * 6));
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="text-6xl">🔒</span>
      <h1 className="text-3xl text-foreground">Parents Only</h1>
      <p className="text-xl font-bold text-muted-foreground">
        What is {a} + {b}?
      </p>
      <input
        inputMode="numeric"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="w-40 rounded-2xl border-4 border-input bg-background px-4 py-3 text-center text-2xl font-bold focus:border-primary focus:outline-none"
      />
      {err && <p className="font-bold text-destructive">Try again</p>}
      <button
        onClick={() => (Number(val) === a + b ? onPass() : setErr(true))}
        className="min-h-[72px] w-full max-w-xs rounded-2xl bg-primary text-xl font-extrabold text-primary-foreground shadow-pop active:scale-95"
      >
        Enter
      </button>
      <Link to="/profiles" className="text-lg font-bold text-muted-foreground underline">
        Back
      </Link>
    </div>
  );
}

function band(v: number) {
  if (v >= 75) return { color: "bg-success", text: "Mastered" };
  if (v >= 40) return { color: "bg-warning", text: "Developing" };
  return { color: "bg-destructive", text: "Needs support" };
}

function Parent() {
  const [unlocked, setUnlocked] = useState(false);
  const { profiles } = useStore();

  const allSkills = useMemo(() => {
    const set = new Set<SkillId>();
    WORLDS.forEach((w) => w.games.forEach((g) => set.add(g.skill)));
    return [...set];
  }, []);

  if (!unlocked) return <ParentGate onPass={() => setUnlocked(true)} />;

  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="flex items-center gap-3 px-4 py-4">
        <Link
          to="/profiles"
          aria-label="Back"
          className="flex size-12 items-center justify-center rounded-2xl bg-card shadow-pop active:scale-90"
        >
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="text-2xl text-primary">Parent Dashboard</h1>
      </header>

      <div className="mx-auto max-w-2xl px-5">
        {profiles.length === 0 && (
          <p className="mt-10 text-center text-lg font-bold text-muted-foreground">
            No children added yet.
          </p>
        )}

        {profiles.map((p) => (
          <section key={p.id} className="mb-10 rounded-4xl bg-card p-5 shadow-pop">
            <div className="mb-5 flex items-center gap-3">
              <span className="text-5xl">{p.avatar}</span>
              <div>
                <h2 className="text-2xl text-foreground">{p.name}</h2>
                <p className="text-sm font-bold text-muted-foreground">
                  Level {p.level} · ⭐ {p.stars} · 🪙 {p.coins}
                </p>
              </div>
            </div>

            <h3 className="mb-3 text-lg text-foreground">Skill Overview</h3>
            <div className="flex flex-col gap-3">
              {allSkills.map((skill) => {
                const v = p.skills[skill] ?? 0;
                const b = band(v);
                return (
                  <div key={skill}>
                    <div className="mb-1 flex justify-between text-sm font-bold">
                      <span className="text-foreground">{SKILL_LABELS[skill]}</span>
                      <span className="text-muted-foreground">{v}% · {b.text}</span>
                    </div>
                    <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
                      <div className={`h-full rounded-full ${b.color} transition-all`} style={{ width: `${v}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <p className="px-2 text-center text-sm font-semibold text-muted-foreground">
          <span className="text-success">●</span> Mastered &nbsp;
          <span className="text-warning">●</span> Developing &nbsp;
          <span className="text-destructive">●</span> Needs support
        </p>
      </div>
    </div>
  );
}

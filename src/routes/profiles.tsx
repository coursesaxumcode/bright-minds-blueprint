import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Settings } from "lucide-react";
import { useStore, addProfile, selectProfile, nextAvatar } from "@/lib/store";
import { speak, playPop } from "@/lib/feedback";

export const Route = createFileRoute("/profiles")({
  head: () => ({ meta: [{ title: "Choose Player — SkillQuest" }] }),
  component: Profiles,
});

const AVATAR_CHOICES = ["👦", "👧", "🧒", "🦊", "🐻", "🐼", "🐧", "🦄"];

function Profiles() {
  const { profiles } = useStore();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(nextAvatar());

  function choose(id: string, label: string) {
    playPop();
    speak(`Hi ${label}`);
    selectProfile(id);
    navigate({ to: "/home" });
  }

  function create() {
    if (!name.trim()) return;
    addProfile(name, avatar);
    navigate({ to: "/home" });
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center px-5 py-8">
      <Link
        to="/parent"
        aria-label="Parent area"
        className="absolute right-4 top-4 flex size-14 items-center justify-center rounded-2xl bg-card text-muted-foreground shadow-pop"
      >
        <Settings className="size-7" />
      </Link>

      <h1 className="mt-6 mb-8 text-5xl text-primary">Choose Player</h1>

      {!adding ? (
        <div className="grid w-full max-w-2xl grid-cols-2 gap-5">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => choose(p.id, p.name)}
              className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-4xl bg-card p-6 shadow-pop transition-transform active:scale-95"
            >
              <span className="text-7xl">{p.avatar}</span>
              <span className="text-2xl font-extrabold text-foreground">{p.name}</span>
              <span className="text-base font-bold text-star">⭐ {p.stars}</span>
            </button>
          ))}

          <button
            onClick={() => {
              setAvatar(nextAvatar());
              setAdding(true);
            }}
            className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-4xl border-4 border-dashed border-primary/40 bg-primary/5 p-6 text-primary transition-transform active:scale-95"
          >
            <Plus className="size-14" />
            <span className="text-2xl font-extrabold">New Child</span>
          </button>
        </div>
      ) : (
        <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-4xl bg-card p-6 shadow-pop">
          <span className="text-8xl">{avatar}</span>
          <div className="flex flex-wrap justify-center gap-2">
            {AVATAR_CHOICES.map((a) => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                className={`flex size-14 items-center justify-center rounded-2xl text-3xl transition-transform active:scale-90 ${
                  avatar === a ? "bg-primary/20 ring-4 ring-primary" : "bg-muted"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full rounded-2xl border-4 border-input bg-background px-5 py-4 text-center text-2xl font-bold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <div className="flex w-full gap-3">
            <button
              onClick={() => setAdding(false)}
              className="min-h-[72px] flex-1 rounded-2xl bg-muted text-xl font-extrabold text-muted-foreground active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={create}
              className="min-h-[72px] flex-[2] rounded-2xl bg-primary text-xl font-extrabold text-primary-foreground shadow-pop active:scale-95"
            >
              Start
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

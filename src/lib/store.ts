import { useSyncExternalStore } from "react";
import type { SkillId } from "./worlds";
import { ALL_GAMES } from "./worlds";

export interface Profile {
  id: string;
  name: string;
  avatar: string; // emoji
  stars: number;
  coins: number;
  xp: number;
  level: number;
  completed: string[]; // game ids completed at least once
  skills: Partial<Record<SkillId, number>>; // 0-100 mastery
}

interface StoreState {
  profiles: Profile[];
  currentId: string | null;
}

const KEY = "skillquest.v1";

const AVATARS = ["👦", "👧", "🧒", "👶", "🦊", "🐻", "🐼", "🐧"];

function load(): StoreState {
  if (typeof localStorage === "undefined") return { profiles: [], currentId: null };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as StoreState;
  } catch {
    /* ignore */
  }
  return { profiles: [], currentId: null };
}

let state: StoreState = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return state;
}

const serverSnapshot: StoreState = { profiles: [], currentId: null };

export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}

export function useCurrentProfile(): Profile | null {
  const s = useStore();
  return s.profiles.find((p) => p.id === s.currentId) ?? null;
}

export function nextAvatar(): string {
  const used = state.profiles.map((p) => p.avatar);
  return AVATARS.find((a) => !used.includes(a)) ?? AVATARS[0];
}

export function addProfile(name: string, avatar: string) {
  const profile: Profile = {
    id: crypto.randomUUID(),
    name: name.trim() || "Player",
    avatar,
    stars: 0,
    coins: 0,
    xp: 0,
    level: 1,
    completed: [],
    skills: {},
  };
  state = { profiles: [...state.profiles, profile], currentId: profile.id };
  persist();
}

export function selectProfile(id: string) {
  state = { ...state, currentId: id };
  persist();
}

export function clearCurrent() {
  state = { ...state, currentId: null };
  persist();
}

/** Award rewards after finishing a game and bump skill mastery. */
export function completeGame(gameId: string, skill: SkillId, scorePct: number) {
  const id = state.currentId;
  if (!id) return;
  state = {
    ...state,
    profiles: state.profiles.map((p) => {
      if (p.id !== id) return p;
      const prevSkill = p.skills[skill] ?? 0;
      const newSkill = Math.max(prevSkill, Math.round(scorePct));
      const xp = p.xp + 20;
      const level = Math.floor(xp / 100) + 1;
      return {
        ...p,
        stars: p.stars + 3,
        coins: p.coins + 5,
        xp,
        level,
        completed: p.completed.includes(gameId)
          ? p.completed
          : [...p.completed, gameId],
        skills: { ...p.skills, [skill]: newSkill },
      };
    }),
  };
  persist();
}

export function overallProgress(p: Profile): number {
  return Math.round((p.completed.length / ALL_GAMES.length) * 100);
}

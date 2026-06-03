// Static blueprint of worlds, levels and games.

export type SkillId =
  | "attention"
  | "matching"
  | "sorting"
  | "patterns"
  | "memory"
  | "sequencing"
  | "cause-effect"
  | "social"
  | "hygiene"
  | "eating"
  | "dressing";

export interface GameDef {
  id: string;
  title: string;
  emoji: string;
  skill: SkillId;
}

export interface WorldDef {
  id: string;
  title: string;
  emoji: string;
  color: string; // semantic token name fragment
  locked: boolean;
  games: GameDef[];
}

export const WORLDS: WorldDef[] = [
  {
    id: "foundation",
    title: "Foundation Skills",
    emoji: "🌟",
    color: "primary",
    locked: false,
    games: [
      { id: "tap-star", title: "Tap The Star", emoji: "⭐", skill: "attention" },
      { id: "match-colors", title: "Match Colors", emoji: "🔴", skill: "matching" },
      { id: "sorting", title: "Fruit Basket", emoji: "🍎", skill: "sorting" },
      { id: "patterns", title: "Continue Pattern", emoji: "🔵", skill: "patterns" },
      { id: "memory", title: "Flip Cards", emoji: "🃏", skill: "memory" },
    ],
  },
  {
    id: "cognitive",
    title: "Cognitive Skills",
    emoji: "🧠",
    color: "accent",
    locked: false,
    games: [
      { id: "sequencing", title: "Brush Teeth Order", emoji: "🪥", skill: "sequencing" },
      { id: "cause-effect", title: "Help The Plant", emoji: "🌱", skill: "cause-effect" },
    ],
  },
  {
    id: "social",
    title: "Social Skills",
    emoji: "💛",
    color: "warning",
    locked: false,
    games: [
      { id: "emotions", title: "Find The Feeling", emoji: "🙂", skill: "social" },
    ],
  },
  {
    id: "life",
    title: "Life Skills",
    emoji: "🏠",
    color: "success",
    locked: false,
    games: [
      { id: "handwashing", title: "Wash Hands", emoji: "🧼", skill: "hygiene" },
      { id: "dressing", title: "Dress For Weather", emoji: "👕", skill: "dressing" },
    ],
  },
];

export const ALL_GAMES: GameDef[] = WORLDS.flatMap((w) => w.games);

export function findGame(id: string) {
  return ALL_GAMES.find((g) => g.id === id);
}

export function findWorldOfGame(id: string) {
  return WORLDS.find((w) => w.games.some((g) => g.id === id));
}

export const SKILL_LABELS: Record<SkillId, string> = {
  attention: "Attention",
  matching: "Matching",
  sorting: "Sorting",
  patterns: "Patterns",
  memory: "Memory",
  sequencing: "Sequencing",
  "cause-effect": "Cause & Effect",
  social: "Social Skills",
  hygiene: "Hygiene",
  eating: "Eating",
  dressing: "Dressing",
};

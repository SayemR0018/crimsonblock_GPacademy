export type Reward = { code: string; percent: number };

export function rewardForScore(score: number): Reward {
  if (score >= 700) return { code: "OBSIDIAN30", percent: 30 };
  if (score >= 350) return { code: "BRICK20", percent: 20 };
  if (score >= 150) return { code: "CRIMSON10", percent: 10 };
  return { code: "CRIMSON5", percent: 5 };
}

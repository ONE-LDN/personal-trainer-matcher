export type MatchLeadInput = {
  goal: string;
  injuries?: string;
  gender?: string;
  pt_gender_pref?: string;
  freq?: string;
};

export type MatchPT = {
  id: number;
  name: string;
  role: string;
  specialisms: string[];
  populations: string[];
  bestFor: string;
  gender: "male" | "female";
  tier: string;
  capacity: number;
  rate: number;
  initials: string;
  active: boolean;
  score?: number;
};

export function matchPTs(a: MatchLeadInput, roster: MatchPT[]) {
  const gMap: Record<string, string[]> = {
    performance: ["sport_specific", "athletic_performance", "strength", "power", "speed", "conditioning", "hyrox", "running"],
    play: ["boxing", "martial_arts", "functional", "conditioning", "endurance", "running"],
    consistency: ["beginners", "functional", "conditioning", "strength", "fat_loss"],
    longevity: ["rehab", "injury", "injury_prevention", "health_mgmt", "longevity", "functional"],
    aesthetics: ["fat_loss", "recomposition", "hypertrophy", "strength", "nutrition"],
    mindset: ["boxing", "martial_arts", "functional", "conditioning", "strength"],
    other: ["beginners", "conditioning", "functional", "fat_loss"],
  };
  const ts = gMap[a.goal] || [];
  const hasInjury = !!(a.injuries && a.injuries.trim().length > 0 && a.injuries.toLowerCase() !== "none" && a.injuries.toLowerCase() !== "no" && a.injuries.toLowerCase() !== "n/a");
  const isWomens = a.gender === "female";
  const ptGenderPref = a.pt_gender_pref && a.pt_gender_pref !== "no_preference" ? a.pt_gender_pref : null;
  return roster
    .filter((p) => p.active && p.capacity > 0)
    .map((p) => {
      let s = 0;
      ts.forEach((x) => {
        if (p.specialisms.includes(x)) s += 3;
      });
      if (hasInjury && p.specialisms.includes("rehab")) s += 5;
      if (hasInjury && p.specialisms.includes("injury")) s += 3;
      if (hasInjury && p.specialisms.includes("injury_prevention")) s += 2;
      if (isWomens && p.populations.includes("womens_health")) s += 2;
      if (ptGenderPref && p.gender === ptGenderPref) s += 4;
      if (a.freq === "never" && p.populations.includes("beginners")) s += 2;
      if (a.freq === "5_6" && p.populations.includes("advanced")) s += 2;
      return { ...p, score: s };
    })
    .sort((a2, b2) => (b2.score ?? 0) - (a2.score ?? 0))
    .slice(0, 3);
}

// Lightweight fuzzy search helpers — diacritic folded, typo tolerant.
export function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export function tokenize(s: string): string[] {
  return normalize(s).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

// Damerau-Levenshtein (with transposition) — bounded for short tokens.
export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }
  return dp[m][n];
}

// Allowed typos scale with token length: 4-char → 1 typo, 8-char → 2, etc.
export function typoBudget(token: string): number {
  if (token.length <= 3) return 0;
  if (token.length <= 5) return 1;
  if (token.length <= 9) return 2;
  return 3;
}

export type Scored<T> = { item: T; score: number; matched: string[] };

export function fuzzyScore(hayTokens: string[], rawHay: string, queryTokens: string[]): { score: number; matched: string[] } {
  if (queryTokens.length === 0) return { score: 0, matched: [] };
  let score = 0;
  const matched: string[] = [];

  // Whole-query substring bonus
  const joined = queryTokens.join(" ");
  if (joined.length >= 3 && rawHay.includes(joined)) score += 40;

  for (const q of queryTokens) {
    // Exact substring match against the whole haystack
    if (rawHay.includes(q)) {
      score += q.length >= 3 ? 18 : 8;
      matched.push(q);
      continue;
    }
    // Prefix on any token
    const prefixHit = hayTokens.find((t) => t.startsWith(q));
    if (prefixHit) {
      score += 12;
      matched.push(prefixHit);
      continue;
    }
    // Fuzzy: best edit distance against any token within budget
    const budget = typoBudget(q);
    if (budget === 0) continue;
    let bestDist = Infinity;
    let bestTok = "";
    for (const t of hayTokens) {
      if (Math.abs(t.length - q.length) > budget) continue;
      const d = editDistance(q, t);
      if (d < bestDist) { bestDist = d; bestTok = t; }
      if (d === 0) break;
    }
    if (bestDist <= budget) {
      score += Math.max(2, 10 - bestDist * 3);
      matched.push(bestTok);
    }
  }

  return { score, matched };
}

// Suggest a single-token correction when no result was found — picks closest term.
export function didYouMean(queryTokens: string[], vocabulary: Set<string>): string | null {
  if (queryTokens.length === 0) return null;
  const longest = [...queryTokens].sort((a, b) => b.length - a.length)[0];
  if (longest.length < 3) return null;
  let best: string | null = null;
  let bestDist = Infinity;
  for (const term of vocabulary) {
    if (Math.abs(term.length - longest.length) > 3) continue;
    const d = editDistance(longest, term);
    if (d > 0 && d < bestDist) { bestDist = d; best = term; }
  }
  if (best && bestDist <= Math.max(1, Math.floor(longest.length / 3))) {
    // Reconstruct suggestion: replace longest token with best
    return queryTokens.map((t) => (t === longest ? best : t)).join(" ");
  }
  return null;
}

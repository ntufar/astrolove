// Turns raw synastry matches (from astro.js) into human-readable relationship
// interpretations, grouped into "human connection" and "love & family" categories.

const POINT_MEANING = {
  sun: "sense of identity and vitality",
  moon: "emotional nature and inner needs",
  mercury: "communication style and way of thinking",
  venus: "affection, values, and what feels lovable",
  mars: "desire, drive, and passion",
  jupiter: "optimism, growth, and shared beliefs",
  saturn: "sense of duty, commitment, and long-term stability",
  uranus: "need for independence and change",
  neptune: "romantic ideals, imagination, and empathy",
  pluto: "intensity, power, and transformation",
  ascendant: "first impressions and outward personality",
};

// Which relationship categories a point speaks to.
const POINT_CATEGORIES = {
  sun: ["connection"],
  moon: ["connection", "family"],
  mercury: ["connection"],
  venus: ["love"],
  mars: ["love"],
  jupiter: ["connection", "family"],
  saturn: ["family"],
  uranus: ["connection"],
  neptune: ["love"],
  pluto: ["love"],
  ascendant: ["connection"],
};

const ASPECT_TEXT = {
  conjunction: "are fused together, amplifying each other",
  sextile: "support each other with easy, low-pressure opportunity",
  trine: "flow together naturally and effortlessly",
  square: "create tension that pushes both people to grow",
  opposition: "pull in opposite directions, needing conscious balance",
};

// How much weight each point carries when scoring compatibility — personal
// planets and the ascendant matter more to day-to-day chemistry than the
// slow-moving outer planets.
const POINT_WEIGHT = {
  sun: 1.5,
  moon: 1.5,
  venus: 1.4,
  mars: 1.3,
  ascendant: 1.2,
  mercury: 1.0,
  jupiter: 0.9,
  saturn: 0.9,
  uranus: 0.6,
  neptune: 0.6,
  pluto: 0.6,
};

// Base points per aspect type before weighting/exactness are applied.
const ASPECT_SCORE = {
  conjunction: 8,
  trine: 8,
  sextile: 5,
  square: -5,
  opposition: -6,
};

const COMPATIBILITY_LABELS = [
  { min: 80, label: "Exceptional match" },
  { min: 65, label: "Strong compatibility" },
  { min: 50, label: "Balanced, promising connection" },
  { min: 35, label: "Real chemistry, needs conscious work" },
  { min: 0, label: "Significant differences to navigate" },
];

/** Returns { percentage, label } — a 0-100 compatibility score with a short verdict. */
export function computeCompatibilityScore(aspectMatches, signMatches) {
  // Weighted average (not sum) so the score reflects aspect *quality*, not
  // volume — wide orbs mean most chart pairs share dozens of minor aspects,
  // and summing them would push almost everyone to the same ceiling.
  let weightedSum = 0;
  let weightTotal = 0;

  for (const match of aspectMatches) {
    const weightA = POINT_WEIGHT[match.a.key] ?? 0.8;
    const weightB = POINT_WEIGHT[match.b.key] ?? 0.8;
    const pairWeight = (weightA + weightB) / 2;
    const base = ASPECT_SCORE[match.aspect] ?? 0;
    const exactnessFactor = 1 - match.exactness * 0.7; // tighter orb = fuller weight
    weightedSum += base * pairWeight * exactnessFactor;
    weightTotal += pairWeight;
  }

  const averageQuality = weightTotal > 0 ? weightedSum / weightTotal : 0;
  const signBonus = Math.min(signMatches.length, 8) * 0.6;

  const percentage = Math.round(clamp(50 + averageQuality * 11 + signBonus, 5, 98));
  const label = COMPATIBILITY_LABELS.find((l) => percentage >= l.min).label;

  return { percentage, label };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function generateInterpretations(aspectMatches, signMatches) {
  const categorized = { connection: [], love: [], family: [] };

  for (const match of aspectMatches) {
    const categories = new Set([
      ...(POINT_CATEGORIES[match.a.key] || []),
      ...(POINT_CATEGORIES[match.b.key] || []),
    ]);
    const sentence = buildSentence(match);
    for (const category of categories) {
      categorized[category].push({ ...match, sentence });
    }
  }

  for (const category of Object.keys(categorized)) {
    categorized[category].sort((m1, m2) => m1.exactness - m2.exactness);
  }

  const harmoniousCount = aspectMatches.filter((m) => m.tone === "harmonious").length;
  const challengingCount = aspectMatches.filter((m) => m.tone === "challenging").length;

  return {
    connection: categorized.connection.slice(0, 6),
    love: categorized.love.slice(0, 6),
    family: categorized.family.slice(0, 6),
    summary: buildSummary(harmoniousCount, challengingCount, signMatches.length),
    compatibility: computeCompatibilityScore(aspectMatches, signMatches),
  };
}

function buildSentence(match) {
  const { a, b, aspect, tone } = match;
  const meaningA = POINT_MEANING[a.key] || a.label;
  const meaningB = POINT_MEANING[b.key] || b.label;
  const verb = ASPECT_TEXT[aspect] || "interact";
  const toneNote = tone === "harmonious"
    ? "This is an easy strength in the relationship."
    : "This takes effort and communication to work well.";

  return `${a.label} (${meaningA}) and ${b.label} (${meaningB}) ${verb} through a ${aspect}. ${toneNote}`;
}

function buildSummary(harmoniousCount, challengingCount, sameSignCount) {
  const total = harmoniousCount + challengingCount;
  if (total === 0 && sameSignCount === 0) {
    return "No close astrological connections were found within standard orbs — this chart pair is more independent than intertwined, for better or worse.";
  }

  const parts = [];
  if (harmoniousCount > 0) {
    parts.push(`${harmoniousCount} easy, flowing connection${harmoniousCount === 1 ? "" : "s"}`);
  }
  if (challengingCount > 0) {
    parts.push(`${challengingCount} friction point${challengingCount === 1 ? "" : "s"} that need conscious effort`);
  }
  if (sameSignCount > 0) {
    parts.push(`${sameSignCount} shared sign match${sameSignCount === 1 ? "" : "es"}`);
  }

  return `Overall this pairing shows ${parts.join(" and ")}.`;
}

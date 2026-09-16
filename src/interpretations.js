// Turns raw synastry matches (from astro.js) into human-readable relationship
// interpretations, grouped into "human connection" and "love & family" categories.
import { pointLabel, aspectName } from "./i18n.js";

const POINT_MEANING = {
  el: {
    sun: "αίσθηση ταυτότητας και ζωτικότητα",
    moon: "συναισθηματική φύση και εσωτερικές ανάγκες",
    mercury: "τρόπος επικοινωνίας και σκέψης",
    venus: "στοργή, αξίες, και το τι νιώθεται αξιαγάπητο",
    mars: "επιθυμία, ορμή, και πάθος",
    jupiter: "αισιοδοξία, ανάπτυξη, και κοινές πεποιθήσεις",
    saturn: "αίσθηση καθήκοντος, δέσμευση, και μακροπρόθεσμη σταθερότητα",
    uranus: "ανάγκη για ανεξαρτησία και αλλαγή",
    neptune: "ρομαντικά ιδανικά, φαντασία, και ενσυναίσθηση",
    pluto: "ένταση, δύναμη, και μεταμόρφωση",
    ascendant: "πρώτες εντυπώσεις και εξωτερική προσωπικότητα",
  },
  en: {
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
  },
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
  el: {
    conjunction: "συγχωνεύονται, ενισχύοντας ο ένας τον άλλον",
    sextile: "υποστηρίζουν ο ένας τον άλλον με εύκολη, χαμηλής πίεσης ευκαιρία",
    trine: "ρέουν μεταξύ τους φυσικά και δίχως προσπάθεια",
    square: "δημιουργούν ένταση που ωθεί και τους δύο να εξελιχθούν",
    opposition: "τραβούν προς αντίθετες κατευθύνσεις, χρειάζονται συνειδητή ισορροπία",
  },
  en: {
    conjunction: "are fused together, amplifying each other",
    sextile: "support each other with easy, low-pressure opportunity",
    trine: "flow together naturally and effortlessly",
    square: "create tension that pushes both people to grow",
    opposition: "pull in opposite directions, needing conscious balance",
  },
};

const TONE_NOTE = {
  el: {
    harmonious: "Αυτό είναι μια εύκολη δύναμη στη σχέση.",
    challenging: "Αυτό απαιτεί προσπάθεια και επικοινωνία για να λειτουργήσει καλά.",
  },
  en: {
    harmonious: "This is an easy strength in the relationship.",
    challenging: "This takes effort and communication to work well.",
  },
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

const COMPATIBILITY_LABELS = {
  el: [
    { min: 80, label: "Εξαιρετικό ταίριασμα" },
    { min: 65, label: "Ισχυρή συμβατότητα" },
    { min: 50, label: "Ισορροπημένη, ελπιδοφόρα σύνδεση" },
    { min: 35, label: "Πραγματική χημεία, χρειάζεται συνειδητή προσπάθεια" },
    { min: 0, label: "Σημαντικές διαφορές προς διαχείριση" },
  ],
  en: [
    { min: 80, label: "Exceptional match" },
    { min: 65, label: "Strong compatibility" },
    { min: 50, label: "Balanced, promising connection" },
    { min: 35, label: "Real chemistry, needs conscious work" },
    { min: 0, label: "Significant differences to navigate" },
  ],
};

/** Returns { percentage, label } — a 0-100 compatibility score with a short verdict. */
export function computeCompatibilityScore(aspectMatches, signMatches, lang) {
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
  const label = COMPATIBILITY_LABELS[lang].find((l) => percentage >= l.min).label;

  return { percentage, label };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function generateInterpretations(aspectMatches, signMatches, lang) {
  const categorized = { connection: [], love: [], family: [] };

  for (const match of aspectMatches) {
    const categories = new Set([
      ...(POINT_CATEGORIES[match.a.key] || []),
      ...(POINT_CATEGORIES[match.b.key] || []),
    ]);
    const sentence = buildSentence(match, lang);
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
    summary: buildSummary(harmoniousCount, challengingCount, signMatches.length, lang),
    compatibility: computeCompatibilityScore(aspectMatches, signMatches, lang),
  };
}

function buildSentence(match, lang) {
  const { a, b, aspect, tone } = match;
  const meaningA = POINT_MEANING[lang][a.key] || pointLabel(lang, a.key);
  const meaningB = POINT_MEANING[lang][b.key] || pointLabel(lang, b.key);
  const verb = ASPECT_TEXT[lang][aspect] || ASPECT_TEXT[lang].conjunction;
  const toneNote = TONE_NOTE[lang][tone];
  const nameA = pointLabel(lang, a.key);
  const nameB = pointLabel(lang, b.key);

  if (lang === "el") {
    return `${nameA} (${meaningA}) και ${nameB} (${meaningB}) ${verb} μέσω όψης ${aspectName(lang, aspect)}. ${toneNote}`;
  }
  return `${nameA} (${meaningA}) and ${nameB} (${meaningB}) ${verb} through a ${aspect}. ${toneNote}`;
}

function buildSummary(harmoniousCount, challengingCount, sameSignCount, lang) {
  const total = harmoniousCount + challengingCount;
  if (total === 0 && sameSignCount === 0) {
    return lang === "el"
      ? "Δεν βρέθηκαν στενές αστρολογικές συνδέσεις εντός των συνηθισμένων ορίων — αυτό το ζευγάρι χαρτών είναι περισσότερο ανεξάρτητο παρά συνυφασμένο, είτε καλό είτε κακό."
      : "No close astrological connections were found within standard orbs — this chart pair is more independent than intertwined, for better or worse.";
  }

  const parts = [];
  if (harmoniousCount > 0) {
    parts.push(
      lang === "el"
        ? harmoniousCount === 1
          ? `${harmoniousCount} εύκολη, ρέουσα σύνδεση`
          : `${harmoniousCount} εύκολες, ρέουσες συνδέσεις`
        : `${harmoniousCount} easy, flowing connection${harmoniousCount === 1 ? "" : "s"}`,
    );
  }
  if (challengingCount > 0) {
    parts.push(
      lang === "el"
        ? challengingCount === 1
          ? `${challengingCount} σημείο τριβής που χρειάζεται συνειδητή προσπάθεια`
          : `${challengingCount} σημεία τριβής που χρειάζονται συνειδητή προσπάθεια`
        : `${challengingCount} friction point${challengingCount === 1 ? "" : "s"} that need conscious effort`,
    );
  }
  if (sameSignCount > 0) {
    parts.push(
      lang === "el"
        ? sameSignCount === 1
          ? `${sameSignCount} κοινό ζώδιο`
          : `${sameSignCount} κοινά ζώδια`
        : `${sameSignCount} shared sign match${sameSignCount === 1 ? "" : "es"}`,
    );
  }

  return lang === "el"
    ? `Συνολικά, αυτό το ζευγάρι παρουσιάζει ${parts.join(" και ")}.`
    : `Overall this pairing shows ${parts.join(" and ")}.`;
}

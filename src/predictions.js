// Turns raw transit-to-natal matches (from transits.js) into human-readable
// day/week forecast text — the prediction counterpart of interpretations.js,
// which does the same job for synastry matches.

const TRANSIT_THEME = {
  sun: "vitality, visibility, and sense of purpose",
  moon: "mood, instincts, and emotional needs",
  mercury: "communication, thinking, and daily decisions",
  venus: "love, charm, and what feels good",
  mars: "energy, drive, and assertiveness",
  jupiter: "growth, luck, and opportunity",
  saturn: "responsibility, limits, and discipline",
  uranus: "sudden change, surprise, and independence",
  neptune: "intuition, imagination, and blurred boundaries",
  pluto: "intensity, power, and transformation",
};

const ASPECT_VERB = {
  conjunction: "lines up with",
  sextile: "gently supports",
  square: "creates friction with",
  trine: "flows easily with",
  opposition: "pulls against",
};

const TONE_NOTE = {
  harmonious: "a favorable, low-effort window",
  challenging: "a moment that calls for patience and self-awareness",
};

const WEEKDAY_FORMAT = { weekday: "long" };

function buildSentence(match) {
  const { a, b, aspect, tone } = match;
  const theme = TRANSIT_THEME[a.key] || "an important theme";
  const verb = ASPECT_VERB[aspect] || "interacts with";
  return `Transiting ${a.glyph} ${a.label} ${verb} your natal ${b.glyph} ${b.label} (${aspect}) — ${theme} is highlighted, ${TONE_NOTE[tone]}.`;
}

function toneCounts(matches) {
  const harmonious = matches.filter((m) => m.tone === "harmonious").length;
  return { harmonious, challenging: matches.length - harmonious };
}

/** Reading for right now: { summary, items: [{ tone, sentence }] }. */
export function generateDayPrediction(dayMatches) {
  const top = dayMatches.slice(0, 4);

  if (top.length === 0) {
    return {
      summary:
        "A quiet day astrologically — no major transits are exact right now, so today favors steady routine over big moves.",
      items: [],
    };
  }

  const { harmonious, challenging } = toneCounts(top);
  return {
    summary: buildDaySummary(harmonious, challenging),
    items: top.map((match) => ({ tone: match.tone, sentence: buildSentence(match) })),
  };
}

function buildDaySummary(harmoniousCount, challengingCount) {
  if (harmoniousCount > 0 && challengingCount === 0) {
    return "Today leans easy and supportive — a good day to move forward on what matters to you.";
  }
  if (challengingCount > 0 && harmoniousCount === 0) {
    return "Today brings some friction — go gently and avoid forcing outcomes.";
  }
  return "Today is a mix of ease and friction — good things are available if you navigate the rough patches with care.";
}

/** Reading for the coming week: { summary, items: [{ tone, sentence }] }. */
export function generateWeekPrediction(weekMatches) {
  const top = weekMatches.slice(0, 5);

  if (top.length === 0) {
    return {
      summary:
        "A relatively quiet week — no major transits stand out, so this is a good stretch for maintenance rather than big change.",
      items: [],
    };
  }

  const { harmonious, challenging } = toneCounts(top);
  return {
    summary: buildWeekSummary(harmonious, challenging),
    items: top.map((match) => ({
      tone: match.tone,
      sentence: `${buildSentence(match)} Peaks around ${match.date.toLocaleDateString(undefined, WEEKDAY_FORMAT)}.`,
    })),
  };
}

function buildWeekSummary(harmoniousCount, challengingCount) {
  if (harmoniousCount > 0 && challengingCount === 0) {
    return "This week trends favorable — several supportive transits make it a good stretch for progress.";
  }
  if (challengingCount > 0 && harmoniousCount === 0) {
    return "This week carries real friction — expect a few tests of patience and plan around them.";
  }
  return "This week mixes opportunity with a few challenges — pace yourself and lean on the easier days.";
}

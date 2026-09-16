// Turns raw transit-to-natal matches (from transits.js) into human-readable
// day/week forecast text — the prediction counterpart of interpretations.js,
// which does the same job for synastry matches.
import { pointLabel, aspectName, localeTag } from "./i18n.js";

const TRANSIT_THEME = {
  el: {
    sun: "ζωτικότητα, προβολή και αίσθηση σκοπού",
    moon: "διάθεση, ένστικτα και συναισθηματικές ανάγκες",
    mercury: "επικοινωνία, σκέψη και καθημερινές αποφάσεις",
    venus: "αγάπη, γοητεία και ό,τι νιώθεται ευχάριστο",
    mars: "ενέργεια, ορμή και αποφασιστικότητα",
    jupiter: "ανάπτυξη, τύχη και ευκαιρίες",
    saturn: "ευθύνη, όρια και πειθαρχία",
    uranus: "ξαφνική αλλαγή, έκπληξη και ανεξαρτησία",
    neptune: "διαίσθηση, φαντασία και θολά όρια",
    pluto: "ένταση, δύναμη και μεταμόρφωση",
  },
  en: {
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
  },
};

const ASPECT_VERB = {
  el: {
    conjunction: "ευθυγραμμίζεται με",
    sextile: "στηρίζει απαλά",
    square: "δημιουργεί τριβή με",
    trine: "ρέει εύκολα με",
    opposition: "τραβάει προς την αντίθετη κατεύθυνση από",
  },
  en: {
    conjunction: "lines up with",
    sextile: "gently supports",
    square: "creates friction with",
    trine: "flows easily with",
    opposition: "pulls against",
  },
};

const TONE_NOTE = {
  el: {
    harmonious: "ένα ευνοϊκό παράθυρο, χωρίς ιδιαίτερη προσπάθεια",
    challenging: "μια στιγμή που απαιτεί υπομονή και αυτογνωσία",
  },
  en: {
    harmonious: "a favorable, low-effort window",
    challenging: "a moment that calls for patience and self-awareness",
  },
};

function buildSentence(match, lang) {
  const { a, b, aspect, tone } = match;
  const theme = TRANSIT_THEME[lang][a.key] || (lang === "el" ? "ένα σημαντικό θέμα" : "an important theme");
  const verb = ASPECT_VERB[lang][aspect] || ASPECT_VERB[lang].conjunction;
  const toneNote = TONE_NOTE[lang][tone];
  const nameA = pointLabel(lang, a.key);
  const nameB = pointLabel(lang, b.key);

  if (lang === "el") {
    return `Ο διερχόμενος ${a.glyph} ${nameA} ${verb} τον γεννητικό σας ${b.glyph} ${nameB} (${aspectName(lang, aspect)}) — αναδεικνύεται ${theme}, ${toneNote}.`;
  }
  return `Transiting ${a.glyph} ${nameA} ${verb} your natal ${b.glyph} ${nameB} (${aspect}) — ${theme} is highlighted, ${toneNote}.`;
}

function toneCounts(matches) {
  const harmonious = matches.filter((m) => m.tone === "harmonious").length;
  return { harmonious, challenging: matches.length - harmonious };
}

/** Reading for right now: { summary, items: [{ tone, sentence }] }. */
export function generateDayPrediction(dayMatches, lang) {
  const top = dayMatches.slice(0, 4);

  if (top.length === 0) {
    return {
      summary:
        lang === "el"
          ? "Μια ήσυχη μέρα αστρολογικά — δεν υπάρχουν σημαντικές διελεύσεις αυτή τη στιγμή, οπότε σήμερα ευνοείται η σταθερή ρουτίνα παρά οι μεγάλες κινήσεις."
          : "A quiet day astrologically — no major transits are exact right now, so today favors steady routine over big moves.",
      items: [],
    };
  }

  const { harmonious, challenging } = toneCounts(top);
  return {
    summary: buildDaySummary(harmonious, challenging, lang),
    items: top.map((match) => ({ tone: match.tone, sentence: buildSentence(match, lang) })),
  };
}

function buildDaySummary(harmoniousCount, challengingCount, lang) {
  if (harmoniousCount > 0 && challengingCount === 0) {
    return lang === "el"
      ? "Σήμερα η μέρα είναι ήπια και υποστηρικτική — καλή στιγμή να προχωρήσετε σε αυτά που σας ενδιαφέρουν."
      : "Today leans easy and supportive — a good day to move forward on what matters to you.";
  }
  if (challengingCount > 0 && harmoniousCount === 0) {
    return lang === "el"
      ? "Σήμερα υπάρχει κάποια τριβή — προχωρήστε με ηρεμία και αποφύγετε να πιέζετε τα πράγματα."
      : "Today brings some friction — go gently and avoid forcing outcomes.";
  }
  return lang === "el"
    ? "Σήμερα συνδυάζονται ευκολία και τριβή — υπάρχουν καλά πράγματα αν διαχειριστείτε προσεκτικά τις δυσκολίες."
    : "Today is a mix of ease and friction — good things are available if you navigate the rough patches with care.";
}

/** Reading for the coming week: { summary, items: [{ tone, sentence }] }. */
export function generateWeekPrediction(weekMatches, lang) {
  const top = weekMatches.slice(0, 5);

  if (top.length === 0) {
    return {
      summary:
        lang === "el"
          ? "Μια σχετικά ήσυχη εβδομάδα — δεν ξεχωρίζουν σημαντικές διελεύσεις, οπότε είναι καλή περίοδος για συντήρηση παρά για μεγάλες αλλαγές."
          : "A relatively quiet week — no major transits stand out, so this is a good stretch for maintenance rather than big change.",
      items: [],
    };
  }

  const { harmonious, challenging } = toneCounts(top);
  const peaksLabel = lang === "el" ? "Κορυφώνεται γύρω στις" : "Peaks around";
  return {
    summary: buildWeekSummary(harmonious, challenging, lang),
    items: top.map((match) => ({
      tone: match.tone,
      sentence: `${buildSentence(match, lang)} ${peaksLabel} ${match.date.toLocaleDateString(localeTag(lang), { weekday: "long" })}.`,
    })),
  };
}

function buildWeekSummary(harmoniousCount, challengingCount, lang) {
  if (harmoniousCount > 0 && challengingCount === 0) {
    return lang === "el"
      ? "Αυτή η εβδομάδα είναι ευνοϊκή — αρκετές υποστηρικτικές διελεύσεις τη κάνουν καλή περίοδο για πρόοδο."
      : "This week trends favorable — several supportive transits make it a good stretch for progress.";
  }
  if (challengingCount > 0 && harmoniousCount === 0) {
    return lang === "el"
      ? "Αυτή η εβδομάδα φέρνει πραγματική τριβή — περιμένετε κάποιες δοκιμασίες υπομονής και οργανωθείτε ανάλογα."
      : "This week carries real friction — expect a few tests of patience and plan around them.";
  }
  return lang === "el"
    ? "Αυτή η εβδομάδα συνδυάζει ευκαιρίες με κάποιες προκλήσεις — μην βιάζεστε και στηριχθείτε στις πιο εύκολες μέρες."
    : "This week mixes opportunity with a few challenges — pace yourself and lean on the easier days.";
}

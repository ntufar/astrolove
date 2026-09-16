// Central translation catalog and language state. Every other module that
// needs to display text takes a `lang` argument ("el" | "en") rather than
// hardcoding English — this file is the single source of truth for strings.

export const SUPPORTED_LANGS = ["el", "en"];
export const DEFAULT_LANG = "el";

const LANG_STORAGE_KEY = "astrolove:lang";

export function getLang() {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (SUPPORTED_LANGS.includes(stored)) return stored;
  } catch {
    // Storage unavailable — fall through to the default.
  }
  return DEFAULT_LANG;
}

export function setLang(lang) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Storage unavailable — language choice just won't persist across visits.
  }
}

export const UI = {
  el: {
    tagline: "Συγκρίνετε δύο αστρολογικούς χάρτες γέννησης και δείτε πού συνδέονται.",
    womanTitle: "Γυναίκα",
    manTitle: "Άνδρας",
    nameLabel: "Όνομα (προαιρετικό)",
    womanNamePlaceholder: "Το όνομά της",
    manNamePlaceholder: "Το όνομά του",
    dateLabel: "Ημερομηνία γέννησης (ΗΗ/ΜΜ/ΕΕΕΕ)",
    timeLabel: "Ώρα γέννησης (24ωρη, ΩΩ:ΛΛ)",
    cityLabel: "Πόλη γέννησης",
    cityPlaceholderOption: "Επιλέξτε πόλη…",
    submitButton: "Υπολογισμός χαρτών & συνδέσεων",
    coordHint:
      "Ο τόπος γέννησης περιορίζεται προς το παρόν σε ελληνικές πόλεις. Όλοι οι αστρολογικοί υπολογισμοί γίνονται τοπικά στον browser σας — τα δεδομένα γέννησης δεν εγκαταλείπουν ποτέ τη συσκευή σας.",
    womanChartHeadingDefault: "Χάρτης Γυναίκας",
    manChartHeadingDefault: "Χάρτης Άνδρα",
    womanChartHeadingNamed: (name) => `Χάρτης — ${name}`,
    manChartHeadingNamed: (name) => `Χάρτης — ${name}`,
    connectionsHeading: "Συνδέσεις",
    noConnections: "Δεν βρέθηκαν στενές αστρολογικές συνδέσεις εντός των συνηθισμένων ορίων (orbs).",
    sameSignLabel: "ίδιο ζώδιο",
    readingHeading: "Ανάγνωση Συμβατότητας",
    humanConnectionHeading: "Ανθρώπινη Σύνδεση",
    loveRelationshipHeading: "Έρωτας & Σχέση",
    familyLongTermHeading: "Οικογένεια & Μακροπρόθεσμη Ζωή",
    emptyConnectionMsg:
      "Δεν υπάρχουν ξεχωριστές όψεις ανθρώπινης σύνδεσης — η επικοινωνία εδώ θα χτιστεί συνειδητά και όχι αυθόρμητα.",
    emptyLoveMsg:
      "Δεν υπάρχουν ξεχωριστές ρομαντικές όψεις — η έλξη ίσως χρειαστεί ενεργή καλλιέργεια αντί για άμεση σπίθα.",
    emptyFamilyMsg:
      "Δεν υπάρχουν ξεχωριστές όψεις οικογένειας/σταθερότητας — η μακροπρόθεσμη δέσμευση θα χρειαστεί συνειδητή προσπάθεια.",
    predictionsHeading: "Προσωπικές Προβλέψεις",
    womanForecastDefault: "Πρόβλεψη Γυναίκας",
    manForecastDefault: "Πρόβλεψη Άνδρα",
    womanForecastNamed: (name) => `Πρόβλεψη — ${name}`,
    manForecastNamed: (name) => `Πρόβλεψη — ${name}`,
    todayLabel: "Σήμερα",
    thisWeekLabel: "Αυτή την Εβδομάδα",
    validationAlert:
      "Συμπληρώστε πλήρη ημερομηνία (ΗΗ/ΜΜ/ΕΕΕΕ), ώρα (ΩΩ:ΛΛ) και πόλη γέννησης και για τα δύο άτομα.",
    themeToggleAria: "Εναλλαγή φωτεινού/σκοτεινού θέματος",
    langToggleAria: "Αλλαγή γλώσσας",
    retro: "Α",
  },
  en: {
    tagline: "Compare two birth charts and see where they connect.",
    womanTitle: "Woman",
    manTitle: "Man",
    nameLabel: "Name (optional)",
    womanNamePlaceholder: "Her name",
    manNamePlaceholder: "His name",
    dateLabel: "Date of birth (DD/MM/YYYY)",
    timeLabel: "Time of birth (24h, HH:MM)",
    cityLabel: "City of birth",
    cityPlaceholderOption: "Choose a city…",
    submitButton: "Calculate charts & connections",
    coordHint:
      "Birthplace is limited to Greek cities for now. This app performs all astrology math locally in your browser, so no birth data ever leaves your device.",
    womanChartHeadingDefault: "Woman's Chart",
    manChartHeadingDefault: "Man's Chart",
    womanChartHeadingNamed: (name) => `${name}'s Chart`,
    manChartHeadingNamed: (name) => `${name}'s Chart`,
    connectionsHeading: "Connections",
    noConnections: "No close astrological connections found within standard orbs.",
    sameSignLabel: "same sign",
    readingHeading: "Compatibility Reading",
    humanConnectionHeading: "Human Connection",
    loveRelationshipHeading: "Love & Relationship",
    familyLongTermHeading: "Family & Long-Term Life",
    emptyConnectionMsg:
      "No standout human-connection aspects — rapport here will be built deliberately rather than felt automatically.",
    emptyLoveMsg:
      "No standout romantic aspects — attraction may need active cultivation rather than instant spark.",
    emptyFamilyMsg:
      "No standout family/stability aspects — long-term commitment will take conscious work to build.",
    predictionsHeading: "Personal Predictions",
    womanForecastDefault: "Woman's Forecast",
    manForecastDefault: "Man's Forecast",
    womanForecastNamed: (name) => `${name}'s Forecast`,
    manForecastNamed: (name) => `${name}'s Forecast`,
    todayLabel: "Today",
    thisWeekLabel: "This Week",
    validationAlert: "Please fill in a complete date (DD/MM/YYYY), time (HH:MM), and city of birth for both people.",
    themeToggleAria: "Toggle light/dark theme",
    langToggleAria: "Switch language",
    retro: "R",
  },
};

export const SIGN_NAMES = {
  el: {
    aries: "Κριός",
    taurus: "Ταύρος",
    gemini: "Δίδυμοι",
    cancer: "Καρκίνος",
    leo: "Λέων",
    virgo: "Παρθένος",
    libra: "Ζυγός",
    scorpio: "Σκορπιός",
    sagittarius: "Τοξότης",
    capricorn: "Αιγόκερως",
    aquarius: "Υδροχόος",
    pisces: "Ιχθύες",
  },
  en: {
    aries: "Aries",
    taurus: "Taurus",
    gemini: "Gemini",
    cancer: "Cancer",
    leo: "Leo",
    virgo: "Virgo",
    libra: "Libra",
    scorpio: "Scorpio",
    sagittarius: "Sagittarius",
    capricorn: "Capricorn",
    aquarius: "Aquarius",
    pisces: "Pisces",
  },
};

export const POINT_LABELS = {
  el: {
    sun: "Ήλιος",
    moon: "Σελήνη",
    mercury: "Ερμής",
    venus: "Αφροδίτη",
    mars: "Άρης",
    jupiter: "Δίας",
    saturn: "Κρόνος",
    uranus: "Ουρανός",
    neptune: "Ποσειδώνας",
    pluto: "Πλούτωνας",
    ascendant: "Ωροσκόπος",
  },
  en: {
    sun: "Sun",
    moon: "Moon",
    mercury: "Mercury",
    venus: "Venus",
    mars: "Mars",
    jupiter: "Jupiter",
    saturn: "Saturn",
    uranus: "Uranus",
    neptune: "Neptune",
    pluto: "Pluto",
    ascendant: "Ascendant",
  },
};

export const ASPECT_NAMES = {
  el: {
    conjunction: "Σύνοδος",
    sextile: "Εξάγωνο",
    square: "Τετράγωνο",
    trine: "Τρίγωνο",
    opposition: "Αντίθεση",
  },
  en: {
    conjunction: "Conjunction",
    sextile: "Sextile",
    square: "Square",
    trine: "Trine",
    opposition: "Opposition",
  },
};

export function ui(lang, key) {
  return (UI[lang] ?? UI[DEFAULT_LANG])[key];
}

export function signName(lang, key) {
  return (SIGN_NAMES[lang] ?? SIGN_NAMES[DEFAULT_LANG])[key] ?? key;
}

export function pointLabel(lang, key) {
  return (POINT_LABELS[lang] ?? POINT_LABELS[DEFAULT_LANG])[key] ?? key;
}

export function aspectName(lang, key) {
  return (ASPECT_NAMES[lang] ?? ASPECT_NAMES[DEFAULT_LANG])[key] ?? key;
}

const LOCALE_TAG = { el: "el-GR", en: "en-US" };

export function localeTag(lang) {
  return LOCALE_TAG[lang] ?? LOCALE_TAG[DEFAULT_LANG];
}

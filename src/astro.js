import { Origin, Horoscope } from "circular-natal-horoscope-js";

// Order in which we display planets/points on each chart.
export const CHART_POINTS = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
];

const SIGN_GLYPHS = {
  aries: "♈",
  taurus: "♉",
  gemini: "♊",
  cancer: "♋",
  leo: "♌",
  virgo: "♍",
  libra: "♎",
  scorpio: "♏",
  sagittarius: "♐",
  capricorn: "♑",
  aquarius: "♒",
  pisces: "♓",
};

const POINT_GLYPHS = {
  sun: "☉",
  moon: "☽",
  mercury: "☿",
  venus: "♀",
  mars: "♂",
  jupiter: "♃",
  saturn: "♄",
  uranus: "♅",
  neptune: "♆",
  pluto: "♇",
  ascendant: "ASC",
};

// Major aspects used for both natal display and cross-chart synastry.
// Angle = ideal separation in degrees, orb = allowed deviation.
const ASPECT_DEFINITIONS = [
  { key: "conjunction", angle: 0, orb: 8, tone: "harmonious" },
  { key: "sextile", angle: 60, orb: 6, tone: "harmonious" },
  { key: "square", angle: 90, orb: 7, tone: "challenging" },
  { key: "trine", angle: 120, orb: 8, tone: "harmonious" },
  { key: "opposition", angle: 180, orb: 8, tone: "challenging" },
];

/**
 * Builds a natal chart (Origin + Horoscope) from a birth date/time and
 * geographic coordinates. Timezone/DST are derived automatically by the
 * library from latitude/longitude.
 */
export function buildChart({ year, month, date, hour, minute, latitude, longitude }) {
  const origin = new Origin({
    year,
    month: month - 1, // library expects 0-indexed months
    date,
    hour,
    minute,
    latitude,
    longitude,
  });

  const horoscope = new Horoscope({
    origin,
    houseSystem: "placidus",
    zodiac: "tropical",
    aspectPoints: ["bodies", "angles"],
    aspectWithPoints: ["bodies", "angles"],
    aspectTypes: ["major"],
    language: "en",
  });

  return horoscope;
}

/** Flattens the points we care about into {key, label, sign, degree, retrograde} */
export function extractPoints(horoscope) {
  const points = CHART_POINTS.map((key) => {
    const body = horoscope.CelestialBodies[key];
    return pointFromBody(key, body);
  });

  const ascendant = horoscope.Ascendant;
  points.push({
    key: "ascendant",
    label: "Ascendant",
    glyph: POINT_GLYPHS.ascendant,
    sign: ascendant.Sign.key,
    signGlyph: SIGN_GLYPHS[ascendant.Sign.key] ?? "",
    degree: ascendant.ChartPosition.Ecliptic.ArcDegreesFormatted30,
    absoluteDegree: ascendant.ChartPosition.Ecliptic.DecimalDegrees,
    retrograde: false,
  });

  return points;
}

function pointFromBody(key, body) {
  return {
    key,
    label: capitalize(key),
    glyph: POINT_GLYPHS[key] ?? "",
    sign: body.Sign.key,
    signGlyph: SIGN_GLYPHS[body.Sign.key] ?? "",
    degree: body.ChartPosition.Ecliptic.ArcDegreesFormatted30,
    absoluteDegree: body.ChartPosition.Ecliptic.DecimalDegrees,
    retrograde: Boolean(body.isRetrograde),
  };
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Computes synastry: the cross-chart aspects between every point of chart A
 * and every point of chart B, keeping only matches within orb.
 */
export function computeSynastry(pointsA, pointsB) {
  const matches = [];

  for (const a of pointsA) {
    for (const b of pointsB) {
      const separation = angularSeparation(a.absoluteDegree, b.absoluteDegree);
      const aspect = closestAspect(separation);
      if (aspect) {
        matches.push({
          a,
          b,
          aspect: aspect.key,
          tone: aspect.tone,
          exactness: aspect.exactness, // 0 = exact, 1 = at edge of orb
          separation,
        });
      }
    }
  }

  // Strongest (most exact) matches first.
  matches.sort((m1, m2) => m1.exactness - m2.exactness);
  return matches;
}

function angularSeparation(deg1, deg2) {
  const diff = Math.abs(deg1 - deg2) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function closestAspect(separation) {
  for (const def of ASPECT_DEFINITIONS) {
    const delta = Math.abs(separation - def.angle);
    if (delta <= def.orb) {
      return { ...def, exactness: delta / def.orb };
    }
  }
  return null;
}

export function sameSignMatches(pointsA, pointsB) {
  const matches = [];
  for (const a of pointsA) {
    for (const b of pointsB) {
      if (a.sign === b.sign) {
        matches.push({ a, b });
      }
    }
  }
  return matches;
}

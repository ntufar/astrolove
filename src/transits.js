// Transit math: where the planets are *right now* (or across the coming
// week) compared against a natal chart's points. Built on top of astro.js's
// buildChart/extractPoints/computeSynastry — computeSynastry is generic
// cross-chart aspect matching, so it works just as well for transit-vs-natal
// as it does for synastry between two natal charts.
import { buildChart, extractPoints, computeSynastry } from "./astro.js";

function transitPointsForDate(date, location) {
  const chart = buildChart({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    latitude: location.latitude,
    longitude: location.longitude,
  });
  // The transiting ascendant is a houses artifact of the sampling time, not
  // a meaningful "transit" in its own right — only the planets matter here.
  return extractPoints(chart).filter((point) => point.key !== "ascendant");
}

/** Aspects formed right now between transiting planets and a natal chart. */
export function computeDayTransits(natalPoints, location, date = new Date()) {
  const transitPoints = transitPointsForDate(date, location);
  return computeSynastry(transitPoints, natalPoints);
}

/**
 * Strongest transit-to-natal aspects over the next 7 days, sampled once per
 * day at noon. Daily sampling is coarse but sufficient for a weekly read —
 * for each recurring (transiting point, aspect, natal point) triple we keep
 * only the tightest (most exact) occurrence across the week.
 */
export function computeWeekTransits(natalPoints, location, startDate = new Date()) {
  const tightestByTriple = new Map();

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const day = new Date(startDate);
    day.setDate(day.getDate() + dayOffset);
    day.setHours(12, 0, 0, 0);

    const transitPoints = transitPointsForDate(day, location);
    const matches = computeSynastry(transitPoints, natalPoints);

    for (const match of matches) {
      const tripleKey = `${match.a.key}-${match.aspect}-${match.b.key}`;
      const existing = tightestByTriple.get(tripleKey);
      if (!existing || match.exactness < existing.exactness) {
        tightestByTriple.set(tripleKey, { ...match, date: day });
      }
    }
  }

  return [...tightestByTriple.values()].sort((m1, m2) => m1.exactness - m2.exactness);
}

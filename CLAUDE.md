# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

AstroLove is a static, client-side-only web page. Users enter birth date/time/coordinates
for a woman and a man; the page computes both natal charts and the astrological
connections (aspects, same-sign matches) between them, entirely in the browser. There is
no backend and no birth data ever leaves the client.

## Commands

```
npm install
npm run dev       # Vite dev server with hot reload
npm run build     # production build to dist/ (this is the deployable static site)
npm run preview   # serve the dist/ build locally to sanity-check a production build
```

There is no test suite or linter configured yet.

## Architecture

- `src/astro.js` — astrology domain logic, decoupled from the DOM:
  - `buildChart(origin)` wraps `circular-natal-horoscope-js`'s `Origin`/`Horoscope`
    classes. `Origin` takes 0-indexed months (`month - 1` conversion happens here) and
    derives timezone/DST automatically from latitude/longitude — no manual timezone
    input is collected from the user.
  - `extractPoints(horoscope)` flattens the library's nested per-body objects
    (`CelestialBodies.<planet>`, `Ascendant`) into a simple array of
    `{ key, label, glyph, sign, signGlyph, degree, absoluteDegree, retrograde }` used by
    both the text list renderer and the chart wheel.
  - `computeSynastry(pointsA, pointsB)` is custom cross-chart aspect matching — it is
    **not** provided by the library (the library only computes aspects within a single
    chart). It compares every point in chart A against every point in chart B using the
    angle/orb table in `ASPECT_DEFINITIONS` (conjunction/sextile/square/trine/opposition)
    and returns matches sorted by exactness (closest to exact angle first).
  - `sameSignMatches(pointsA, pointsB)` is a simpler secondary connection type (same
    zodiac sign on both charts), rendered as a fallback/supplement to aspect matches.
- `src/chart-wheel.js` — renders a circular natal chart (zodiac ring, sign glyphs,
  ascendant/descendant axis, planet glyphs placed by ecliptic degree) as an inline SVG
  built with `document.createElementNS`, not a template string. `pickFreeRing` does
  simple crowding avoidance (nudges a planet's radius inward when other points sit
  within 9° of it) so conjunctions don't render as fully overlapping glyphs.
- `src/interpretations.js` — turns raw `computeSynastry` matches into human-readable
  relationship text, bucketed into three categories via `POINT_CATEGORIES` (which
  points speak to "connection" vs "love" vs "family"): Human Connection, Love &
  Relationship, Family & Long-Term Life. A match can appear in more than one bucket.
  `buildSummary` produces the one-line overall verdict shown above the three lists.
  `computeCompatibilityScore` produces the 0-100% badge — it's a **weighted average**
  of aspect quality (base score per aspect type × point importance × exactness), not a
  sum, because the aspect orbs are wide enough that most chart pairs share dozens of
  matches; summing would push nearly everyone to the same ceiling. Tuned by hand against
  random chart pairs to land roughly in the 50-80% range (see git history for the node
  snippets used to calibrate it) — retune by adjusting `ASPECT_SCORE`/`POINT_WEIGHT`/the
  `* 11` multiplier if the spread drifts, not by changing the clamp bounds.
  This is where to add/adjust the meaning of a given planet or aspect combination —
  keep the astrology math itself in `astro.js`.
- `src/sign-meanings.js` — per-person (not synastry) personality text: `SUN_TRAITS` and
  `ASCENDANT_TRAITS` are flat sign → blurb dictionaries; `buildPersonalityProfile(points)`
  pulls the `sun` and `ascendant` entries out of a single chart's `extractPoints()` array.
  Rendered as two cards ("Sun in X" / "Ascendant in Y") above each person's planet list —
  this is each individual's own horoscope/rising-sign read, separate from the synastry
  reading in `interpretations.js`.
- `src/date-format.js` — European date (DD/MM/YYYY) and 24h time (HH:MM) input
  handling: typing masks (auto-inserts `/` and `:`) plus parse/format functions. Birth
  date/time fields are plain `<input type="text">`, not `<input type="date">`/`type="time"`,
  specifically so the displayed format doesn't follow the browser/OS locale.
- `src/storage.js` — persists both people's form fields to `localStorage`
  (`astrolove:form:v1`) on submit and pre-fills them on load; `main.js`'s `init()`
  auto-computes and shows results on load if a full pre-filled pair is present. No
  network calls are involved — this is purely `localStorage`.
- `src/main.js` — DOM wiring only: reads the two birth-data forms, calls into
  `astro.js`/`chart-wheel.js`/`interpretations.js`, and renders the chart columns, the
  raw "Connections" list, and the "Compatibility Reading" section. Keep astrology math
  out of this file; keep DOM manipulation out of `astro.js`.
- `index.html` / `src/style.css` — three-column results layout (woman | connections |
  man) above a full-width "Compatibility Reading" section, with a woman/man accent
  color pair used consistently across form panels, chart columns, and wheel glyphs.

## Theming

All colors are CSS custom properties defined three times in `src/style.css`: once on
bare `:root` (dark, the default), once under `@media (prefers-color-scheme: light)`
guarded by `:root:not([data-theme="dark"])`, and once under `:root[data-theme="light"]`
so a manual override always wins over the system preference. Do not hardcode a color
anywhere else — add a new token to all three blocks instead. `src/main.js`'s
`initTheme`/`setTheme` toggle `document.documentElement.dataset.theme` and persist the
choice to `localStorage` (`astrolove:theme`); a small inline script in `index.html`'s
`<head>` applies the stored theme before first paint to avoid a flash. The chart wheel's
per-person glyph color is themed via CSS classes (`wheel-point-glyph--woman`/`--man` in
`chart-wheel.js`/`style.css`), not an inline SVG `fill`, so it follows the theme too.

## Key library notes (`circular-natal-horoscope-js`)

- Import from the package root: `import { Origin, Horoscope } from "circular-natal-horoscope-js"`.
- `Origin` months are 0-indexed (January = 0).
- Latitude/longitude are required inputs from the user; the library derives timezone and
  historical DST from them, so do not add a separate timezone field.
- Useful result shapes: `horoscope.CelestialBodies.<key>` (sun, moon, mercury, venus,
  mars, jupiter, saturn, uranus, neptune, pluto — plus chiron/sirius, unused here),
  `horoscope.Ascendant`, each with `.Sign.key`, `.ChartPosition.Ecliptic.DecimalDegrees`,
  `.ChartPosition.Ecliptic.ArcDegreesFormatted30`, and `.isRetrograde`.
- The library's own `Aspects`/aspect config is unused in this app — cross-chart synastry
  is computed manually in `computeSynastry` instead (see above).

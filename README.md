# AstroLove

Live site: https://ntufar.github.io/astrolove/

A static, client-side web page that compares the birth charts (natal
horoscopes) of a woman and a man side by side, and highlights the
astrological connections (aspects and sign matches) between them.

Enter each person's date (DD/MM/YYYY), time (24h, HH:MM), and place
(latitude/longitude) of birth. The woman's chart wheel, individual
personality profile (Sun sign and Ascendant), and planet positions
render on the left, the man's on the right, and the middle column
lists the raw connections found between the two charts —
cross-chart aspects (conjunction, sextile, square, trine, opposition)
and same-sign matches. Below that, a "Compatibility Reading" section
translates those connections into plain-language notes on human
connection, love/relationship, and family/long-term life — including
where the two charts *don't* connect strongly.

Birth data you enter is saved in the browser's `localStorage` and
pre-filled next time you open the page (nothing is sent anywhere).

All astrology math (planetary positions, ascendant, aspects) runs
entirely in the browser via
[`circular-natal-horoscope-js`](https://github.com/0xStarcat/CircularNatalHoroscopeJS).
No birth data is sent to any server — this ships as a static site with
no backend.

## Getting started

```
npm install
npm run dev       # local dev server with hot reload
npm run build      # production build to dist/
npm run preview    # serve the production build locally
```

## Usage notes

- Latitude/longitude are required (not just city names) because the
  chart math needs precise coordinates; timezone and daylight saving
  time are derived automatically from those coordinates and the date.
- A "use birthplace coordinates from browser" button is provided as a
  convenience for testing with the current device location — it is not
  a substitute for the actual birthplace coordinates.

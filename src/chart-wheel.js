// Renders a circular natal chart wheel as an inline SVG: the zodiac ring with
// sign glyphs, the ascendant/descendant horizon line, and each planet placed
// around the wheel at its ecliptic longitude.

const SIGNS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
];

const SIGN_GLYPHS = {
  aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋",
  leo: "♌", virgo: "♍", libra: "♎", scorpio: "♏",
  sagittarius: "♐", capricorn: "♑", aquarius: "♒", pisces: "♓",
};

const SIZE = 320;
const CENTER = SIZE / 2;
const OUTER_R = 150;
const SIGN_RING_R = 128;
const PLANET_BASE_R = 96;
const PLANET_RING_STEP = 16;
const INNER_R = 40;

export function renderChartWheel(points, accentColor) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`);
  svg.setAttribute("class", "chart-wheel");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Natal chart wheel");

  svg.appendChild(circle(CENTER, CENTER, OUTER_R, "wheel-ring"));
  svg.appendChild(circle(CENTER, CENTER, SIGN_RING_R, "wheel-ring"));
  svg.appendChild(circle(CENTER, CENTER, INNER_R, "wheel-ring"));

  // 12 sign divisions + glyphs
  for (let i = 0; i < 12; i++) {
    const startDeg = i * 30;
    const divider = lineAtDegree(startDeg, INNER_R, OUTER_R, "wheel-divider");
    svg.appendChild(divider);

    const glyphPos = pointOnCircle(startDeg + 15, (SIGN_RING_R + OUTER_R) / 2);
    svg.appendChild(text(glyphPos.x, glyphPos.y, SIGN_GLYPHS[SIGNS[i]], "wheel-sign-glyph"));
  }

  const ascendant = points.find((p) => p.key === "ascendant");
  if (ascendant) {
    svg.appendChild(lineAtDegree(ascendant.absoluteDegree, INNER_R, OUTER_R, "wheel-axis"));
    svg.appendChild(lineAtDegree(ascendant.absoluteDegree + 180, INNER_R, OUTER_R, "wheel-axis"));
  }

  const placedDegrees = [];
  const sorted = [...points].sort((a, b) => a.absoluteDegree - b.absoluteDegree);
  for (const point of sorted) {
    const ring = pickFreeRing(point.absoluteDegree, placedDegrees);
    placedDegrees.push(point.absoluteDegree);
    const radius = PLANET_BASE_R - ring * PLANET_RING_STEP;
    const pos = pointOnCircle(point.absoluteDegree, radius);

    const marker = lineFromDegreeToRing(point.absoluteDegree, INNER_R, radius + 8);
    svg.appendChild(marker);

    const label = text(pos.x, pos.y, point.glyph, "wheel-point-glyph");
    label.setAttribute("fill", accentColor);
    svg.appendChild(label);
  }

  return svg;
}

function pickFreeRing(degree, placedDegrees) {
  const closeEnough = (d) => angularSeparation(d, degree) < 9;
  const crowd = placedDegrees.filter(closeEnough).length;
  return Math.min(crowd, 3);
}

function angularSeparation(deg1, deg2) {
  const diff = Math.abs(deg1 - deg2) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function pointOnCircle(degree, radius) {
  const rad = ((180 - degree) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER - radius * Math.sin(rad),
  };
}

function lineAtDegree(degree, r1, r2, className) {
  const p1 = pointOnCircle(degree, r1);
  const p2 = pointOnCircle(degree, r2);
  return line(p1.x, p1.y, p2.x, p2.y, className);
}

function lineFromDegreeToRing(degree, r1, r2) {
  const p1 = pointOnCircle(degree, r1);
  const p2 = pointOnCircle(degree, r2);
  return line(p1.x, p1.y, p2.x, p2.y, "wheel-tick");
}

function circle(cx, cy, r, className) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  el.setAttribute("cx", cx);
  el.setAttribute("cy", cy);
  el.setAttribute("r", r);
  el.setAttribute("class", className);
  return el;
}

function line(x1, y1, x2, y2, className) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "line");
  el.setAttribute("x1", x1);
  el.setAttribute("y1", y1);
  el.setAttribute("x2", x2);
  el.setAttribute("y2", y2);
  el.setAttribute("class", className);
  return el;
}

function text(x, y, content, className) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "text");
  el.setAttribute("x", x);
  el.setAttribute("y", y);
  el.setAttribute("class", className);
  el.setAttribute("text-anchor", "middle");
  el.setAttribute("dominant-baseline", "central");
  el.textContent = content;
  return el;
}

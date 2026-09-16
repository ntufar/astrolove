import "./style.css";
import { buildChart, extractPoints, computeSynastry, sameSignMatches } from "./astro.js";
import { attachDateMask, attachTimeMask, parseEuropeanDate, parseTime } from "./date-format.js";
import { saveFormData, loadFormData } from "./storage.js";
import { renderChartWheel } from "./chart-wheel.js";
import { generateInterpretations } from "./interpretations.js";

const form = document.querySelector("#chart-form");
const resultsSection = document.querySelector("#results");
const readingSection = document.querySelector("#reading");
const womanChartEl = document.querySelector("#woman-chart");
const manChartEl = document.querySelector("#man-chart");
const womanWheelEl = document.querySelector("#woman-wheel");
const manWheelEl = document.querySelector("#man-wheel");
const connectionsEl = document.querySelector("#connections");
const womanHeading = document.querySelector("#woman-heading");
const manHeading = document.querySelector("#man-heading");
const readingSummaryEl = document.querySelector("#reading-summary");
const compatibilityPercentageEl = document.querySelector("#compatibility-percentage");
const compatibilityLabelEl = document.querySelector("#compatibility-label");
const readingConnectionEl = document.querySelector("#reading-connection");
const readingLoveEl = document.querySelector("#reading-love");
const readingFamilyEl = document.querySelector("#reading-family");

const WOMAN_ACCENT = "#f2669e";
const MAN_ACCENT = "#5aa9e6";

form.querySelectorAll('input[name$="-date"]').forEach(attachDateMask);
form.querySelectorAll('input[name$="-time"]').forEach(attachTimeMask);

document.querySelectorAll(".locate-btn").forEach((btn) => {
  btn.addEventListener("click", () => handleLocate(btn.dataset.target));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  handleSubmit();
});

init();

function init() {
  const filled = loadFormData(form);
  if (filled && tryCompute({ silent: true })) {
    resultsSection.hidden = false;
    readingSection.hidden = false;
  }
}

function handleLocate(target) {
  if (!navigator.geolocation) {
    alert("Geolocation isn't available in this browser. Please enter coordinates manually.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      form.querySelector(`[name="${target}-lat"]`).value = position.coords.latitude.toFixed(4);
      form.querySelector(`[name="${target}-lon"]`).value = position.coords.longitude.toFixed(4);
    },
    () => {
      alert("Couldn't get your location. Please enter coordinates manually.");
    },
  );
}

function handleSubmit() {
  const ok = tryCompute({ silent: false });
  if (!ok) return;

  saveFormData(form);
  resultsSection.hidden = false;
  readingSection.hidden = false;
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function tryCompute({ silent }) {
  const data = new FormData(form);

  const woman = readPerson(data, "woman");
  const man = readPerson(data, "man");

  if (!woman || !man) {
    if (!silent) {
      alert("Please fill in a complete date (DD/MM/YYYY), time (HH:MM), and coordinates for both people.");
    }
    return false;
  }

  const womanChart = buildChart(woman.origin);
  const manChart = buildChart(man.origin);

  const womanPoints = extractPoints(womanChart);
  const manPoints = extractPoints(manChart);

  womanHeading.textContent = woman.name ? `${woman.name}'s Chart` : "Woman's Chart";
  manHeading.textContent = man.name ? `${man.name}'s Chart` : "Man's Chart";

  renderPoints(womanChartEl, womanPoints);
  renderPoints(manChartEl, manPoints);

  womanWheelEl.innerHTML = "";
  womanWheelEl.appendChild(renderChartWheel(womanPoints, WOMAN_ACCENT));
  manWheelEl.innerHTML = "";
  manWheelEl.appendChild(renderChartWheel(manPoints, MAN_ACCENT));

  const aspectMatches = computeSynastry(womanPoints, manPoints);
  const signMatches = sameSignMatches(womanPoints, manPoints);
  renderConnections(aspectMatches, signMatches);
  renderReading(aspectMatches, signMatches);

  return true;
}

function readPerson(formData, prefix) {
  const dateStr = formData.get(`${prefix}-date`);
  const timeStr = formData.get(`${prefix}-time`);
  const lat = parseFloat(formData.get(`${prefix}-lat`));
  const lon = parseFloat(formData.get(`${prefix}-lon`));
  const name = (formData.get(`${prefix}-name`) || "").trim();

  const date = parseEuropeanDate(dateStr);
  const time = parseTime(timeStr);

  if (!date || !time || Number.isNaN(lat) || Number.isNaN(lon)) {
    return null;
  }

  return {
    name,
    origin: {
      year: date.year,
      month: date.month,
      date: date.day,
      hour: time.hour,
      minute: time.minute,
      latitude: lat,
      longitude: lon,
    },
  };
}

function renderPoints(container, points) {
  container.innerHTML = "";
  for (const point of points) {
    const row = document.createElement("div");
    row.className = "chart-point";
    row.innerHTML = `
      <span class="glyph">${point.glyph}</span>
      <span class="label">${point.label}</span>
      <span class="value">${point.signGlyph} ${capitalize(point.sign)} ${point.degree}</span>
      ${point.retrograde ? '<span class="retro">R</span>' : ""}
    `;
    container.appendChild(row);
  }
}

function renderConnections(aspectMatches, signMatches) {
  connectionsEl.innerHTML = "";

  if (aspectMatches.length === 0 && signMatches.length === 0) {
    connectionsEl.innerHTML = '<p class="empty-connections">No close astrological connections found within standard orbs.</p>';
    return;
  }

  for (const match of aspectMatches) {
    const card = document.createElement("div");
    card.className = `connection-card tone-${match.tone}`;
    card.innerHTML = `
      <div class="connection-points">
        <span>${match.a.glyph} ${match.a.label}</span>
        <span>${match.b.glyph} ${match.b.label}</span>
      </div>
      <span class="aspect-name">${match.aspect}</span>
    `;
    connectionsEl.appendChild(card);
  }

  const uniqueSignMatches = signMatches.filter(
    (sm) => !aspectMatches.some((am) => am.a.key === sm.a.key && am.b.key === sm.b.key),
  );

  for (const match of uniqueSignMatches) {
    const card = document.createElement("div");
    card.className = "connection-card tone-harmonious";
    card.innerHTML = `
      <div class="connection-points">
        <span>${match.a.glyph} ${match.a.label}</span>
        <span>${match.b.glyph} ${match.b.label}</span>
      </div>
      <span class="aspect-name">same sign · ${capitalize(match.a.sign)}</span>
    `;
    connectionsEl.appendChild(card);
  }
}

function renderReading(aspectMatches, signMatches) {
  const reading = generateInterpretations(aspectMatches, signMatches);

  compatibilityPercentageEl.textContent = `${reading.compatibility.percentage}%`;
  compatibilityLabelEl.textContent = reading.compatibility.label;
  readingSummaryEl.textContent = reading.summary;

  renderReadingList(readingConnectionEl, reading.connection, "No standout human-connection aspects — rapport here will be built deliberately rather than felt automatically.");
  renderReadingList(readingLoveEl, reading.love, "No standout romantic aspects — attraction may need active cultivation rather than instant spark.");
  renderReadingList(readingFamilyEl, reading.family, "No standout family/stability aspects — long-term commitment will take conscious work to build.");
}

function renderReadingList(container, items, emptyMessage) {
  container.innerHTML = "";
  if (items.length === 0) {
    container.innerHTML = `<p class="empty-connections">${emptyMessage}</p>`;
    return;
  }
  for (const item of items) {
    const card = document.createElement("div");
    card.className = `reading-card tone-${item.tone}`;
    card.textContent = item.sentence;
    container.appendChild(card);
  }
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

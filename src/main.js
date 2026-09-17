import "./style.css";
import { buildChart, extractPoints, computeSynastry, sameSignMatches } from "./astro.js";
import { attachDateMask, attachTimeMask, parseEuropeanDate, parseTime } from "./date-format.js";
import { saveFormData, loadFormData } from "./storage.js";
import { renderChartWheel } from "./chart-wheel.js";
import { generateInterpretations } from "./interpretations.js";
import { buildPersonalityProfile } from "./sign-meanings.js";
import { GREEK_CITIES, cityDisplayName } from "./greek-cities.js";
import { computeDayTransits, computeWeekTransits } from "./transits.js";
import { generateDayPrediction, generateWeekPrediction } from "./predictions.js";
import { getLang, setLang, ui, signName, pointLabel, aspectName, localeTag } from "./i18n.js";

const form = document.querySelector("#chart-form");
const resultsSection = document.querySelector("#results");
const readingSection = document.querySelector("#reading");
const predictionsSection = document.querySelector("#predictions");
const womanChartEl = document.querySelector("#woman-chart");
const manChartEl = document.querySelector("#man-chart");
const womanWheelEl = document.querySelector("#woman-wheel");
const manWheelEl = document.querySelector("#man-wheel");
const womanProfileEl = document.querySelector("#woman-profile");
const manProfileEl = document.querySelector("#man-profile");
const connectionsEl = document.querySelector("#connections");
const womanHeading = document.querySelector("#woman-heading");
const manHeading = document.querySelector("#man-heading");
const readingSummaryEl = document.querySelector("#reading-summary");
const compatibilityPercentageEl = document.querySelector("#compatibility-percentage");
const compatibilityLabelEl = document.querySelector("#compatibility-label");
const readingConnectionEl = document.querySelector("#reading-connection");
const readingLoveEl = document.querySelector("#reading-love");
const readingFamilyEl = document.querySelector("#reading-family");
const womanPredictionHeading = document.querySelector("#woman-prediction-heading");
const manPredictionHeading = document.querySelector("#man-prediction-heading");
const womanPredictionDaySummaryEl = document.querySelector("#woman-prediction-day-summary");
const womanPredictionDayEl = document.querySelector("#woman-prediction-day");
const womanPredictionWeekSummaryEl = document.querySelector("#woman-prediction-week-summary");
const womanPredictionWeekEl = document.querySelector("#woman-prediction-week");
const manPredictionDaySummaryEl = document.querySelector("#man-prediction-day-summary");
const manPredictionDayEl = document.querySelector("#man-prediction-day");
const manPredictionWeekSummaryEl = document.querySelector("#man-prediction-week-summary");
const manPredictionWeekEl = document.querySelector("#man-prediction-week");
const womanCitySelect = document.querySelector("#woman-city");
const manCitySelect = document.querySelector("#man-city");
const womanNameInput = document.querySelector("#woman-name-input");
const manNameInput = document.querySelector("#man-name-input");

const THEME_STORAGE_KEY = "astrolove:theme";
const themeToggleBtn = document.querySelector("#theme-toggle");
const langToggleBtn = document.querySelector("#lang-toggle");

let currentLang = getLang();

initTheme();
themeToggleBtn.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme || (systemPrefersDark() ? "dark" : "light");
  setTheme(current === "dark" ? "light" : "dark");
});

function systemPrefersDark() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true;
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggleBtn.textContent = theme === "dark" ? "🌙" : "☀️";
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage unavailable — theme choice just won't persist across visits.
  }
}

function initTheme() {
  const stored = document.documentElement.dataset.theme;
  const theme = stored === "light" || stored === "dark" ? stored : systemPrefersDark() ? "dark" : "light";
  setTheme(theme);
}

langToggleBtn.addEventListener("click", () => {
  applyLanguage(currentLang === "el" ? "en" : "el");
  // Re-run the computation (if the form is already filled) so all generated
  // text — sentences, sign names, etc. — switches language too.
  tryCompute({ silent: true });
});

applyLanguage(currentLang);

function applyLanguage(lang) {
  currentLang = lang;
  setLang(lang);
  document.documentElement.lang = lang;
  langToggleBtn.textContent = lang === "el" ? "EN" : "ΕΛ";
  langToggleBtn.setAttribute("aria-label", ui(lang, "langToggleAria"));
  themeToggleBtn.setAttribute("aria-label", ui(lang, "themeToggleAria"));
  applyStaticText(lang);
  populateCitySelect(womanCitySelect, lang);
  populateCitySelect(manCitySelect, lang);
}

function applyStaticText(lang) {
  setText("#tagline", ui(lang, "tagline"));
  setText("#woman-title", ui(lang, "womanTitle"));
  setText("#man-title", ui(lang, "manTitle"));
  setText("#woman-name-label", ui(lang, "nameLabel"));
  setText("#man-name-label", ui(lang, "nameLabel"));
  womanNameInput.placeholder = ui(lang, "womanNamePlaceholder");
  manNameInput.placeholder = ui(lang, "manNamePlaceholder");
  setText("#woman-date-label", ui(lang, "dateLabel"));
  setText("#man-date-label", ui(lang, "dateLabel"));
  setText("#woman-time-label", ui(lang, "timeLabel"));
  setText("#man-time-label", ui(lang, "timeLabel"));
  setText("#woman-city-label", ui(lang, "cityLabel"));
  setText("#man-city-label", ui(lang, "cityLabel"));
  setText("#submit-btn", ui(lang, "submitButton"));
  setText("#coord-hint", ui(lang, "coordHint"));
  setText("#connections-heading", ui(lang, "connectionsHeading"));
  setText("#reading-heading", ui(lang, "readingHeading"));
  setText("#human-connection-heading", ui(lang, "humanConnectionHeading"));
  setText("#love-relationship-heading", ui(lang, "loveRelationshipHeading"));
  setText("#family-longterm-heading", ui(lang, "familyLongTermHeading"));
  setText("#predictions-heading", ui(lang, "predictionsHeading"));
  setText("#woman-today-label", ui(lang, "todayLabel"));
  setText("#man-today-label", ui(lang, "todayLabel"));
  setText("#woman-week-label", ui(lang, "thisWeekLabel"));
  setText("#man-week-label", ui(lang, "thisWeekLabel"));

  const womanName = womanNameInput.value.trim();
  const manName = manNameInput.value.trim();
  womanHeading.textContent = womanName ? ui(lang, "womanChartHeadingNamed")(womanName) : ui(lang, "womanChartHeadingDefault");
  manHeading.textContent = manName ? ui(lang, "manChartHeadingNamed")(manName) : ui(lang, "manChartHeadingDefault");
  womanPredictionHeading.textContent = womanName ? ui(lang, "womanForecastNamed")(womanName) : ui(lang, "womanForecastDefault");
  manPredictionHeading.textContent = manName ? ui(lang, "manForecastNamed")(manName) : ui(lang, "manForecastDefault");
}

function setText(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

form.querySelectorAll('input[name$="-date"]').forEach(attachDateMask);
form.querySelectorAll('input[name$="-time"]').forEach(attachTimeMask);

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
    predictionsSection.hidden = false;
  }
}

function populateCitySelect(select, lang) {
  const previousValue = select.value;
  const sorted = [...GREEK_CITIES].sort((a, b) =>
    cityDisplayName(a, lang).localeCompare(cityDisplayName(b, lang), localeTag(lang)),
  );

  select.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.disabled = true;
  placeholder.textContent = ui(lang, "cityPlaceholderOption");
  select.appendChild(placeholder);

  for (const city of sorted) {
    const option = document.createElement("option");
    option.value = city.name;
    option.textContent = cityDisplayName(city, lang);
    select.appendChild(option);
  }

  select.value = previousValue || "";
  if (!select.value) placeholder.selected = true;
}

function handleSubmit() {
  const ok = tryCompute({ silent: false });
  if (!ok) return;

  saveFormData(form);
  resultsSection.hidden = false;
  readingSection.hidden = false;
  predictionsSection.hidden = false;
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function tryCompute({ silent }) {
  const lang = currentLang;
  const data = new FormData(form);

  const woman = readPerson(data, "woman");
  const man = readPerson(data, "man");

  if (!woman || !man) {
    if (!silent) {
      alert(ui(lang, "validationAlert"));
    }
    return false;
  }

  const womanChart = buildChart(woman.origin);
  const manChart = buildChart(man.origin);

  const womanPoints = extractPoints(womanChart);
  const manPoints = extractPoints(manChart);

  womanHeading.textContent = woman.name ? ui(lang, "womanChartHeadingNamed")(woman.name) : ui(lang, "womanChartHeadingDefault");
  manHeading.textContent = man.name ? ui(lang, "manChartHeadingNamed")(man.name) : ui(lang, "manChartHeadingDefault");

  renderPoints(womanChartEl, womanPoints, lang);
  renderPoints(manChartEl, manPoints, lang);

  womanWheelEl.innerHTML = "";
  womanWheelEl.appendChild(renderChartWheel(womanPoints, "woman"));
  manWheelEl.innerHTML = "";
  manWheelEl.appendChild(renderChartWheel(manPoints, "man"));

  renderProfile(womanProfileEl, buildPersonalityProfile(womanPoints, lang), lang);
  renderProfile(manProfileEl, buildPersonalityProfile(manPoints, lang), lang);

  const aspectMatches = computeSynastry(womanPoints, manPoints);
  const signMatches = sameSignMatches(womanPoints, manPoints);
  renderConnections(aspectMatches, signMatches, lang);
  renderReading(aspectMatches, signMatches, lang);

  womanPredictionHeading.textContent = woman.name ? ui(lang, "womanForecastNamed")(woman.name) : ui(lang, "womanForecastDefault");
  manPredictionHeading.textContent = man.name ? ui(lang, "manForecastNamed")(man.name) : ui(lang, "manForecastDefault");
  renderPredictions(womanPoints, woman.location, womanPredictionDaySummaryEl, womanPredictionDayEl, womanPredictionWeekSummaryEl, womanPredictionWeekEl, lang);
  renderPredictions(manPoints, man.location, manPredictionDaySummaryEl, manPredictionDayEl, manPredictionWeekSummaryEl, manPredictionWeekEl, lang);

  return true;
}

function renderPredictions(natalPoints, location, daySummaryEl, dayListEl, weekSummaryEl, weekListEl, lang) {
  const dayMatches = computeDayTransits(natalPoints, location);
  const weekMatches = computeWeekTransits(natalPoints, location);

  const dayPrediction = generateDayPrediction(dayMatches, lang);
  const weekPrediction = generateWeekPrediction(weekMatches, lang);

  daySummaryEl.textContent = dayPrediction.summary;
  renderPredictionList(dayListEl, dayPrediction.items);

  weekSummaryEl.textContent = weekPrediction.summary;
  renderPredictionList(weekListEl, weekPrediction.items);
}

function renderPredictionList(container, items) {
  container.innerHTML = "";
  for (const item of items) {
    const card = document.createElement("div");
    card.className = `prediction-card tone-${item.tone}`;
    card.textContent = item.sentence;
    container.appendChild(card);
  }
}

function readPerson(formData, prefix) {
  const dateStr = formData.get(`${prefix}-date`);
  const timeStr = formData.get(`${prefix}-time`);
  const cityName = formData.get(`${prefix}-city`);
  const name = (formData.get(`${prefix}-name`) || "").trim();

  const date = parseEuropeanDate(dateStr);
  const time = parseTime(timeStr);
  const city = GREEK_CITIES.find((c) => c.name === cityName);

  if (!date || !time || !city) {
    return null;
  }

  return {
    name,
    location: { latitude: city.latitude, longitude: city.longitude },
    origin: {
      year: date.year,
      month: date.month,
      date: date.day,
      hour: time.hour,
      minute: time.minute,
      latitude: city.latitude,
      longitude: city.longitude,
    },
  };
}

function renderPoints(container, points, lang) {
  container.innerHTML = "";
  for (const point of points) {
    const row = document.createElement("div");
    row.className = "chart-point";
    const glyphClass = point.key === "ascendant" ? "glyph glyph--asc" : "glyph";
    row.innerHTML = `
      <span class="${glyphClass}">${point.glyph}</span>
      <span class="label">${pointLabel(lang, point.key)}</span>
      <span class="value">${point.signGlyph} ${signName(lang, point.sign)} <span class="deg">${point.degree}</span></span>
      ${point.retrograde ? `<span class="retro">${ui(lang, "retro")}</span>` : ""}
    `;
    container.appendChild(row);
  }
}

function renderProfile(container, profile, lang) {
  container.innerHTML = "";
  if (!profile.sunSign || !profile.ascendantSign) return;

  const sunHeading = lang === "el" ? `Ήλιος σε ${signName(lang, profile.sunSign)}` : `Sun in ${signName(lang, profile.sunSign)}`;
  const ascHeading =
    lang === "el" ? `Ωροσκόπος σε ${signName(lang, profile.ascendantSign)}` : `Ascendant in ${signName(lang, profile.ascendantSign)}`;

  const sunCard = document.createElement("div");
  sunCard.className = "profile-card";
  sunCard.innerHTML = `
    <h3>${sunHeading}</h3>
    <p>${profile.sunText}</p>
  `;
  container.appendChild(sunCard);

  const ascCard = document.createElement("div");
  ascCard.className = "profile-card";
  ascCard.innerHTML = `
    <h3>${ascHeading}</h3>
    <p>${profile.ascendantText}</p>
  `;
  container.appendChild(ascCard);
}

function renderConnections(aspectMatches, signMatches, lang) {
  connectionsEl.innerHTML = "";

  if (aspectMatches.length === 0 && signMatches.length === 0) {
    connectionsEl.innerHTML = `<p class="empty-connections">${ui(lang, "noConnections")}</p>`;
    return;
  }

  for (const match of aspectMatches) {
    const card = document.createElement("div");
    card.className = `connection-card tone-${match.tone}`;
    card.innerHTML = `
      <div class="connection-points">
        <span>${match.a.glyph} ${pointLabel(lang, match.a.key)}</span>
        <span>${match.b.glyph} ${pointLabel(lang, match.b.key)}</span>
      </div>
      <span class="aspect-name">${aspectName(lang, match.aspect)}</span>
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
        <span>${match.a.glyph} ${pointLabel(lang, match.a.key)}</span>
        <span>${match.b.glyph} ${pointLabel(lang, match.b.key)}</span>
      </div>
      <span class="aspect-name">${ui(lang, "sameSignLabel")} · ${signName(lang, match.a.sign)}</span>
    `;
    connectionsEl.appendChild(card);
  }
}

function renderReading(aspectMatches, signMatches, lang) {
  const reading = generateInterpretations(aspectMatches, signMatches, lang);

  compatibilityPercentageEl.textContent = `${reading.compatibility.percentage}%`;
  compatibilityLabelEl.textContent = reading.compatibility.label;
  readingSummaryEl.textContent = reading.summary;

  renderReadingList(readingConnectionEl, reading.connection, ui(lang, "emptyConnectionMsg"));
  renderReadingList(readingLoveEl, reading.love, ui(lang, "emptyLoveMsg"));
  renderReadingList(readingFamilyEl, reading.family, ui(lang, "emptyFamilyMsg"));
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

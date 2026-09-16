// European date (DD/MM/YYYY) and 24h time (HH:MM) input helpers: typing masks,
// parsing to numeric parts, and formatting back for pre-fill.

export function attachDateMask(input) {
  input.addEventListener("input", () => {
    input.value = maskDate(input.value);
  });
}

export function attachTimeMask(input) {
  input.addEventListener("input", () => {
    input.value = maskTime(input.value);
  });
}

function maskDate(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return parts.join("/");
}

function maskTime(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  const parts = [digits.slice(0, 2), digits.slice(2, 4)].filter(Boolean);
  return parts.join(":");
}

/** Parses "DD/MM/YYYY" into { day, month, year } or null if invalid. */
export function parseEuropeanDate(str) {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec((str || "").trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12) return null;
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return null;
  return { day, month, year };
}

/** Parses "HH:MM" (24h) into { hour, minute } or null if invalid. */
export function parseTime(str) {
  const match = /^(\d{1,2}):(\d{2})$/.exec((str || "").trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

export function formatEuropeanDate({ day, month, year }) {
  return `${pad(day)}/${pad(month)}/${year}`;
}

export function formatTime({ hour, minute }) {
  return `${pad(hour)}:${pad(minute)}`;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

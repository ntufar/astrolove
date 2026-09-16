// Persists the birth-data form between sessions in localStorage so returning
// visitors get their last entries pre-filled. No data ever leaves the device.

const STORAGE_KEY = "astrolove:form:v1";

const FIELDS = ["name", "date", "time", "lat", "lon"];

export function saveFormData(form) {
  const data = { woman: {}, man: {} };
  for (const person of ["woman", "man"]) {
    for (const field of FIELDS) {
      data[person][field] = form.querySelector(`[name="${person}-${field}"]`)?.value ?? "";
    }
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — silently skip persistence.
  }
}

export function loadFormData(form) {
  let data;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    data = JSON.parse(raw);
  } catch {
    return false;
  }

  let filledAny = false;
  for (const person of ["woman", "man"]) {
    for (const field of FIELDS) {
      const value = data?.[person]?.[field];
      if (value) {
        const input = form.querySelector(`[name="${person}-${field}"]`);
        if (input) {
          input.value = value;
          filledAny = true;
        }
      }
    }
  }
  return filledAny;
}

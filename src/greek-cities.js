// Birthplace list restricted to Greek cities/towns — coordinates are looked
// up here instead of being typed in by the user (see index.html's city
// <select>s and main.js's readPerson). `name` is the canonical (English)
// identifier used as the <option> value/storage key so it's stable across
// languages; `nameEl` is the Greek display form shown when lang is "el".
// Sorted alphabetically by `name` for the dropdown.
export const GREEK_CITIES = [
  { name: "Agrinio", nameEl: "Αγρίνιο", latitude: 38.6219, longitude: 21.4116 },
  { name: "Alexandroupoli", nameEl: "Αλεξανδρούπολη", latitude: 40.8459, longitude: 25.8747 },
  { name: "Argos", nameEl: "Άργος", latitude: 37.6333, longitude: 22.7333 },
  { name: "Arta", nameEl: "Άρτα", latitude: 39.1614, longitude: 20.9842 },
  { name: "Athens", nameEl: "Αθήνα", latitude: 37.9838, longitude: 23.7275 },
  { name: "Chalcis", nameEl: "Χαλκίδα", latitude: 38.4635, longitude: 23.6 },
  { name: "Chania", nameEl: "Χανιά", latitude: 35.5138, longitude: 24.018 },
  { name: "Chios", nameEl: "Χίος", latitude: 38.3667, longitude: 26.1333 },
  { name: "Corfu (Kerkyra)", nameEl: "Κέρκυρα", latitude: 39.6243, longitude: 19.9217 },
  { name: "Corinth", nameEl: "Κόρινθος", latitude: 37.9407, longitude: 22.9573 },
  { name: "Drama", nameEl: "Δράμα", latitude: 41.1497, longitude: 24.1478 },
  { name: "Edessa", nameEl: "Έδεσσα", latitude: 40.8017, longitude: 22.05 },
  { name: "Florina", nameEl: "Φλώρινα", latitude: 40.7833, longitude: 21.4 },
  { name: "Giannitsa", nameEl: "Γιαννιτσά", latitude: 40.7833, longitude: 22.4 },
  { name: "Grevena", nameEl: "Γρεβενά", latitude: 40.0864, longitude: 21.4258 },
  { name: "Heraklion", nameEl: "Ηράκλειο", latitude: 35.3387, longitude: 25.1442 },
  { name: "Ioannina", nameEl: "Ιωάννινα", latitude: 39.6667, longitude: 20.85 },
  { name: "Kalamata", nameEl: "Καλαμάτα", latitude: 37.0389, longitude: 22.1142 },
  { name: "Karditsa", nameEl: "Καρδίτσα", latitude: 39.3639, longitude: 21.9219 },
  { name: "Kastoria", nameEl: "Καστοριά", latitude: 40.5167, longitude: 21.2667 },
  { name: "Katerini", nameEl: "Κατερίνη", latitude: 40.2712, longitude: 22.5019 },
  { name: "Kavala", nameEl: "Καβάλα", latitude: 40.9397, longitude: 24.4022 },
  { name: "Kilkis", nameEl: "Κιλκίς", latitude: 40.9958, longitude: 22.8756 },
  { name: "Komotini", nameEl: "Κομοτηνή", latitude: 41.1228, longitude: 25.4056 },
  { name: "Kozani", nameEl: "Κοζάνη", latitude: 40.3, longitude: 21.7833 },
  { name: "Lamia", nameEl: "Λαμία", latitude: 38.9, longitude: 22.4333 },
  { name: "Larissa", nameEl: "Λάρισα", latitude: 39.6389, longitude: 22.4194 },
  { name: "Mytilene", nameEl: "Μυτιλήνη", latitude: 39.1064, longitude: 26.5544 },
  { name: "Nafplio", nameEl: "Ναύπλιο", latitude: 37.5667, longitude: 22.8 },
  { name: "Naxos", nameEl: "Νάξος", latitude: 37.1036, longitude: 25.3767 },
  { name: "Patras", nameEl: "Πάτρα", latitude: 38.2466, longitude: 21.7346 },
  { name: "Preveza", nameEl: "Πρέβεζα", latitude: 38.9575, longitude: 20.7511 },
  { name: "Ptolemaida", nameEl: "Πτολεμαΐδα", latitude: 40.5167, longitude: 21.6833 },
  { name: "Pyrgos", nameEl: "Πύργος", latitude: 37.6733, longitude: 21.4442 },
  { name: "Rethymno", nameEl: "Ρέθυμνο", latitude: 35.3667, longitude: 24.4833 },
  { name: "Rhodes", nameEl: "Ρόδος", latitude: 36.4341, longitude: 28.2176 },
  { name: "Serres", nameEl: "Σέρρες", latitude: 41.0856, longitude: 23.5464 },
  { name: "Sparta", nameEl: "Σπάρτη", latitude: 37.0733, longitude: 22.4297 },
  { name: "Syros (Ermoupoli)", nameEl: "Σύρος (Ερμούπολη)", latitude: 37.4467, longitude: 24.9425 },
  { name: "Thebes (Thiva)", nameEl: "Θήβα", latitude: 38.3167, longitude: 23.3167 },
  { name: "Thessaloniki", nameEl: "Θεσσαλονίκη", latitude: 40.6403, longitude: 22.9439 },
  { name: "Trikala", nameEl: "Τρίκαλα", latitude: 39.5556, longitude: 21.7681 },
  { name: "Tripoli", nameEl: "Τρίπολη", latitude: 37.5083, longitude: 22.375 },
  { name: "Veroia", nameEl: "Βέροια", latitude: 40.5233, longitude: 22.2019 },
  { name: "Volos", nameEl: "Βόλος", latitude: 39.3667, longitude: 22.9333 },
  { name: "Xanthi", nameEl: "Ξάνθη", latitude: 41.1353, longitude: 24.8883 },
  { name: "Zakynthos", nameEl: "Ζάκυνθος", latitude: 37.7876, longitude: 20.8998 },
];

export function cityDisplayName(city, lang) {
  return lang === "el" ? city.nameEl : city.name;
}

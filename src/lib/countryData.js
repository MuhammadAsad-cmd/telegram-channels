import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

// Register English locale
countries.registerLocale(enLocale);

// Get all countries as options with code for flags
export function getCountryOptions() {
  const countryNames = countries.getNames("en", { select: "official" });
  
  return Object.entries(countryNames)
    .map(([code, name]) => ({
      value: code,
      label: name,
      code: code,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

// Get country by code
export function getCountryByCode(code) {
  const name = countries.getName(code, "en");
  return name ? { value: code, label: name, code } : null;
}

// Common languages with their country codes for flags
export const languageOptions = [
  { value: "en", label: "English", code: "GB" },
  { value: "es", label: "Spanish", code: "ES" },
  { value: "pt", label: "Portuguese", code: "PT" },
  { value: "ru", label: "Russian", code: "RU" },
  { value: "ar", label: "Arabic", code: "SA" },
  { value: "zh", label: "Chinese", code: "CN" },
  { value: "hi", label: "Hindi", code: "IN" },
  { value: "bn", label: "Bengali", code: "BD" },
  { value: "fr", label: "French", code: "FR" },
  { value: "de", label: "German", code: "DE" },
  { value: "ja", label: "Japanese", code: "JP" },
  { value: "ko", label: "Korean", code: "KR" },
  { value: "it", label: "Italian", code: "IT" },
  { value: "tr", label: "Turkish", code: "TR" },
  { value: "vi", label: "Vietnamese", code: "VN" },
  { value: "th", label: "Thai", code: "TH" },
  { value: "pl", label: "Polish", code: "PL" },
  { value: "uk", label: "Ukrainian", code: "UA" },
  { value: "nl", label: "Dutch", code: "NL" },
  { value: "id", label: "Indonesian", code: "ID" },
  { value: "fa", label: "Persian", code: "IR" },
  { value: "ms", label: "Malay", code: "MY" },
  { value: "ur", label: "Urdu", code: "PK" },
  { value: "he", label: "Hebrew", code: "IL" },
  { value: "ro", label: "Romanian", code: "RO" },
  { value: "cs", label: "Czech", code: "CZ" },
  { value: "sv", label: "Swedish", code: "SE" },
  { value: "el", label: "Greek", code: "GR" },
  { value: "hu", label: "Hungarian", code: "HU" },
  { value: "fi", label: "Finnish", code: "FI" },
  { value: "da", label: "Danish", code: "DK" },
  { value: "no", label: "Norwegian", code: "NO" },
];

// Get language by value
export function getLanguageByValue(value) {
  return languageOptions.find((l) => l.value === value) || null;
}

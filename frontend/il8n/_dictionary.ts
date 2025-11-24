// frontend/app/i18n/dictionary.ts
import { UiTextKey } from "./_keys";
import type { LanguageCode } from "./_languages";

type TranslationTable = Partial<Record<UiTextKey, string>>;

const en: TranslationTable = {
  [UiTextKey.Genre]: "Genre",
  [UiTextKey.NewReleases]: "New Releases",
  [UiTextKey.Post]: "Post",
  [UiTextKey.ForYou]: "For You",
  [UiTextKey.RecommendedByFriends]: "Recommended by friends",
  [UiTextKey.Reviews]: "Reviews",
  [UiTextKey.Comments]: "Comments",
};

const hi: TranslationTable = {
  [UiTextKey.Genre]: "शैली",
  [UiTextKey.NewReleases]: "नई रिलीज़",
  [UiTextKey.Post]: "पोस्ट",
  [UiTextKey.ForYou]: "आपके लिए",
  [UiTextKey.RecommendedByFriends]: "दोस्तों की सिफ़ारिश",
  [UiTextKey.Reviews]: "समीक्षाएँ",
  [UiTextKey.Comments]: "टिप्पणियाँ",
};

const translations: Record<LanguageCode, TranslationTable> = {
  English: en,
  Hindi: hi,
};

export function translate(
  key: UiTextKey,
  lang: LanguageCode = "English"
): string {
  const table = translations[lang] ?? translations["English"];
  return table[key] ?? key; // fallback to key if missing
}

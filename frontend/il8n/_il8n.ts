// frontend/app/i18n/i18n.ts
import { UiTextKey } from "./_keys";

export type LanguageCode = "en" | "hi";

type TranslationTable = Partial<Record<UiTextKey, string>>;

const en: TranslationTable = {
  [UiTextKey.Genre]: "Genre",
  [UiTextKey.NewReleases]: "New Releases",
  [UiTextKey.Post]: "Post",
  [UiTextKey.ForYou]: "For You",
  [UiTextKey.RecommendedByFriends]: "Recommended by friends",
  [UiTextKey.Reviews]: "Reviews",
  [UiTextKey.Comments]: "Comments",

  [UiTextKey.AiSummary]: "AI Summary",
  [UiTextKey.PeopleLiked]: "People liked",
  [UiTextKey.CommonComplaints]: "Common complaints",
  [UiTextKey.RepresentativeComment]: "Representative comment",
  [UiTextKey.CineCircleAverage]: "CineCircle Average",
  [UiTextKey.PositiveCount]: "Positive",
  [UiTextKey.NeutralCount]: "Neutral",
  [UiTextKey.NegativeCount]: "Negative",
  [UiTextKey.BasedOnReviews]: "Based on {count} reviews",

  [UiTextKey.Loading]: "Loading...",
  [UiTextKey.FailedToLoadMovieData]: "Failed to load movie data",
  [UiTextKey.FailedToLoadAiSummary]: "Failed to load AI summary",
  [UiTextKey.NoReviewsYet]: "No reviews yet.",
  [UiTextKey.BeFirstToReview]: "Be the first to review!",
  [UiTextKey.NoCommentsYet]: "No comments yet.",
  [UiTextKey.StartConversation]: "Start the conversation!",
};

const hi: TranslationTable = {
  [UiTextKey.Genre]: "शैली",
  [UiTextKey.NewReleases]: "नई रिलीज़",
  [UiTextKey.Post]: "पोस्ट",
  [UiTextKey.ForYou]: "आपके लिए",
  [UiTextKey.RecommendedByFriends]: "दोस्तों की सिफ़ारिश",
  [UiTextKey.Reviews]: "समीक्षाएँ",
  [UiTextKey.Comments]: "टिप्पणियाँ",

  [UiTextKey.AiSummary]: "एआई सारांश",
  [UiTextKey.PeopleLiked]: "लोगों को पसंद आया",
  [UiTextKey.CommonComplaints]: "आम शिकायतें",
  [UiTextKey.RepresentativeComment]: "उदाहरण टिप्पणी",
  [UiTextKey.CineCircleAverage]: "CineCircle औसत",
  [UiTextKey.PositiveCount]: "सकारात्मक",
  [UiTextKey.NeutralCount]: "तटस्थ",
  [UiTextKey.NegativeCount]: "नकारात्मक",
  [UiTextKey.BasedOnReviews]: "{count} समीक्षाओं के आधार पर",

  [UiTextKey.Loading]: "लोड हो रहा है...",
  [UiTextKey.FailedToLoadMovieData]: "फ़िल्म डेटा लोड करने में विफल",
  [UiTextKey.FailedToLoadAiSummary]: "एआई सारांश लोड करने में विफल",
  [UiTextKey.NoReviewsYet]: "अभी तक कोई समीक्षा नहीं।",
  [UiTextKey.BeFirstToReview]: "सबसे पहले समीक्षा करें!",
  [UiTextKey.NoCommentsYet]: "अभी तक कोई टिप्पणी नहीं।",
  [UiTextKey.StartConversation]: "बातचीत शुरू करें!",
};

const translations: Record<LanguageCode, TranslationTable> = {
  en,
  hi,
};

// 🔹 Global current language
let currentLanguage: LanguageCode = "en";

// Map whatever the backend sends → internal codes
function normalizeLanguage(input: string | undefined | null): LanguageCode {
  if (!input) return "en";

  const lower = input.toLowerCase().trim();

  if (lower === "en" || lower === "english") return "en";
  if (lower === "hi" || lower === "hindi" || lower === "हिन्दी") return "hi";

  // default
  return "en";
}

export function setLanguage(raw: string) {
  const lang = normalizeLanguage(raw);
  console.log("[i18n] setLanguage called with raw:", raw, "-> normalized:", lang);
  currentLanguage = lang;
}

export function getLanguage(): LanguageCode {
  return currentLanguage;
}

export function t(key: UiTextKey): string {
  const table = translations[currentLanguage] ?? translations.en;
  const value = table[key] ?? key;
  console.log("[i18n] t()", {
    key,
    lang: currentLanguage,
    value,
  });
  return value;
}

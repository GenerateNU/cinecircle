import { api } from "./apiClient";

export type TranslateApiResponse = {
  success: boolean;
  sourceLanguage: string;
  sourceText: string;
  destinationLanguage: string;
  destinationText: string;
  pronunciation: {
    "source-text-phonetic": string | null;
    "source-text-audio": string;
    "destination-text-audio": string;
  };
  translations: {
    "all-translations": Array<[string, string[]]> | null;
    "possible-translations": string[];
    "possible-mistakes": string[] | null;
  };
  definitions: any[] | null;
};

export async function translateTextApi(
  text: string,
  destLang: string,
  sourceLang?: string
): Promise<TranslateApiResponse> {
  const params: Record<string, string> = {
    text,
    dl: destLang,
  };

  if (sourceLang) {
    params.sl = sourceLang;
  }

  // Your backend route is /api/translate
  return api.get<TranslateApiResponse>("/api/translate", params);
}
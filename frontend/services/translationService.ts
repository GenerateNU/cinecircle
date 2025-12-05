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

  // IMPORTANT: pass params directly (this matches your old working version)
  const response = await api.get<TranslateApiResponse>("/api/translate", params as any);

  // Handle both: api.get returns either raw data OR AxiosResponse
  const data = (response as any).data ?? response;
  return data as TranslateApiResponse;
}

import { Request, Response } from 'express';

const BASE_URL = 'https://ftapi.pythonanywhere.com';

interface TranslationResponse {
  'source-language': string;
  'source-text': string;
  'destination-language': string;
  'destination-text': string;
  pronunciation: {
    'source-text-phonetic': string | null;
    'source-text-audio': string;
    'destination-text-audio': string;
  };
  translations: {
    'all-translations': Array<[string, string[]]> | null;
    'possible-translations': string[];
    'possible-mistakes': string[] | null;
  };
  definitions: any[] | null;
  'see-also': string[] | null;
}

/**
 * translate text with optional source language (auto detect if not provided)
 * @query text - Text to translate (required)
 * @query dl - Destination language code (required)
 * @query sl - Source language code (optional, auto detects if not provided)
 */
export const translateText = async (req: Request, res: Response) => {
  try {
    const { text, dl, sl } = req.query;

    if (!text || !dl) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'Both text and destination language are required',
      });
    }

    const params = new URLSearchParams({
      dl: dl as string,
      text: text as string,
    });

    if (sl) {
      params.append('sl', sl as string);
    }

    const response = await fetch(`${BASE_URL}/translate?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data: TranslationResponse = await response.json();

    return res.status(200).json({
      success: true,
      sourceLanguage: data['source-language'],
      sourceText: data['source-text'],
      destinationLanguage: data['destination-language'],
      destinationText: data['destination-text'],
      pronunciation: data.pronunciation,
      translations: data.translations,
      definitions: data.definitions,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return res.status(500).json({
      error: 'Translation failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// get all supported languages
export const getSupportedLanguages = async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${BASE_URL}/languages`);

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const languages = await response.json();

    return res.status(200).json({
      success: true,
      languages,
    });
  } catch (error) {
    console.error('Error fetching languages:', error);
    return res.status(500).json({
      error: 'Failed to fetch supported languages',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};
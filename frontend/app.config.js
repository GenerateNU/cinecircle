export default {
  expo: {
    scheme: 'cinecircle',
    deepLinking: true,
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      apiBaseUrl: process.env.API_BASE_URL,
      supabaseRedirectUrl: "cinecircle://username",
      eas: {
        projectId: '6a01b6dd-ef8f-47b0-b777-9a03d0ed0453',
      },
    },
    ios: {
      bundleIdentifier: 'com.generate.cinecircle',
    },
    owner: 'generate-fall-2025-cinecircle',
  },
};

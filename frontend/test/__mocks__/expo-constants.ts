// Mock expo-constants for tests
export default {
  expoConfig: {
    extra: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
    },
  },
};


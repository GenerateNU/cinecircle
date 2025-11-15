import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",      
    globals: true,
    setupFiles: ["./test/setup.ts"],
    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
  },
  resolve: {
    alias: {
      'react-native': path.resolve(__dirname, './test/__mocks__/react-native.ts'),
      'expo-constants': path.resolve(__dirname, './test/__mocks__/expo-constants.ts'),
    },
  },
});

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    reporters: process.env.CI
      ? ["default", "github-actions", "html"]
      : ["default"],
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/__tests__/setup.js",
    coverage: {
      reporter: ["json-summary", "json", "html"],
    },
    testTimeout: 10000,
  },
});

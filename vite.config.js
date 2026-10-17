import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import quizManifest from "./src/quiz/manifest.json";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["apple-touch-icon.png"],
        // Quiz display identity lives in src/quiz/manifest.json; icons are
        // generated from src/quiz/favicon.svg by "npm run icons".
        manifest: {
          ...quizManifest,
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,woff,woff2}"],
        },
      }),
    ],
    // Use the environment variable, falling back to '/' if it's not set
    base: env.VITE_BASE_URL || "/",
  };
});

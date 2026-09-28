import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    // Use the environment variable, falling back to '/' if it's not set
    base: env.VITE_BASE_URL || "/",
  };
});

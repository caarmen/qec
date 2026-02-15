import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import i18next from "eslint-plugin-i18next";
// https://github.com/prettier/eslint-config-prettier#installation
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  globalIgnores(["dist", "coverage", "html"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    },
  },
  i18next.configs["flat/recommended"],
  {
    files: ["src/__tests__/**/*.{js,jsx}"],
    rules: {
      "i18next/no-literal-string": "off",
    },
  },
  eslintConfigPrettier,
  {
    files: ["vitest.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
]);

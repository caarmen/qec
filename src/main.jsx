import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import i18n from "./i18n";
import App from "./App.jsx";
import { registerSW } from "virtual:pwa-register";

document.title = i18n.t("startScreen.title");

// Match the browser chrome to the quiz palette: --color-primary-600 is set
// per quiz in src/quiz/theme.css.
const themeColor = getComputedStyle(document.documentElement)
  .getPropertyValue("--color-primary-600")
  .trim();
if (themeColor) {
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = themeColor;
}

registerSW({ immediate: true });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

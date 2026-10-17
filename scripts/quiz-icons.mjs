/*
  Derive the PWA and home-screen PNG icons from the quiz favicon.
  Run "npm run icons" after changing src/quiz/favicon.svg, and commit the
  generated files so deployments don't depend on this script running.
*/
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

mkdirSync("public", { recursive: true });
const svg = readFileSync("src/quiz/favicon.svg", "utf8");

const targets = [
  ["public/pwa-192x192.png", 192],
  ["public/pwa-512x512.png", 512],
  ["public/apple-touch-icon.png", 180],
];

for (const [file, size] of targets) {
  const png = new Resvg(svg, { fitTo: { mode: "width", value: size } })
    .render()
    .asPng();
  writeFileSync(file, png);
  console.log(`wrote ${file}`);
}

import { describe, it, expect } from "vitest";
import i18n from "../i18n";

describe("quiz strings overrides", () => {
  it("resolves quiz-specific keys from the quiz bundle", () => {
    expect(i18n.t("startScreen.title")).toBe(
      "Quiz de Naturalisation Française",
    );
    expect(i18n.t("startScreen.shortDescription")).toContain("naturalisation");
  });

  it("falls back to base strings for keys the quiz does not override", () => {
    expect(i18n.t("startScreen.buttonStart")).toBe("Commencer le quiz");
    expect(i18n.t("quizScreen.progress")).toBe(
      "Question {{current}} sur {{total}}",
    );
  });
});

import { describe, it, expect } from "vitest";
import { isAnswerCorrect } from "../../utils/quizHelpers";

describe("quizHelpers", () => {
  describe("isAnswerCorrect", () => {
    const mockQuestion = {
      id: "q1",
      question: "Test question",
      answers: [
        { id: "q1-a0", text: "Correct answer", isCorrect: true },
        { id: "q1-a1", text: "Wrong answer 1", isCorrect: false },
        { id: "q1-a2", text: "Wrong answer 2", isCorrect: false },
        { id: "q1-a3", text: "Correct answer 2", isCorrect: true },
      ],
    };

    it("should return true for complete correct answer", () => {
      const result = isAnswerCorrect(mockQuestion, ["q1-a0", "q1-a3"]);
      expect(result).toBe(true);
    });

    it("should return false for partial correct answer", () => {
      const result = isAnswerCorrect(mockQuestion, ["q1-a0"]);
      expect(result).toBe(false);
    });

    it("should return false for no correct answer", () => {
      const result = isAnswerCorrect(mockQuestion, ["q1-a1"]);
      expect(result).toBe(false);
    });

    it("should return false for non-existent answer ID", () => {
      const result = isAnswerCorrect(mockQuestion, ["invalid-id"]);
      expect(result).toBe(false);
    });

    it("should return false for null question", () => {
      const result = isAnswerCorrect(null, ["q1-a0"]);
      expect(result).toBe(false);
    });

    it("should return false for null answer ID", () => {
      const result = isAnswerCorrect(mockQuestion, null);
      expect(result).toBe(false);
    });

    it("should return false for undefined answer ID", () => {
      const result = isAnswerCorrect(mockQuestion, undefined);
      expect(result).toBe(false);
    });

    it("should return false for an empty answer", () => {
      const result = isAnswerCorrect(mockQuestion, []);
      expect(result).toBe(false);
    });
  });
});

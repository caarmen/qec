import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import QuestionCard from "../../components/ui/QuestionCard";

describe("QuestionCard", () => {
  describe("rendering", () => {
    it("should render children", () => {
      render(
        <QuestionCard>
          <p>Test content</p>
        </QuestionCard>,
      );

      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      render(
        <QuestionCard>
          <h2>Title</h2>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </QuestionCard>,
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Paragraph 1")).toBeInTheDocument();
      expect(screen.getByText("Paragraph 2")).toBeInTheDocument();
    });

    it("should render nested components", () => {
      render(
        <QuestionCard>
          <div>
            <span>Nested content</span>
          </div>
        </QuestionCard>,
      );

      expect(screen.getByText("Nested content")).toBeInTheDocument();
    });

    it("should apply base styles", () => {
      const { container } = render(
        <QuestionCard>
          <p>Content</p>
        </QuestionCard>,
      );

      const card = container.firstChild;
      expect(card).toHaveClass("bg-white");
      expect(card).toHaveClass("rounded-xl");
      expect(card).toHaveClass("shadow-sm");
      expect(card).toHaveClass("p-6");
      expect(card).toHaveClass("space-y-6");
    });

    it("should accept additional className", () => {
      const { container } = render(
        <QuestionCard className="custom-class">
          <p>Content</p>
        </QuestionCard>,
      );

      const card = container.firstChild;
      expect(card).toHaveClass("custom-class");
      expect(card).toHaveClass("bg-white"); // Still has base styles
    });

    it("should handle empty children gracefully", () => {
      const { container } = render(<QuestionCard />);

      const card = container.firstChild;
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass("bg-white");
    });

    it("should render as a div element", () => {
      const { container } = render(
        <QuestionCard>
          <p>Content</p>
        </QuestionCard>,
      );

      expect(container.firstChild.tagName).toBe("DIV");
    });
  });

  describe("composition", () => {
    it("should compose with question text and answers", () => {
      render(
        <QuestionCard>
          <h2>What is the capital of France?</h2>
          <button>Paris</button>
          <button>London</button>
          <button>Berlin</button>
        </QuestionCard>,
      );

      expect(
        screen.getByText("What is the capital of France?"),
      ).toBeInTheDocument();
      expect(screen.getByText("Paris")).toBeInTheDocument();
      expect(screen.getByText("London")).toBeInTheDocument();
      expect(screen.getByText("Berlin")).toBeInTheDocument();
    });

    it("should compose with complex children structure", () => {
      render(
        <QuestionCard>
          <div>
            <p>Question 1 of 10</p>
            <h2>Question text</h2>
          </div>
          <div>
            <button>Answer 1</button>
            <button>Answer 2</button>
          </div>
          <div>
            <button>Next</button>
          </div>
        </QuestionCard>,
      );

      expect(screen.getByText("Question 1 of 10")).toBeInTheDocument();
      expect(screen.getByText("Question text")).toBeInTheDocument();
      expect(screen.getByText("Answer 1")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should apply vertical spacing between children", () => {
      const { container } = render(
        <QuestionCard>
          <p>Child 1</p>
          <p>Child 2</p>
        </QuestionCard>,
      );

      const card = container.firstChild;
      expect(card).toHaveClass("space-y-6");
    });

    it("should combine custom className with base classes", () => {
      const { container } = render(
        <QuestionCard className="mt-4 max-w-lg">
          <p>Content</p>
        </QuestionCard>,
      );

      const card = container.firstChild;
      expect(card).toHaveClass("bg-white");
      expect(card).toHaveClass("mt-4");
      expect(card).toHaveClass("max-w-lg");
    });

    it("should maintain consistent styling with different content", () => {
      const { container, rerender } = render(
        <QuestionCard>
          <p>Short content</p>
        </QuestionCard>,
      );

      let card = container.firstChild;
      const originalClasses = card.className;

      rerender(
        <QuestionCard>
          <p>
            This is a much longer piece of content that should still maintain
            the same styling regardless of length
          </p>
        </QuestionCard>,
      );

      card = container.firstChild;
      expect(card.className).toBe(originalClasses);
    });
  });
});

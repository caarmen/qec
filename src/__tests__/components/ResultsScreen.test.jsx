import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResultsScreen from "../../components/ResultsScreen";
import { DIFFICULTY } from "../../hooks/useQuiz";

describe("ResultsScreen", () => {
  const defaultProps = {
    score: 7,
    totalQuestions: 10,
    onRestart: vi.fn(),
  };

  describe("rendering", () => {
    it("should render completion header", () => {
      render(<ResultsScreen {...defaultProps} />);

      expect(
        screen.getByRole("heading", {
          name: /quiz terminé/i,
          level: 2,
        }),
      ).toBeInTheDocument();
    });

    it("should render total questions", () => {
      render(<ResultsScreen {...defaultProps} />);

      expect(screen.getByText(/total de questions :/i)).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("should render correct answers count", () => {
      render(<ResultsScreen {...defaultProps} />);

      expect(screen.getByText(/réponses correctes :/i)).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
    });

    it("should render percentage score", () => {
      render(<ResultsScreen {...defaultProps} />);

      expect(screen.getByText(/score : 70%/i)).toBeInTheDocument();
    });

    it("should render restart button", () => {
      render(<ResultsScreen {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: /recommencer le quiz/i }),
      ).toBeInTheDocument();
    });

    it("should apply correct layout styles", () => {
      const { container } = render(<ResultsScreen {...defaultProps} />);

      const layout = container.firstChild;
      expect(layout).toHaveClass("min-h-screen");
      expect(layout).toHaveClass("bg-gray-50");
      expect(layout).toHaveClass("flex");
      expect(layout).toHaveClass("items-center");
      expect(layout).toHaveClass("justify-center");
    });

    it("should apply correct score card styles", () => {
      const { container } = render(<ResultsScreen {...defaultProps} />);

      const scoreCard = container.querySelector(".bg-gray-50.rounded-lg");
      expect(scoreCard).toHaveClass("p-4");
      expect(scoreCard).toHaveClass("space-y-2");
    });

    it("should style percentage in green", () => {
      render(<ResultsScreen {...defaultProps} />);

      const percentage = screen.getByText(/score : 70%/i);
      expect(percentage).toHaveClass("text-green-600");
      expect(percentage).toHaveClass("font-medium");
    });
  });

  describe("score calculation", () => {
    it("should calculate percentage correctly for perfect score", () => {
      render(
        <ResultsScreen score={10} totalQuestions={10} onRestart={vi.fn()} />,
      );

      expect(screen.getByText(/score : 100%/i)).toBeInTheDocument();
    });

    it("should calculate percentage correctly for zero score", () => {
      render(
        <ResultsScreen score={0} totalQuestions={10} onRestart={vi.fn()} />,
      );

      expect(screen.getByText(/score : 0%/i)).toBeInTheDocument();
    });

    it("should calculate percentage correctly for partial score", () => {
      render(
        <ResultsScreen score={5} totalQuestions={10} onRestart={vi.fn()} />,
      );

      expect(screen.getByText(/score : 50%/i)).toBeInTheDocument();
    });

    it("should round percentage to nearest integer", () => {
      render(
        <ResultsScreen score={1} totalQuestions={3} onRestart={vi.fn()} />,
      );

      // 1/3 = 33.33...% should round to 33%
      expect(screen.getByText(/score : 33%/i)).toBeInTheDocument();
    });

    it("should handle different total questions", () => {
      render(
        <ResultsScreen score={15} totalQuestions={20} onRestart={vi.fn()} />,
      );

      expect(screen.getByText("20")).toBeInTheDocument();
      expect(screen.getByText("15")).toBeInTheDocument();
      expect(screen.getByText(/score : 75%/i)).toBeInTheDocument();
    });

    it("should calculate percentage for single question quiz", () => {
      render(
        <ResultsScreen score={1} totalQuestions={1} onRestart={vi.fn()} />,
      );

      expect(screen.getByText(/score : 100%/i)).toBeInTheDocument();
    });
  });

  describe("interaction", () => {
    it("should call onRestart when button is clicked", async () => {
      const handleRestart = vi.fn();
      const user = userEvent.setup();

      render(<ResultsScreen {...defaultProps} onRestart={handleRestart} />);

      const button = screen.getByRole("button", {
        name: /recommencer le quiz/i,
      });
      await user.click(button);

      expect(handleRestart).toHaveBeenCalledTimes(1);
    });

    it("should be keyboard accessible", async () => {
      const handleRestart = vi.fn();
      const user = userEvent.setup();

      render(<ResultsScreen {...defaultProps} onRestart={handleRestart} />);

      const button = screen.getByRole("button", {
        name: /recommencer le quiz/i,
      });
      button.focus();

      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");

      expect(handleRestart).toHaveBeenCalledTimes(1);
    });

    it("should allow multiple restarts", async () => {
      const handleRestart = vi.fn();
      const user = userEvent.setup();

      render(<ResultsScreen {...defaultProps} onRestart={handleRestart} />);

      const button = screen.getByRole("button", {
        name: /recommencer le quiz/i,
      });

      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleRestart).toHaveBeenCalledTimes(3);
    });
  });

  describe("accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(<ResultsScreen {...defaultProps} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it("should have enabled restart button", () => {
      render(<ResultsScreen {...defaultProps} />);

      const button = screen.getByRole("button", {
        name: /recommencer le quiz/i,
      });
      expect(button).not.toBeDisabled();
    });

    it("should have descriptive button text", () => {
      render(<ResultsScreen {...defaultProps} />);

      const button = screen.getByRole("button", {
        name: /recommencer le quiz/i,
      });
      expect(button).toHaveTextContent("Recommencer le Quiz");
    });
  });

  describe("content variations", () => {
    it("should display low score results", () => {
      render(
        <ResultsScreen score={2} totalQuestions={10} onRestart={vi.fn()} />,
      );

      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText(/score : 20%/i)).toBeInTheDocument();
    });

    it("should display high score results", () => {
      render(
        <ResultsScreen score={9} totalQuestions={10} onRestart={vi.fn()} />,
      );

      expect(screen.getByText("9")).toBeInTheDocument();
      expect(screen.getByText(/score : 90%/i)).toBeInTheDocument();
    });

    it("should display results for different quiz lengths", () => {
      render(
        <ResultsScreen score={4} totalQuestions={5} onRestart={vi.fn()} />,
      );

      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText(/score : 80%/i)).toBeInTheDocument();
    });

    it("should display difficult mode", () => {
      render(
        <ResultsScreen
          score={32}
          totalQuestions={40}
          difficulty={DIFFICULTY.DIFFICULT}
          onRestart={vi.fn()}
        />,
      );
      expect(screen.getByText("Mode : Difficile")).toBeInTheDocument();
    });
    it("should display normal mode", () => {
      render(
        <ResultsScreen
          score={32}
          totalQuestions={40}
          difficulty={DIFFICULTY.NORMAL}
          onRestart={vi.fn()}
        />,
      );
      expect(screen.getByText("Mode : Normal")).toBeInTheDocument();
    });
  });

  describe("visual presentation", () => {
    it("should display score information in organized card", () => {
      const { container } = render(<ResultsScreen {...defaultProps} />);

      const scoreCard = container.querySelector(".bg-gray-50.rounded-lg");
      expect(scoreCard).toBeInTheDocument();

      // Should contain all score information
      expect(scoreCard).toHaveTextContent(/mode : /i);
      expect(scoreCard).toHaveTextContent(/total de questions/i);
      expect(scoreCard).toHaveTextContent(/réponses correctes/i);
      expect(scoreCard).toHaveTextContent(/score/i);
    });

    it("should emphasize percentage score", () => {
      render(<ResultsScreen {...defaultProps} />);

      const percentage = screen.getByText(/score : 70%/i);
      expect(percentage).toHaveClass("text-lg");
      expect(percentage).toHaveClass("font-medium");
    });
  });

  describe("layout", () => {
    it("should center content on screen", () => {
      const { container } = render(<ResultsScreen {...defaultProps} />);

      const layout = container.firstChild;
      expect(layout).toHaveClass("items-center");
      expect(layout).toHaveClass("justify-center");
    });

    it("should have responsive padding", () => {
      const { container } = render(<ResultsScreen {...defaultProps} />);

      const layout = container.firstChild;
      expect(layout).toHaveClass("px-4");
    });

    it("should limit card width for readability", () => {
      const { container } = render(<ResultsScreen {...defaultProps} />);

      const card = container.querySelector(".bg-white");
      expect(card).toHaveClass("w-full");
      expect(card).toHaveClass("max-w-md");
    });
  });
});

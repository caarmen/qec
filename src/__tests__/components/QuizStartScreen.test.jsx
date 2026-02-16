import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuizStartScreen from "../../components/QuizStartScreen";

const baseProps = {
  totalQuestions: 50,
  selectedQuestionCount: null,
  onSelectQuestionCount: vi.fn(),
  onStart: vi.fn(),
};

describe("QuizStartScreen", () => {
  it("renders title, segmented control, and start button", () => {
    render(<QuizStartScreen {...baseProps} />);

    expect(
      screen.getByRole("heading", {
        name: /quiz de naturalisation française/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/nombre de questions/i)).toBeInTheDocument();
    expect(screen.getByText(/choisissez la durée/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /commencer le quiz/i }),
    ).toBeInTheDocument();
  });

  it("shows available question count options based on total questions", async () => {
    const user = userEvent.setup();
    render(<QuizStartScreen {...baseProps} totalQuestions={50} />);

    const questionCountButton = screen.getByRole("button", { name: "40" });
    await user.click(questionCountButton);

    expect(screen.getByRole("option", { name: "10" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "20" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "40" })).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "80" }),
    ).not.toBeInTheDocument();
  });

  it("defaults to 40 when available and no selection is provided", async () => {
    const user = userEvent.setup();
    render(<QuizStartScreen {...baseProps} totalQuestions={50} />);

    const questionCountButton = screen.getByRole("button", { name: "40" });
    expect(questionCountButton.textContent).toEqual("40");
    await user.click(questionCountButton);

    const option40 = screen.getByRole("option", { name: "40" });
    expect(option40).toHaveAttribute("aria-selected", "true");
  });

  it("uses provided selectedQuestionCount when set", async () => {
    const user = userEvent.setup();
    render(
      <QuizStartScreen
        {...baseProps}
        totalQuestions={50}
        selectedQuestionCount={20}
      />,
    );

    const questionCountButton = screen.getByRole("button", { name: "20" });
    expect(questionCountButton.textContent).toEqual("20");
    await user.click(questionCountButton);

    const option20 = screen.getByRole("option", { name: "20" });
    expect(option20).toHaveAttribute("aria-selected", "true");
  });

  it("calls onSelectQuestionCount when an option is selected", async () => {
    const user = userEvent.setup();
    const onSelectQuestionCount = vi.fn();

    render(
      <QuizStartScreen
        {...baseProps}
        onSelectQuestionCount={onSelectQuestionCount}
      />,
    );

    const questionCountButton = screen.getByRole("button", { name: "40" });
    await user.click(questionCountButton);

    const option20 = screen.getByRole("option", { name: "20" });
    await user.click(option20);

    expect(onSelectQuestionCount).toHaveBeenCalledTimes(1);
    expect(onSelectQuestionCount).toHaveBeenCalledWith(20);
  });

  it("calls onStart when the start button is clicked", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();

    render(<QuizStartScreen {...baseProps} onStart={onStart} />);

    const startButton = screen.getByRole("button", {
      name: /commencer le quiz/i,
    });
    await user.click(startButton);

    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("disables start button when no effective value exists", () => {
    render(<QuizStartScreen {...baseProps} totalQuestions={5} />);

    const startButton = screen.getByRole("button", {
      name: /commencer le quiz/i,
    });
    expect(startButton).toBeDisabled();
  });
});

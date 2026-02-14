import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../App";

describe("Quiz Flow Integration", () => {
  it("should complete full quiz flow from start to finish", async () => {
    const user = userEvent.setup();

    render(<App />);

    // 1. QUIZ SETUP SCREEN
    expect(
      screen.getByRole("heading", {
        name: /quiz de naturalisation française/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/nombre de questions/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /commencer le quiz/i }),
    ).toBeInTheDocument();

    // Start the quiz
    await user.click(
      screen.getByRole("button", { name: /commencer le quiz/i }),
    );

    // 2. QUIZ SCREEN - First Question
    expect(screen.getByText(/question 1 sur 40/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();

    // Submit button should be disabled initially
    const submitButton = screen.getByRole("button", { name: /soumettre/i });
    expect(submitButton).toBeDisabled();

    // Select an answer
    const answerOptions = screen.getAllByRole("radio");
    expect(answerOptions.length).toBeGreaterThan(0);

    await user.click(answerOptions[0]);

    // Submit button should now be enabled
    expect(submitButton).not.toBeDisabled();

    // Submit answer
    await user.click(submitButton);

    // Go to next question
    const nextButton = screen.getByRole("button", { name: /suivant/i });
    await user.click(nextButton);

    // 3. QUIZ SCREEN - Second Question
    expect(screen.getByText(/question 2 sur 40/i)).toBeInTheDocument();

    // Answer all remaining questions (questions 2-40)
    for (let i = 2; i <= 40; i++) {
      const answers = screen.getAllByRole("radio");
      await user.click(answers[0]);

      const submit = screen.getByRole("button", { name: /soumettre/i });
      await user.click(submit);

      const next = screen.getByRole("button", { name: /suivant/i });
      await user.click(next);
    }

    // 4. RESULTS SCREEN
    expect(
      screen.getByRole("heading", { name: /quiz terminé/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/total de questions :/i)).toBeInTheDocument();
    expect(screen.getByText(/réponses correctes :/i)).toBeInTheDocument();
    expect(screen.getByText(/score :/i)).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument(); // Total questions

    // Should have restart button
    expect(
      screen.getByRole("button", { name: /recommencer le quiz/i }),
    ).toBeInTheDocument();
  });

  it("should allow selecting question count before starting the quiz", async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /quiz de naturalisation française/i,
      }),
    ).toBeInTheDocument();

    const option10 = screen.getByRole("radio", { name: "10" });
    const option20 = screen.getByRole("radio", { name: "20" });
    const option40 = screen.getByRole("radio", { name: "40" });
    const option80 = screen.getByRole("radio", { name: "80" });

    expect(option10).toBeInTheDocument();
    expect(option20).toBeInTheDocument();
    expect(option40).toBeInTheDocument();
    expect(option80).toBeInTheDocument();
    expect(option40).toHaveAttribute("aria-checked", "true");

    await user.click(option20);
    expect(option20).toHaveAttribute("aria-checked", "true");

    await user.click(
      screen.getByRole("button", { name: /commencer le quiz/i }),
    );

    expect(screen.getByText(/question 1 sur 20/i)).toBeInTheDocument();
  });

  it("should allow restarting quiz after completion", async () => {
    const user = userEvent.setup();

    render(<App />);

    // Start quiz
    await user.click(
      screen.getByRole("button", { name: /commencer le quiz/i }),
    );

    // Answer all 10 questions
    for (let i = 1; i <= 40; i++) {
      const answers = screen.getAllByRole("radio");
      await user.click(answers[0]);
      await user.click(screen.getByRole("button", { name: /soumettre/i }));
      await user.click(screen.getByRole("button", { name: /suivant/i }));
    }

    // Should be on results screen
    expect(
      screen.getByRole("heading", { name: /quiz terminé/i }),
    ).toBeInTheDocument();

    // Restart quiz
    await user.click(
      screen.getByRole("button", { name: /recommencer le quiz/i }),
    );

    // Should be back at setup screen
    expect(
      screen.getByRole("heading", {
        name: /quiz de naturalisation française/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /commencer le quiz/i }),
    ).toBeInTheDocument();
  });

  it("should return to setup screen after restart", async () => {
    const user = userEvent.setup();

    render(<App />);

    // Start quiz
    await user.click(
      screen.getByRole("button", { name: /commencer le quiz/i }),
    );

    // Answer all 40 questions (default)
    for (let i = 1; i <= 40; i++) {
      const answers = screen.getAllByRole("radio");
      await user.click(answers[0]);
      await user.click(screen.getByRole("button", { name: /soumettre/i }));
      await user.click(screen.getByRole("button", { name: /suivant/i }));
    }

    // Restart from results
    await user.click(
      screen.getByRole("button", { name: /recommencer le quiz/i }),
    );

    // Should be back at setup screen
    expect(
      screen.getByRole("heading", {
        name: /quiz de naturalisation française/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/nombre de questions/i)).toBeInTheDocument();
  });

  it("should track score correctly with mixed answers", async () => {
    const user = userEvent.setup();

    render(<App />);

    // Start quiz
    await user.click(
      screen.getByRole("button", { name: /commencer le quiz/i }),
    );

    // Answer questions - tracking correct vs wrong
    for (let i = 1; i <= 40; i++) {
      const answers = screen.getAllByRole("radio");

      // For testing: select first answer for questions 1-5 (may be correct or wrong)
      // select second answer for questions 6-10 (may be correct or wrong)
      const answerIndex = i <= 5 ? 0 : 1;
      await user.click(answers[answerIndex]);
      await user.click(screen.getByRole("button", { name: /soumettre/i }));
      await user.click(screen.getByRole("button", { name: /suivant/i }));
    }

    // Should be on results screen with some score
    expect(
      screen.getByRole("heading", { name: /quiz terminé/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/score :/i)).toBeInTheDocument();

    // Score should be between 0 and 100%
    const scoreText = screen.getByText(/score : \d+%/i).textContent;
    const scoreMatch = scoreText.match(/(\d+)%/);
    expect(scoreMatch).toBeTruthy();

    const score = parseInt(scoreMatch[1]);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("should prevent skipping questions without selecting answer", async () => {
    const user = userEvent.setup();

    render(<App />);

    // Start quiz
    await user.click(
      screen.getByRole("button", { name: /commencer le quiz/i }),
    );

    // Submit button should be disabled
    const submitButton = screen.getByRole("button", { name: /soumettre/i });
    expect(submitButton).toBeDisabled();

    // Try to click disabled button (should not progress)
    await user.click(submitButton);

    // Should still be on question 1
    expect(screen.getByText(/question 1 sur 40/i)).toBeInTheDocument();
  });

  it("should allow changing answer before submitting", async () => {
    const user = userEvent.setup();

    render(<App />);

    // Start quiz
    await user.click(
      screen.getByRole("button", { name: /commencer le quiz/i }),
    );

    const answers = screen.getAllByRole("radio");

    // Select first answer
    await user.click(answers[0]);
    expect(answers[0]).toHaveAttribute("aria-checked", "true");

    // Change to second answer
    await user.click(answers[1]);
    expect(answers[1]).toHaveAttribute("aria-checked", "true");
    expect(answers[0]).toHaveAttribute("aria-checked", "false");

    // Submit should work with changed answer
    const submitButton = screen.getByRole("button", { name: /soumettre/i });
    expect(submitButton).not.toBeDisabled();
    await user.click(submitButton);

    // Should progress to next question
    const nextButton = screen.getByRole("button", { name: /suivant/i });
    expect(nextButton).not.toBeDisabled();
    await user.click(nextButton);
    expect(screen.getByText(/question 2 sur 40/i)).toBeInTheDocument();
  });

  it("should reset state completely on restart", async () => {
    const user = userEvent.setup();

    render(<App />);

    // Start first quiz
    await user.click(
      screen.getByRole("button", { name: /commencer le quiz/i }),
    );

    // Answer 3 questions
    for (let i = 1; i <= 3; i++) {
      const answers = screen.getAllByRole("radio");
      await user.click(answers[0]);
      await user.click(screen.getByRole("button", { name: /soumettre/i }));
      await user.click(screen.getByRole("button", { name: /suivant/i }));
    }

    // Should be on question 4
    expect(screen.getByText(/question 4 sur 40/i)).toBeInTheDocument();

    // Complete remaining questions to reach results
    for (let i = 4; i <= 40; i++) {
      const answers = screen.getAllByRole("radio");
      await user.click(answers[0]);
      await user.click(screen.getByRole("button", { name: /soumettre/i }));
      await user.click(screen.getByRole("button", { name: /suivant/i }));
    }

    // Restart from results
    await user.click(
      screen.getByRole("button", { name: /recommencer le quiz/i }),
    );

    // Should be back at setup screen (state fully reset)
    expect(
      screen.getByRole("heading", {
        name: /quiz de naturalisation française/i,
      }),
    ).toBeInTheDocument();

    // Start new quiz
    await user.click(
      screen.getByRole("button", { name: /commencer le quiz/i }),
    );

    // Should start fresh at question 1
    expect(screen.getByText(/question 1 sur 40/i)).toBeInTheDocument();

    // Submit button should be disabled (no answer selected from previous attempt)
    expect(screen.getByRole("button", { name: /soumettre/i })).toBeDisabled();
  });
});

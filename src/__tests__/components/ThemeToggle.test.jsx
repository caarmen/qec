import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "../../components/ui/ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.removeItem("qec-theme");
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "";
  });

  afterEach(() => {
    localStorage.removeItem("qec-theme");
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "";
  });

  it("defaults to light theme and shows the dark-mode action", () => {
    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: /activer le mode sombre/i }),
    ).toBeInTheDocument();
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("toggles to dark mode: applies the class and persists the choice", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(
      screen.getByRole("button", { name: /activer le mode sombre/i }),
    );

    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(localStorage.getItem("qec-theme")).toBe("dark");
    expect(
      screen.getByRole("button", { name: /activer le mode clair/i }),
    ).toBeInTheDocument();
  });

  it("toggles back to light mode and persists the choice", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(
      screen.getByRole("button", { name: /activer le mode sombre/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /activer le mode clair/i }),
    );

    expect(document.documentElement).not.toHaveClass("dark");
    expect(document.documentElement.style.colorScheme).toBe("light");
    expect(localStorage.getItem("qec-theme")).toBe("light");
  });

  it("initializes from the persisted dark theme without a system lookup", () => {
    localStorage.setItem("qec-theme", "dark");

    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: /activer le mode clair/i }),
    ).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("dark");
  });

  it("falls back to light theme for an invalid persisted value", () => {
    localStorage.setItem("qec-theme", "blue");

    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: /activer le mode sombre/i }),
    ).toBeInTheDocument();
    expect(document.documentElement).not.toHaveClass("dark");
  });
});

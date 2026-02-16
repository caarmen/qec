import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DropdownOption from "../../components/ui/DropdownOption";

describe("DropdownOption", () => {
  const defaultProps = {
    value: 20,
    label: "20",
    isSelected: false,
    onSelect: vi.fn(),
    onKeyDown: vi.fn(),
  };

  describe("rendering", () => {
    it("should render label and option role", () => {
      render(<DropdownOption {...defaultProps} />);

      const option = screen.getByRole("option", { name: "20" });
      expect(option).toBeInTheDocument();
    });

    it("should render as selected when isSelected is true", () => {
      render(<DropdownOption {...defaultProps} isSelected />);

      const option = screen.getByRole("option");
      expect(option).toHaveAttribute("aria-selected", "true");
      expect(option).toHaveAttribute("tabindex", "0");
      expect(option).toHaveClass("bg-blue-50");
      expect(option).toHaveClass("text-blue-700");
    });
  });

  describe("interaction", () => {
    it("should call onSelect with value when clicked", async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();

      render(<DropdownOption {...defaultProps} onSelect={handleSelect} />);

      const option = screen.getByRole("option");
      await user.click(option);

      expect(handleSelect).toHaveBeenCalledTimes(1);
      expect(handleSelect).toHaveBeenCalledWith();
    });

    it("should forward onKeyDown handler", async () => {
      const handleKeyDown = vi.fn();
      const user = userEvent.setup();

      render(<DropdownOption {...defaultProps} onKeyDown={handleKeyDown} />);

      const option = screen.getByRole("option");
      option.focus();
      await user.keyboard("{ArrowRight}");

      expect(handleKeyDown).toHaveBeenCalled();
    });
  });
});

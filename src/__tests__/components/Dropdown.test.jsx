import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import Dropdown from "../../components/ui/Dropdown";

const defaultOptions = [
  { value: "dog", label: "Chien" },
  { value: "cat", label: "Chat" },
  { value: "puppy", label: "Chiot" },
  { value: "tiger", label: "Tigre" },
];

function ControlledDropdown({
  initialValue = "puppy",
  options = defaultOptions,
  onChange = () => {},
}) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (nextValue) => {
    setValue(nextValue);
    onChange(nextValue);
  };

  return (
    <Dropdown
      label="Choisir un animal"
      helperText="Choisir votre animal favori"
      options={options}
      value={value}
      onChange={handleChange}
    />
  );
}

describe("Dropdown", () => {
  describe("rendering", () => {
    it("should render label, helper text, and options", async () => {
      const user = userEvent.setup();
      render(<ControlledDropdown />);

      expect(
        screen.getByText("Choisir votre animal favori"),
      ).toBeInTheDocument();
      const chooseAnimalButton = screen.getByRole("button", { name: "Chiot" });
      await user.click(chooseAnimalButton);

      const listBox = screen.getByRole("listbox");
      expect(listBox).toBeInTheDocument();

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(4);
      const selectedOption = screen.getByRole("option", { name: "Chiot" });
      expect(selectedOption).toHaveAttribute("aria-selected", "true");
      expect(selectedOption).toHaveFocus();
    });
  });

  describe("interaction", () => {
    it("should call onChange and update selection when clicked", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<ControlledDropdown onChange={handleChange} />);

      const chooseAnimalButton = screen.getByRole("button", { name: "Chiot" });
      await user.click(chooseAnimalButton);

      const option = screen.getByRole("option", { name: "Chien" });
      await user.click(option);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith("dog");
      expect(option).toHaveAttribute("aria-selected", "true");
    });
  });
});

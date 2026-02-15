import { useId, useRef, useState, useEffect } from "react";
import DropdownOption from "./DropdownOption";

/**
 * Dropdown component - Accessible dropdown for selection of options in a list.
 * @param {Object} props - Component props
 * @param {string} props.label - Visible label for the control
 * @param {string} [props.helperText] - Optional helper text shown under label
 * @param {Array<{value: string|number, label: string }>} props.options - Options to render
 * @param {string|number} props.value - Currently selected value
 * @param {Function} props.onChange - Called with selected value
 * @returns {JSX.Element} Dropdown component
 */
function Dropdown({ label, helperText, options, value, onChange }) {
  const groupId = useId();
  const optionRefs = useRef([]);
  const labelId = `${groupId}-label`;
  const helperId = `${groupId}-helper`;
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === value);
  const selectedOptionIndex = options.findIndex((o) => o.value === value);
  const [focusedIndex, setFocusedIndex] = useState(selectedOptionIndex);
  const buttonRef = useRef(null);

  // Focus on the selected item when opening the dropdown.
  useEffect(() => {
    if (open) {
      const indexToFocus = selectedOptionIndex >= 0 ? selectedOptionIndex : 0;
      optionRefs.current?.[indexToFocus].focus();
    }
  }, [open, selectedOptionIndex]);

  useEffect(() => {
    if (focusedIndex >= 0) optionRefs.current?.[focusedIndex].focus();
  }, [focusedIndex]);

  const onItemSelected = (optionIndex) => {
    setOpen(false);
    setFocusedIndex(optionIndex);
    onChange(options[optionIndex].value);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        setFocusedIndex((previous) => (previous + 1) % options.length);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        setFocusedIndex(
          (previous) => (previous - 1 + options.length) % options.length,
        );
        break;
      case "Home":
        event.preventDefault();
        setFocusedIndex(0);
        break;
      case "End":
        event.preventDefault();
        setFocusedIndex(options.length - 1);
        break;
      case "Enter":
        event.preventDefault();
        onItemSelected(focusedIndex);
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      default:
        return;
    }
  };

  return (
    <section className={"relative space-y-2"}>
      <div className="space-y-1">
        <label id={labelId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {helperText && (
          <p id={helperId} className="text-xs text-gray-500">
            {helperText}
          </p>
        )}
      </div>
      <button
        ref={buttonRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-describedby={
          /* Use describedby and not labelledby. The screen reader should read the 
          selected value for this element (ex: 40).
          The description is a text describing the purpose
          of this dropdown (ex: Choissisez la durée de votre session.
          If we use labelledby, the user would be required to open the dropdown for
          the screenreader to read the currently selected value.
           */
          labelId
        }
        onClick={() => setOpen((o) => !o)}
        className="
          flex w-full px-4 py-3 items-center justify-between text-left
          rounded-lg
          border border-gray-300
          bg-white
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      >
        {selectedOption?.label ?? ""}
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          {/* Chevron icon */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <ul
        hidden={!open}
        role="listbox"
        aria-labelledby={labelId}
        className="
            absolute overflow-hidden mt-2 w-full z-10
            rounded-lg
            border border-gray-200
            bg-white shadow-lg
          "
      >
        {options.map((option, index) => {
          return (
            <DropdownOption
              key={option.value}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              value={option.value}
              label={option.label}
              isSelected={value === option.value}
              isFocused={index === focusedIndex}
              onSelect={() => onItemSelected(index)}
              onKeyDown={(event) => handleKeyDown(event)}
            />
          );
        })}
      </ul>
    </section>
  );
}

export default Dropdown;

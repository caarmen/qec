import { forwardRef } from "react";

/**
 * DropdownOption component - Single option within a Dropdown
 * @param {Object} props - Component props
 * @param {string} props.label - Visible label
 * @param {boolean} props.isSelected - Whether option is selected
 * @param {boolean} props.isFocused - Whether option is focused
 * @param {Function} props.onKeyDown - Keydown handler for keyboard navigation
 * @param {Function} props.onSelect - Callback when option is selected
 * @returns {JSX.Element} DropdownOption component
 */
const DropdownOption = forwardRef(function DropdownOption(
  { label, isSelected, isFocused, onSelect, onKeyDown },
  ref,
) {
  const baseClasses =
    "py-2 px-2 cursor-pointer text-sm font-medium transition-colors focus:outline-hidden focus:ring-2 focus:ring-primary-500";
  const selectedClasses =
    "bg-primary-50 text-primary-700 font-medium dark:bg-primary-900 dark:text-primary-300";
  const unselectedClasses = "hover:bg-gray-100 dark:hover:bg-gray-700";
  const focusedClasses = "bg-primary-100 dark:bg-primary-900";

  return (
    <li
      ref={ref}
      role="option"
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses} ${isFocused ? focusedClasses : ""}`}
      onClick={() => onSelect()}
      onKeyDown={onKeyDown}
    >
      {label}
    </li>
  );
});

DropdownOption.displayName = "DropdownOption";

export default DropdownOption;

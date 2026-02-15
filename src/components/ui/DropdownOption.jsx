/**
 * DropdownOption component - Single option within a Dropdown
 * @param {Object} props - Component props
 * @param {string} props.label - Visible label
 * @param {boolean} props.isSelected - Whether option is selected
 * @param {Function} props.onSelect - Callback when option is selected
 * @returns {JSX.Element} DropdownOption component
 */
const DropdownOption = function DropdownOption({
  label,
  isSelected,
  onSelect,
}) {
  const baseClasses =
    "py-2 px-2 cursor-pointer text-sm font-medium transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-500";
  const selectedClasses = "bg-blue-50 text-blue-700 font-medium";
  const unselectedClasses = "hover:bg-gray-100";

  return (
    <li
      role="option"
      aria-selected={isSelected}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
      onClick={() => onSelect()}
    >
      {label}
    </li>
  );
};

DropdownOption.displayName = "DropdownOption";

export default DropdownOption;

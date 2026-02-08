import { memo, forwardRef } from 'react'

/**
 * SegmentedControlOption component - Single option within a SegmentedControl
 * @param {Object} props - Component props
 * @param {string|number} props.value - Option value
 * @param {string} props.label - Visible label
 * @param {boolean} [props.isSelected=false] - Whether option is selected
 * @param {boolean} [props.disabled=false] - Whether option is disabled
 * @param {Function} [props.onSelect] - Callback when option is selected
 * @param {Function} [props.onKeyDown] - Keydown handler for keyboard navigation
 * @param {string} [props.className=''] - Additional classes
 * @returns {JSX.Element} SegmentedControlOption component
 */
const SegmentedControlOption = memo(forwardRef(function SegmentedControlOption(
  {
    value,
    label,
    isSelected = false,
    disabled = false,
    onSelect,
    onKeyDown,
    className = ''
  },
  ref
) {
  const baseClasses = 'py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'
  const selectedClasses = 'bg-blue-600 text-white font-semibold'
  const unselectedClasses = 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
  const disabledClasses = 'bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200'

  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={isSelected}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      className={`${baseClasses} ${disabled ? disabledClasses : isSelected ? selectedClasses : unselectedClasses} ${className}`}
      onClick={() => {
        if (!disabled) {
          onSelect?.(value)
        }
      }}
      onKeyDown={onKeyDown}
    >
      {label}
    </button>
  )
}))

SegmentedControlOption.displayName = 'SegmentedControlOption'

export default SegmentedControlOption

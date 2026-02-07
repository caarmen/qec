import { memo, useId, useRef } from 'react'
import SegmentedControlOption from './SegmentedControlOption'

const GRID_COLS_CLASS = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6'
}

/**
 * SegmentedControl component - Accessible radio-group styled as segmented buttons
 * @param {Object} props - Component props
 * @param {string} props.label - Visible label for the control
 * @param {string} [props.helperText] - Optional helper text shown under label
 * @param {Array<{value: string|number, label: string, disabled?: boolean}>} props.options - Segments to render
 * @param {string|number} props.value - Currently selected value
 * @param {Function} props.onChange - Called with selected value
 * @param {string} [props.className=''] - Additional container classes
 * @returns {JSX.Element} SegmentedControl component
 */
function SegmentedControl({
  label,
  helperText,
  options,
  value,
  onChange,
  className = ''
}) {
  const groupId = useId()
  const optionRefs = useRef([])
  const labelId = `${groupId}-label`
  const helperId = `${groupId}-helper`

  const gridColsClass = GRID_COLS_CLASS[options.length] || GRID_COLS_CLASS[4]

  const handleKeyDown = (event, optionIndex) => {
    const lastIndex = options.length - 1
    let nextIndex = optionIndex

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        nextIndex = optionIndex === lastIndex ? 0 : optionIndex + 1
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        nextIndex = optionIndex === 0 ? lastIndex : optionIndex - 1
        break
      case 'Home':
        event.preventDefault()
        nextIndex = 0
        break
      case 'End':
        event.preventDefault()
        nextIndex = lastIndex
        break
      default:
        return
    }

    const nextOption = options[nextIndex]
    if (!nextOption || nextOption.disabled) {
      return
    }

    onChange(nextOption.value)
    optionRefs.current[nextIndex]?.focus()
  }

  return (
    <section className={`space-y-2 ${className}`}>
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
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={helperText ? helperId : undefined}
        className={`grid ${gridColsClass} gap-2`}
      >
        {options.map((option, index) => {
          const isSelected = option.value === value
          const isDisabled = Boolean(option.disabled)

          return (
            <SegmentedControlOption
              key={`${option.value}-${index}`}
              ref={(node) => {
                optionRefs.current[index] = node
              }}
              value={option.value}
              label={option.label}
              isSelected={isSelected}
              disabled={isDisabled}
              onSelect={onChange}
              onKeyDown={(event) => handleKeyDown(event, index)}
            />
          )
        })}
      </div>
    </section>
  )
}

export default memo(SegmentedControl)

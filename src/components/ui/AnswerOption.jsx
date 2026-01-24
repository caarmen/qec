function AnswerOption({ 
  id,
  text, 
  isSelected = false, 
  onSelect,
  disabled = false 
}) {
  const baseStyles = 'w-full text-left border rounded-lg p-4 transition-colors cursor-pointer'
  const defaultStyles = 'border-gray-200 hover:bg-gray-50'
  const selectedStyles = 'border-blue-600 bg-blue-50'
  const disabledStyles = 'opacity-50 cursor-not-allowed'

  const handleClick = () => {
    if (!disabled && onSelect) {
      onSelect(id)
    }
  }

  const handleKeyDown = (e) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      if (onSelect) {
        onSelect(id)
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${isSelected ? selectedStyles : defaultStyles}
        ${disabled ? disabledStyles : ''}
      `.trim()}
      aria-pressed={isSelected}
      role="radio"
      aria-checked={isSelected}
    >
      {text}
    </button>
  )
}

export default AnswerOption
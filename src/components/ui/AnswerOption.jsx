import { memo } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * AnswerOption component - Individual answer choice in quiz
 * @param {Object} props - Component props
 * @param {string} props.id - Unique identifier for this answer
 * @param {string} props.text - Answer text to display
 * @param {boolean} [props.isSelected=false] - Whether this answer is currently selected
 * @param {Function} [props.onSelect] - Callback when answer is selected, receives id
 * @param {boolean} [props.disabled=false] - Whether answer option is disabled
 * @param {"correct"|"incorrect"} [props.feedback=undefined] - Whether the answer is correct or incorrect
 * @returns {JSX.Element} AnswerOption component
 */
function AnswerOption({ 
  id,
  text, 
  role,
  isSelected = false, 
  onSelect,
  disabled = false,
  feedback = undefined

}) {
  const { t } = useTranslation()
  const baseStyles = 'w-full text-left border rounded-lg p-4 transition-colors cursor-pointer'
  const defaultStyles = 'border-gray-200 hover:bg-gray-50'
  const selectedStyles = 'border-blue-600 bg-blue-50'
  const correctStyles = 'border-green-600 bg-green-50'
  const incorrectStyles = 'border-red-600 bg-red-50'
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
        ${feedback === 'correct' ? correctStyles : ''}
        ${feedback === 'incorrect' ? incorrectStyles : ''}
      `.trim()}
      role={role}
      aria-checked={isSelected}
    >
      <span className="flex items-center gap-3 w-full">

        {role === "checkbox" && (
          <span
            aria-hidden
            className={`w-4 h-4 rounded-sm flex items-center justify-center ${
              isSelected ? "bg-blue-500 text-white" : "border-solid border-2"
            }`}
          >
            {isSelected ? "✓" : ""}
          </span>
        )}

        <span className="flex-1">{text}</span>

        {feedback === "correct" && (
          <span
            className="ml-2 text-green-600"
            aria-label={t("a11yCorrectAnswer")}
          >
            ✔
          </span>
        )}

        {feedback === "incorrect" && (
          <span
            className="ml-2 text-red-600"
            aria-label={t("a11yIncorrectAnswer")}
          >
            ✖
          </span>
        )}
      </span>
    </button>
  )
}

export default memo(AnswerOption)
import { useEffect, useMemo, useRef } from 'react'
import Button from './ui/Button'
import SegmentedControl from './ui/SegmentedControl'
import { getAvailableQuestionCountOptions } from '../utils/questionCountOptions'

/**
 * QuizStartScreen component - Landing screen with quiz configuration
 * @param {Object} props - Component props
 * @param {number} props.totalQuestions - Total questions available in the pool
 * @param {number|null} props.selectedQuestionCount - Selected question count
 * @param {Function} props.onSelectQuestionCount - Callback when selecting question count
 * @param {Function} props.onStart - Callback when starting the quiz
 * @returns {JSX.Element} QuizStartScreen component
 */
function QuizStartScreen({
  totalQuestions,
  selectedQuestionCount,
  onSelectQuestionCount,
  onStart
}) {
  /* Focus on the top of the screen when entering it, for a11y */
  const headingRef = useRef(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  const { options, defaultValue } = useMemo(
    () => getAvailableQuestionCountOptions(totalQuestions),
    [totalQuestions]
  )

  const optionItems = useMemo(
    () => options.map((value) => ({ value, label: String(value) })),
    [options]
  )

  const effectiveValue = selectedQuestionCount ?? defaultValue

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 space-y-8">
        <div className="space-y-3">
          <h1
            tabIndex={-1}
            ref={headingRef}
            className="text-2xl font-semibold text-gray-900"
          >
            Quiz de Naturalisation Française
          </h1>
          <p className="text-gray-600">
            Testez vos connaissances civiques et évaluez votre préparation pour la naturalisation française.
          </p>
        </div>

        <SegmentedControl
          label="Nombre de questions"
          helperText="Choisissez la durée de votre session"
          options={optionItems}
          value={effectiveValue}
          onChange={onSelectQuestionCount}
        />

        <Button onClick={onStart} disabled={!effectiveValue}>
          Commencer le quiz
        </Button>
      </div>
    </div>
  )
}

export default QuizStartScreen

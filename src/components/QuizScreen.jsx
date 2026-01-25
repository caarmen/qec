import QuestionCard from './ui/QuestionCard'
import AnswerOption from './ui/AnswerOption'
import Button from './ui/Button'

/**
 * QuizScreen component - Main quiz interface for answering questions
 * @param {Object} props - Component props
 * @param {Object} props.currentQuestion - Current question object with id, question, answers
 * @param {number} props.currentQuestionIndex - Index of current question (0-based)
 * @param {number} props.totalQuestions - Total number of questions in quiz
 * @param {string|null} props.selectedAnswer - ID of currently selected answer
 * @param {Function} props.onSelectAnswer - Callback when user selects an answer
 * @param {Function} props.onSubmitAnswer - Callback when user submits answer
 * @param {Function} props.onGoToNextQuestion - Callback when user wants to go to the next question
 * @param {boolean} props.hasAnswerSelected - Whether an answer has been selected
 * @param {boolean} props.hasAnswerSubmitted - Whether an answer has been submitted
 * @returns {JSX.Element|null} QuizScreen component or null if no question
 */
function QuizScreen({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  onSubmitAnswer,
  onGoToNextQuestion,
  hasAnswerSelected,
  hasAnswerSubmitted,
}) {
  if (!currentQuestion) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <QuestionCard className="w-full max-w-md">
        {/* Progress indicator */}
        <p className="text-sm text-gray-600">
          Question {currentQuestionIndex + 1} sur {totalQuestions}
        </p>

        {/* Question text */}
        <h2 className="text-xl font-medium text-gray-900">
          {currentQuestion.question}
        </h2>

        {/* Answer options */}
        <div className="space-y-3">
          {currentQuestion.answers.map((answer) => {

            let feedback = '';
            if (hasAnswerSubmitted) {
              if (answer.isCorrect) {
                feedback = "correct"
              } else if (selectedAnswer === answer.id) {
                feedback = "incorrect"
              }
            }
            return (
              <AnswerOption
                key={answer.id}
                id={answer.id}
                text={answer.text}
                isSelected={selectedAnswer === answer.id}
                onSelect={onSelectAnswer}
                disabled={hasAnswerSubmitted}
                feedback={feedback}
              />
            )
          })}
        </div>

        {/* Submit button */}
        { !hasAnswerSubmitted && (
          <Button
            onClick={onSubmitAnswer}
            disabled={!hasAnswerSelected}
          >
            Soumettre
          </Button>
        )}
        {/* Go to next question button */}
        { hasAnswerSubmitted && (
          <Button
            onClick={onGoToNextQuestion}
          >
            Suivant
          </Button>
        )}
      </QuestionCard>
    </div>
  )
}

export default QuizScreen
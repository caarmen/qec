import QuestionCard from './ui/QuestionCard'
import AnswerOption from './ui/AnswerOption'
import Button from './ui/Button'

/**
 * Return a feedback message to display for the submitted answer (right/wrong answer).
 * @param {boolean} hasAnswerSubmitted  - Whether an answer has been submitted
 * @param {Object} currentQuestion - Current question object with answers
 * @param {number} selectedAnswer - ID of currently selected answer
 * @returns {string} A feedback message to display.
 */
function getFeedbackMessage(hasAnswerSubmitted, currentQuestion, selectedAnswer) {
  if (!hasAnswerSubmitted) return null

  const isCorrect = currentQuestion.answers.some(
    a => a.id === selectedAnswer && a.isCorrect
  )

  return isCorrect ? "Bonne réponse." : "Mauvaise réponse."
}

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
  score,
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

  const feedbackMessage = getFeedbackMessage(hasAnswerSubmitted, currentQuestion, selectedAnswer)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <QuestionCard className="w-full max-w-md">
        {/* Progress indicator */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <p>{`Question ${currentQuestionIndex + 1} sur ${totalQuestions}`}</p>
          <p>{`${score} ${score === 1 ? 'bonne réponse' : 'bonnes réponses'}`}</p>
        </div>

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

        <div className="flex items-start gap-2 text-sm min-h-[2rem]">
          <p className="text-gray-800">
            {feedbackMessage}
          </p>
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
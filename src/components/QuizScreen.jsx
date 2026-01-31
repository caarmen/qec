import QuestionCard from './ui/QuestionCard'
import AnswerOption from './ui/AnswerOption'
import Button from './ui/Button'
import { useEffect, useRef } from "react"

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

  /* Focus on the top of the screen when a new question is displayed */
  const progressRef = useRef(null);

  useEffect(() =>{
    progressRef.current?.focus()
  }, [currentQuestionIndex])

  /* Focus on the feedback message when it appears */
  const feedbackMessage = getFeedbackMessage(hasAnswerSubmitted, currentQuestion, selectedAnswer)

  const feedbackRef = useRef(null);

  useEffect(() => {
    if (feedbackMessage) {
      feedbackRef.current?.focus()
    }
  })

  if (!currentQuestion) {
    return null
  }


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <QuestionCard className="w-full max-w-md">
        {/* Progress indicator */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <p
            tabIndex={-1}
            ref={progressRef}>{`Question ${currentQuestionIndex + 1} sur ${totalQuestions}`}
          </p>
          <p>{`${score} ${score === 1 ? 'bonne réponse' : 'bonnes réponses'}`}</p>
        </div>

        {/* Question text */}
        <h2 className="text-xl font-medium text-gray-900">
          {currentQuestion.question}
        </h2>

        {/* Answer options */}
        <ul className="space-y-3">
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
              <li key={answer.id}>
                <AnswerOption
                  key={answer.id}
                  id={answer.id}
                  text={answer.text}
                  isSelected={selectedAnswer === answer.id}
                  onSelect={onSelectAnswer}
                  disabled={hasAnswerSubmitted}
                  feedback={feedback}
                />
              </li>
            )
          })}
        </ul>

        {/* Don't use aria-live. Even though that would be better semantically,
        VoiceOver doesn't read the text in French, even if lang="fr" is added
        to the element.*/}
        <div
          className="flex items-start gap-2 text-sm min-h-[2rem] text-gray-800"
          ref={feedbackRef}
          aria-hidden={!feedbackMessage}
          tabIndex={-1}
        >
            {feedbackMessage}
        </div>

        {/* Submit/Next button. Use a single button for both actions,
        instead of two separate buttons added/removed to the dom.
        This isn't a performance tweak, it's an a11y tweak. If we had
        2 separate buttons, then when we'd hide the submit button to
        show the next button, the next button wouldn't have the focus,
        requiring the user to swipe across the whole screen to find the
        next button.*/}
        <Button
          onClick={hasAnswerSubmitted ? onGoToNextQuestion : onSubmitAnswer}
          disabled={!hasAnswerSelected && !hasAnswerSubmitted}
        >
          {hasAnswerSubmitted ? "Suivant" : "Soumettre"}
        </Button>
      </QuestionCard>
    </div>
  )
}

export default QuizScreen

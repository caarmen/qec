import QuestionCard from './ui/QuestionCard'
import AnswerOption from './ui/AnswerOption'
import Button from './ui/Button'
import { isAnswerCorrect } from '../utils/quizHelpers'
import { useEffect, useRef } from "react"
import { useTranslation } from 'react-i18next';
import { DIFFICULTY } from '../hooks/useQuiz'


/**
 * Return a feedback message to display for the submitted answer (right/wrong answer).
 * @param {boolean} hasAnswerSubmitted  - Whether an answer has been submitted
 * @param {Object} currentQuestion - Current question object with answers
 * @param {number} selectedAnswers - IDs of currently selected answer
 * @param {(key: string) => string} t - Translation function
 * @returns {string} A feedback message to display.
 */
function getFeedbackMessage(hasAnswerSubmitted, currentQuestion, selectedAnswers, t) {
  if (!hasAnswerSubmitted) return null

  const isCorrect = isAnswerCorrect(currentQuestion, selectedAnswers)

  return t(isCorrect ? "quizScreen.feedback.correctAnswer": "quizScreen.feedback.incorrectAnswer")
}

/**
 * Return the new list of selected answer ids.
 *
 * @param {Array<String>} currentSelectedAnswerIds the ids of the currently selected answers
 * @param {string} selectedAnswerId the id of the answer the user just selected/toggled
 * @param {Object} options
 * @param {boolean} options.multipleCorrectAnswers true if we're un multi-select mode
 * @returns  {Array<string>} the new list of selected answer ids.
 */
function getSelectedAnswers(currentSelectedAnswerIds, selectedAnswerId, {
  multipleCorrectAnswers
}) {
  // Case 1: Multi-select mode: multiple answers are possible
  if (multipleCorrectAnswers) {
    // Case 1a: The user unchecked an answer
    if (currentSelectedAnswerIds.includes(selectedAnswerId)) {
      return currentSelectedAnswerIds.filter(answerId => answerId !== selectedAnswerId)
    }
    // Case 1b: The user checked an answer
    return [...currentSelectedAnswerIds, selectedAnswerId]

  }
  // Case 2: only one answer is possible, it's the one the user just selected.
  return [selectedAnswerId]
}

/**
 * QuizScreen component - Main quiz interface for answering questions
 * @param {Object} props - Component props
 * @param {Object} props.currentQuestion - Current question object with id, question, answers
 * @param {number} props.currentQuestionIndex - Index of current question (0-based)
 * @param {number} props.totalQuestions - Total number of questions in quiz
 * @param {string|null} props.selectedAnswers - IDs of currently selected answer
 * @param {Function} props.onSelectAnswer - Callback when user selects an answer
 * @param {Function} props.onSubmitAnswer - Callback when user submits answer
 * @param {Function} props.onGoToNextQuestion - Callback when user wants to go to the next question
 * @param {boolean} props.hasAnswerSelected - Whether an answer has been selected
 * @param {boolean} props.hasAnswerSubmitted - Whether an answer has been submitted
 * @returns {JSX.Element|null} QuizScreen component or null if no question
 */
function QuizScreen({
  currentQuestion,
  difficulty,
  currentQuestionIndex,
  totalQuestions,
  score,
  selectedAnswers,
  onSelectAnswer,
  onSubmitAnswer,
  onGoToNextQuestion,
  hasAnswerSelected,
  hasAnswerSubmitted,
}) {

  const { t } = useTranslation();
  /* Focus on the top of the screen when a new question is displayed */
  const progressRef = useRef(null);

  useEffect(() =>{
    progressRef.current?.focus()
  }, [currentQuestionIndex])

  /* Focus on the feedback message when it appears */
  const feedbackMessage = getFeedbackMessage(hasAnswerSubmitted, currentQuestion, selectedAnswers, t)

  const feedbackRef = useRef(null);

  useEffect(() => {
    if (feedbackMessage) {
      feedbackRef.current?.focus()
    }
  })

  const progressPercent = ((currentQuestionIndex + 1)*100) / totalQuestions

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
            ref={progressRef}>{t("quizScreen.progress", {
              current: currentQuestionIndex + 1,
              total: totalQuestions
            })}
          </p>
          <p>{t("quizScreen.correctCount", {count: score})}</p>
        </div>

        {/* Question text */}
        <h2 className="text-xl font-medium text-gray-900">
          {currentQuestion.question}
        </h2>

        {difficulty === DIFFICULTY.DIFFICULT && (
          <p class="mt-3 mb-4 text-sm text-gray-600">
            {t("quizScreen.multiChoiceInstruction")}
          </p>
        )}

        {/* Visual progress bar indicator.
        Hide it from a11y as it would be redunant with the textual indication
        of the progress already present on the screen. */}
        <div className="w-full h-1 bg-gray-200 rounded-full" aria-hidden="true">
          <div class="h-1 bg-blue-600 rounded-full" style={{width: `${progressPercent}%`}}></div>
        </div>

        {/* Answer options */}
        <ul className="space-y-3">
          {currentQuestion.answers.map((answer) => {

            let feedback = '';
            if (hasAnswerSubmitted) {
              if (answer.isCorrect) {
                feedback = "correct"
              } else if (selectedAnswers.includes(answer.id)) {
                feedback = "incorrect"
              }
            }
            return (
              <li key={answer.id}>
                <AnswerOption
                  key={answer.id}
                  id={answer.id}
                  text={answer.text}
                  role={difficulty === DIFFICULTY.DIFFICULT ? "checkbox": "radio"}
                  isSelected={selectedAnswers.includes(answer.id)}
                  onSelect={() => onSelectAnswer(getSelectedAnswers(
                    selectedAnswers,
                    answer.id, {
                      multipleCorrectAnswers: difficulty === DIFFICULTY.DIFFICULT
                    }
                  ))}
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
          {t(hasAnswerSubmitted ? "quizScreen.buttonNext" : "quizScreen.buttonSubmit")}
        </Button>
      </QuestionCard>
    </div>
  )
}

export default QuizScreen

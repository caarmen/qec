import QuestionCard from './ui/QuestionCard'
import AnswerOption from './ui/AnswerOption'
import Button from './ui/Button'

function QuizScreen({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  onSubmitAnswer,
  hasAnswerSelected
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
          {currentQuestion.answers.map((answer) => (
            <AnswerOption
              key={answer.id}
              id={answer.id}
              text={answer.text}
              isSelected={selectedAnswer === answer.id}
              onSelect={onSelectAnswer}
            />
          ))}
        </div>

        {/* Submit button */}
        <Button
          onClick={onSubmitAnswer}
          disabled={!hasAnswerSelected}
        >
          Suivant
        </Button>
      </QuestionCard>
    </div>
  )
}

export default QuizScreen
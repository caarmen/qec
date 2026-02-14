import { useQuiz, QUIZ_STATUS } from './hooks/useQuiz'
import QuizStartScreen from './components/QuizStartScreen'
import QuizScreen from './components/QuizScreen'
import ResultsScreen from './components/ResultsScreen'
import questionsData from './data/questions.json'

function App() {
  const {
    quizStatus,
    difficulty,
    currentQuestion,
    currentQuestionIndex,
    selectedAnswers,
    selectedQuestionCount,
    score,
    totalQuestions,
    hasAnswerSelected,
    startQuiz,
    selectQuestionCount,
    selectDifficulty,
    selectAnswer,
    submitAnswer,
    goToNextQuestion,
    restartQuiz
  } = useQuiz()

  const handleStartQuiz = () => {
    startQuiz(questionsData.questions)
  }

  return (
    <>
      {(quizStatus === QUIZ_STATUS.NOT_STARTED || quizStatus === QUIZ_STATUS.CONFIGURING) && (
        <QuizStartScreen
          totalQuestions={questionsData.questions.length}
          selectedQuestionCount={selectedQuestionCount}
          onSelectQuestionCount={selectQuestionCount}
          selectedDifficulty={difficulty}
          onSelectDifficulty={selectDifficulty}
          onStart={handleStartQuiz}
        />
      )}

      {(quizStatus === QUIZ_STATUS.ANSWERING || quizStatus === QUIZ_STATUS.REVIEWING_ANSWER ) && (
        <QuizScreen
          currentQuestion={currentQuestion}
          difficulty={difficulty}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          score={score}
          selectedAnswers={selectedAnswers}
          onSelectAnswer={selectAnswer}
          onSubmitAnswer={submitAnswer}
          onGoToNextQuestion={goToNextQuestion}
          hasAnswerSelected={hasAnswerSelected}
          hasAnswerSubmitted={quizStatus === QUIZ_STATUS.REVIEWING_ANSWER}
        />
      )}

      {quizStatus === QUIZ_STATUS.COMPLETED && (
        <ResultsScreen
          score={score}
          totalQuestions={totalQuestions}
          difficulty={difficulty}
          onRestart={restartQuiz}
        />
      )}
    </>
  )
}

export default App

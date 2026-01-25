import { useQuiz, QUIZ_STATUS } from './hooks/useQuiz'
import StartScreen from './components/StartScreen'
import QuizScreen from './components/QuizScreen'
import ResultsScreen from './components/ResultsScreen'
import questionsData from './data/questions.json'

function App() {
  const {
    quizStatus,
    currentQuestion,
    currentQuestionIndex,
    selectedAnswer,
    score,
    totalQuestions,
    hasAnswerSelected,
    startQuiz,
    selectAnswer,
    submitAnswer,
    restartQuiz
  } = useQuiz()

  const handleStartQuiz = () => {
    startQuiz(questionsData.questions, 10)
  }

  return (
    <>
      {quizStatus === QUIZ_STATUS.NOT_STARTED && (
        <StartScreen onStart={handleStartQuiz} />
      )}

      {quizStatus === QUIZ_STATUS.IN_PROGRESS && (
        <QuizScreen
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={selectAnswer}
          onSubmitAnswer={submitAnswer}
          hasAnswerSelected={hasAnswerSelected}
        />
      )}

      {quizStatus === QUIZ_STATUS.COMPLETED && (
        <ResultsScreen
          score={score}
          totalQuestions={totalQuestions}
          onRestart={restartQuiz}
        />
      )}
    </>
  )
}

export default App
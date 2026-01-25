import { useReducer, useMemo } from 'react'
import { processQuestions } from '../utils/questionProcessor'
import { isAnswerCorrect } from '../utils/quizHelpers'
import { DEFAULT_QUESTION_COUNT } from '../utils/constants'

// Quiz status constants
export const QUIZ_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
}

// Action types
export const ACTIONS = {
  START_QUIZ: 'START_QUIZ',
  SELECT_ANSWER: 'SELECT_ANSWER',
  SUBMIT_ANSWER: 'SUBMIT_ANSWER',
  RESTART_QUIZ: 'RESTART_QUIZ'
}

// Initial state
const initialState = {
  quizStatus: QUIZ_STATUS.NOT_STARTED,
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswer: null,
  userAnswers: [],
  score: 0
}

// Reducer function
function quizReducer(state, action) {
  switch (action.type) {
    case ACTIONS.START_QUIZ: {
      const questions = processQuestions(action.payload.rawQuestions, action.payload.count)
      return {
        ...initialState,
        quizStatus: QUIZ_STATUS.IN_PROGRESS,
        questions
      }
    }

    case ACTIONS.SELECT_ANSWER: {
      return {
        ...state,
        selectedAnswer: action.payload.answerId
      }
    }

    case ACTIONS.SUBMIT_ANSWER: {
      const currentQuestion = state.questions[state.currentQuestionIndex]
      const isCorrect = isAnswerCorrect(currentQuestion, state.selectedAnswer)
      
      // Store user's answer
      const userAnswer = {
        questionId: currentQuestion.id,
        answerId: state.selectedAnswer,
        isCorrect
      }

      const newUserAnswers = [...state.userAnswers, userAnswer]
      const newScore = isCorrect ? state.score + 1 : state.score
      const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1

      // If last question, mark as completed
      if (isLastQuestion) {
        return {
          ...state,
          userAnswers: newUserAnswers,
          score: newScore,
          selectedAnswer: null,
          quizStatus: QUIZ_STATUS.COMPLETED
        }
      }

      // Otherwise, move to next question
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        selectedAnswer: null,
        userAnswers: newUserAnswers,
        score: newScore
      }
    }

    case ACTIONS.RESTART_QUIZ: {
      return initialState
    }

    default:
      return state
  }
}

// Custom hook
export function useQuiz() {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  const startQuiz = (rawQuestions, count = DEFAULT_QUESTION_COUNT) => {
    dispatch({
      type: ACTIONS.START_QUIZ,
      payload: { rawQuestions, count }
    })
  }

  const selectAnswer = (answerId) => {
    dispatch({
      type: ACTIONS.SELECT_ANSWER,
      payload: { answerId }
    })
  }

  const submitAnswer = () => {
    dispatch({
      type: ACTIONS.SUBMIT_ANSWER
    })
  }

  const restartQuiz = () => {
    dispatch({
      type: ACTIONS.RESTART_QUIZ
    })
  }

  // Memoize computed values to prevent unnecessary recalculations
  const currentQuestion = useMemo(
    () => state.questions[state.currentQuestionIndex] || null,
    [state.questions, state.currentQuestionIndex]
  )

  const hasAnswerSelected = useMemo(
    () => state.selectedAnswer !== null,
    [state.selectedAnswer]
  )

  return {
    // State
    quizStatus: state.quizStatus,
    questions: state.questions,
    currentQuestionIndex: state.currentQuestionIndex,
    currentQuestion,
    selectedAnswer: state.selectedAnswer,
    userAnswers: state.userAnswers,
    score: state.score,
    totalQuestions: state.questions.length,
    
    // Actions
    startQuiz,
    selectAnswer,
    submitAnswer,
    restartQuiz,
    
    // Computed values
    hasAnswerSelected
  }
}
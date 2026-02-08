import { useReducer, useMemo } from 'react'
import { processQuestions } from '../utils/questionProcessor'
import { isAnswerCorrect } from '../utils/quizHelpers'
import { DEFAULT_QUESTION_COUNT } from '../utils/constants'

// Quiz status constants
export const QUIZ_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  CONFIGURING: 'CONFIGURING',
  ANSWERING: 'ANSWERING',
  REVIEWING_ANSWER: 'REVIEWING_ANSWER',
  COMPLETED: 'COMPLETED'
}

// Action types
export const ACTIONS = {
  START_QUIZ: 'START_QUIZ',
  SELECT_QUESTION_COUNT: 'SELECT_QUESTION_COUNT',
  SELECT_ANSWER: 'SELECT_ANSWER',
  SUBMIT_ANSWER: 'SUBMIT_ANSWER',
  GO_TO_NEXT_QUESTION: 'GO_TO_NEXT_QUESTION',
  RESTART_QUIZ: 'RESTART_QUIZ'
}

// Initial state
const initialState = {
  quizStatus: QUIZ_STATUS.NOT_STARTED,
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswer: null,
  userAnswers: [],
  score: 0,
  selectedQuestionCount: DEFAULT_QUESTION_COUNT
}

// Reducer function
function quizReducer(state, action) {
  switch (action.type) {
    case ACTIONS.START_QUIZ: {
      const questions = processQuestions(action.payload.rawQuestions, state.selectedQuestionCount)
      return {
        ...initialState,
        quizStatus: QUIZ_STATUS.ANSWERING,
        questions
      }
    }

    case ACTIONS.SELECT_QUESTION_COUNT: {
      return {
        ...state,
        selectedQuestionCount: action.payload.count
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

      return {
        ...state,
        userAnswers: newUserAnswers,
        score: newScore,
        quizStatus: QUIZ_STATUS.REVIEWING_ANSWER,
      }

    }

    case ACTIONS.GO_TO_NEXT_QUESTION: {
      const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1

      // If last question, mark as completed
      if (isLastQuestion) {
        return {
          ...state,
          selectedAnswer: null,
          quizStatus: QUIZ_STATUS.COMPLETED,
        }
      }

      // Otherwise, move to next question
      return {
        ...state,
        selectedAnswer: null,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        quizStatus: QUIZ_STATUS.ANSWERING,
      }
    }

    case ACTIONS.RESTART_QUIZ: {
      return {
        ...initialState,
        quizStatus: QUIZ_STATUS.CONFIGURING
      }
    }

    default:
      return state
  }
}

// Custom hook
export function useQuiz() {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  const startQuiz = (rawQuestions) => {
    dispatch({
      type: ACTIONS.START_QUIZ,
      payload: { rawQuestions }
    })
  }

  const selectQuestionCount = (count) => {
    dispatch({
      type: ACTIONS.SELECT_QUESTION_COUNT,
      payload: { count }
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

  const goToNextQuestion = () => {
    dispatch({
      type: ACTIONS.GO_TO_NEXT_QUESTION
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
    selectedQuestionCount: state.selectedQuestionCount,
    
    // Actions
    startQuiz,
    selectQuestionCount,
    selectAnswer,
    submitAnswer,
    goToNextQuestion,
    restartQuiz,
    
    // Computed values
    hasAnswerSelected
  }
}

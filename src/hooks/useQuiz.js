import { useReducer, useMemo } from "react";
import { processQuestions } from "../utils/questionProcessor";
import { isAnswerCorrect } from "../utils/quizHelpers";
import { DEFAULT_QUESTION_COUNT } from "../utils/constants";

// Quiz status constants
export const QUIZ_STATUS = {
  NOT_STARTED: "NOT_STARTED",
  CONFIGURING: "CONFIGURING",
  ANSWERING: "ANSWERING",
  REVIEWING_ANSWER: "REVIEWING_ANSWER",
  COMPLETED: "COMPLETED",
};

// Quiz difficulty
export const DIFFICULTY = {
  NORMAL: "NORMAL",
  DIFFICULT: "DIFFICULT",
};

// Action types
const ACTIONS = {
  START_QUIZ: "START_QUIZ",
  SELECT_QUESTION_COUNT: "SELECT_QUESTION_COUNT",
  SELECT_DIFFICULTY: "SELECT_DIFFICULTY",
  SELECT_ANSWER: "SELECT_ANSWER",
  SUBMIT_ANSWER: "SUBMIT_ANSWER",
  GO_TO_NEXT_QUESTION: "GO_TO_NEXT_QUESTION",
  RESTART_QUIZ: "RESTART_QUIZ",
};

// Initial state
const initialState = {
  quizStatus: QUIZ_STATUS.NOT_STARTED,
  difficulty: DIFFICULTY.NORMAL,
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswers: [],
  userAnswers: [],
  score: 0,
  selectedQuestionCount: DEFAULT_QUESTION_COUNT,
};

// Reducer function
function quizReducer(state, action) {
  switch (action.type) {
    case ACTIONS.START_QUIZ: {
      const questions = processQuestions(action.payload.rawQuestions, {
        count: state.selectedQuestionCount,
        difficulty: state.difficulty,
      });
      return {
        ...initialState,
        difficulty: state.difficulty,
        quizStatus: QUIZ_STATUS.ANSWERING,
        questions,
      };
    }

    case ACTIONS.SELECT_QUESTION_COUNT: {
      return {
        ...state,
        selectedQuestionCount: action.payload.count,
      };
    }

    case ACTIONS.SELECT_DIFFICULTY: {
      return {
        ...state,
        difficulty: action.payload.difficulty,
      };
    }

    case ACTIONS.SELECT_ANSWER: {
      return {
        ...state,
        selectedAnswers: action.payload.answerIds,
      };
    }

    case ACTIONS.SUBMIT_ANSWER: {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      const isCorrect = isAnswerCorrect(currentQuestion, state.selectedAnswers);

      // Store user's answer
      const userAnswer = {
        questionId: currentQuestion.id,
        answerIds: state.selectedAnswers,
        isCorrect,
      };

      const newUserAnswers = [...state.userAnswers, userAnswer];
      const newScore = isCorrect ? state.score + 1 : state.score;

      return {
        ...state,
        userAnswers: newUserAnswers,
        score: newScore,
        quizStatus: QUIZ_STATUS.REVIEWING_ANSWER,
      };
    }

    case ACTIONS.GO_TO_NEXT_QUESTION: {
      const isLastQuestion =
        state.currentQuestionIndex === state.questions.length - 1;

      // If last question, mark as completed
      if (isLastQuestion) {
        return {
          ...state,
          selectedAnswers: [],
          quizStatus: QUIZ_STATUS.COMPLETED,
        };
      }

      // Otherwise, move to next question
      return {
        ...state,
        selectedAnswers: [],
        currentQuestionIndex: state.currentQuestionIndex + 1,
        quizStatus: QUIZ_STATUS.ANSWERING,
      };
    }

    case ACTIONS.RESTART_QUIZ: {
      return {
        ...initialState,
        quizStatus: QUIZ_STATUS.CONFIGURING,
      };
    }

    default:
      return state;
  }
}

// Custom hook
export function useQuiz() {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const startQuiz = (rawQuestions) => {
    dispatch({
      type: ACTIONS.START_QUIZ,
      payload: { rawQuestions },
    });
  };

  const selectQuestionCount = (count) => {
    dispatch({
      type: ACTIONS.SELECT_QUESTION_COUNT,
      payload: { count },
    });
  };

  const selectDifficulty = (difficulty) => {
    dispatch({
      type: ACTIONS.SELECT_DIFFICULTY,
      payload: { difficulty },
    });
  };

  const selectAnswer = (answerIds) => {
    dispatch({
      type: ACTIONS.SELECT_ANSWER,
      payload: { answerIds },
    });
  };

  const submitAnswer = () => {
    dispatch({
      type: ACTIONS.SUBMIT_ANSWER,
    });
  };

  const goToNextQuestion = () => {
    dispatch({
      type: ACTIONS.GO_TO_NEXT_QUESTION,
    });
  };

  const restartQuiz = () => {
    dispatch({
      type: ACTIONS.RESTART_QUIZ,
    });
  };

  // Memoize computed values to prevent unnecessary recalculations
  const currentQuestion = useMemo(
    () => state.questions[state.currentQuestionIndex] || null,
    [state.questions, state.currentQuestionIndex],
  );

  const hasAnswerSelected = useMemo(
    () => state.selectedAnswers.length > 0,
    [state.selectedAnswers],
  );

  return {
    // State
    quizStatus: state.quizStatus,
    difficulty: state.difficulty,
    questions: state.questions,
    currentQuestionIndex: state.currentQuestionIndex,
    currentQuestion,
    selectedAnswers: state.selectedAnswers,
    userAnswers: state.userAnswers,
    score: state.score,
    totalQuestions: state.questions.length,
    selectedQuestionCount: state.selectedQuestionCount,

    // Actions
    startQuiz,
    selectQuestionCount,
    selectDifficulty,
    selectAnswer,
    submitAnswer,
    goToNextQuestion,
    restartQuiz,

    // Computed values
    hasAnswerSelected,
  };
}

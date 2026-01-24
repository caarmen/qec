import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useQuiz, QUIZ_STATUS, ACTIONS } from '../../hooks/useQuiz'

describe('useQuiz', () => {
  const mockRawQuestions = [
    {
      question: "Question 1",
      theme: "Theme 1",
      correctAnswers: ["Correct 1"],
      wrongAnswers: ["Wrong 1A", "Wrong 1B"]
    },
    {
      question: "Question 2",
      theme: "Theme 2",
      correctAnswers: ["Correct 2"],
      wrongAnswers: ["Wrong 2A", "Wrong 2B"]
    },
    {
      question: "Question 3",
      theme: "Theme 3",
      correctAnswers: ["Correct 3"],
      wrongAnswers: ["Wrong 3A", "Wrong 3B"]
    }
  ]

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useQuiz())

      expect(result.current.quizStatus).toBe(QUIZ_STATUS.NOT_STARTED)
      expect(result.current.questions).toEqual([])
      expect(result.current.currentQuestionIndex).toBe(0)
      expect(result.current.selectedAnswer).toBe(null)
      expect(result.current.userAnswers).toEqual([])
      expect(result.current.score).toBe(0)
      expect(result.current.totalQuestions).toBe(0)
      expect(result.current.currentQuestion).toBe(null)
      expect(result.current.hasAnswerSelected).toBe(false)
    })

    it('should provide all required action functions', () => {
      const { result } = renderHook(() => useQuiz())

      expect(typeof result.current.startQuiz).toBe('function')
      expect(typeof result.current.selectAnswer).toBe('function')
      expect(typeof result.current.submitAnswer).toBe('function')
      expect(typeof result.current.restartQuiz).toBe('function')
    })
  })

  describe('START_QUIZ action', () => {
    it('should start quiz with processed questions', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.startQuiz(mockRawQuestions, 2)
      })

      expect(result.current.quizStatus).toBe(QUIZ_STATUS.IN_PROGRESS)
      expect(result.current.questions).toHaveLength(2)
      expect(result.current.currentQuestionIndex).toBe(0)
      expect(result.current.score).toBe(0)
      expect(result.current.totalQuestions).toBe(2)
    })

    it('should default to 10 questions when count not specified', () => {
      const manyQuestions = Array(15).fill(null).map((_, i) => ({
        question: `Question ${i}`,
        theme: "Theme",
        correctAnswers: ["Correct"],
        wrongAnswers: ["Wrong 1", "Wrong 2"]
      }))

      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.startQuiz(manyQuestions)
      })

      expect(result.current.questions).toHaveLength(10)
    })

    it('should set current question correctly', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.startQuiz(mockRawQuestions, 3)
      })

      expect(result.current.currentQuestion).toBeTruthy()
      expect(result.current.currentQuestion).toHaveProperty('id')
      expect(result.current.currentQuestion).toHaveProperty('question')
      expect(result.current.currentQuestion).toHaveProperty('answers')
    })

    it('should reset state when starting new quiz', () => {
      const { result } = renderHook(() => useQuiz())

      // Start first quiz
      act(() => {
        result.current.startQuiz(mockRawQuestions, 2)
      })

      // Select answer and submit
      const firstAnswerId = result.current.currentQuestion.answers[0].id
      act(() => {
        result.current.selectAnswer(firstAnswerId)
        result.current.submitAnswer()
      })

      // Start new quiz
      act(() => {
        result.current.startQuiz(mockRawQuestions, 2)
      })

      expect(result.current.currentQuestionIndex).toBe(0)
      expect(result.current.score).toBe(0)
      expect(result.current.userAnswers).toEqual([])
      expect(result.current.selectedAnswer).toBe(null)
    })
  })

  describe('SELECT_ANSWER action', () => {
    it('should select an answer', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.startQuiz(mockRawQuestions, 2)
      })

      const answerId = 'test-answer-id'

      act(() => {
        result.current.selectAnswer(answerId)
      })

      expect(result.current.selectedAnswer).toBe(answerId)
      expect(result.current.hasAnswerSelected).toBe(true)
    })

    it('should allow changing selected answer', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.startQuiz(mockRawQuestions, 2)
      })

      act(() => {
        result.current.selectAnswer('answer-1')
      })

      expect(result.current.selectedAnswer).toBe('answer-1')

      act(() => {
        result.current.selectAnswer('answer-2')
      })

      expect(result.current.selectedAnswer).toBe('answer-2')
    })
  })

  describe('SUBMIT_ANSWER action', () => {
    it('should increment score for correct answer', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.startQuiz(mockRawQuestions, 3)
      })

      // Find correct answer
      const correctAnswer = result.current.currentQuestion.answers.find(
        a => a.isCorrect
      )

      act(() => {
        result.current.selectAnswer(correctAnswer.id)
        result.current.submitAnswer()
      })

      expect(result.current.score).toBe(1)
      expect(result.current.userAnswers).toHaveLength(1)
      expect(result.current.userAnswers[0].isCorrect).toBe(true)
    })

    it('should not increment score for wrong answer', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.startQuiz(mockRawQuestions, 3)
      })

      // Find wrong answer
      const wrongAnswer = result.current.currentQuestion.answers.find(
        a => !a.isCorrect
      )

      act(() => {
        result.current.selectAnswer(wrongAnswer.id)
        result.current.submitAnswer()
      })

      expect(result.current.score).toBe(0)
      expect(result.current.userAnswers).toHaveLength(1)
      expect(result.current.userAnswers[0].isCorrect).toBe(false)
    })

    it('should move to next question', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.startQuiz(mockRawQuestions, 3)
      })

      expect(result.current.currentQuestionIndex).toBe(0)

      const answerId = result.current.currentQuestion.answers[0].id

      act(() => {
        result.current.selectAnswer(answerId)
        result.current.submitAnswer()
      })

      expect(result.current.currentQuestionIndex).toBe(1)
    })

    it('should reset selectedAnswer after submit', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.startQuiz(mockRawQuestions, 3)
      })

      const answerId = result.current.currentQuestion.answers[0].id

      act(() => {
        result.current.selectAnswer(answerId)
        result.current.submitAnswer()
      })

      expect(result.current.selectedAnswer).toBe(null)
      expect(result.current.hasAnswerSelected).toBe(false)
    })

    it('should store user answer with question ID and correctness', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.startQuiz(mockRawQuestions, 3)
      })

      const questionId = result.current.currentQuestion.id
      const answerId = result.current.currentQuestion.answers[0].id

      act(() => {
        result.current.selectAnswer(answerId)
        result.current.submitAnswer()
      })

      expect(result.current.userAnswers[0]).toEqual({
        questionId,
        answerId,
        isCorrect: expect.any(Boolean)
      })
    })

    it('should complete quiz on last question', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.startQuiz(mockRawQuestions, 2)
      })

      // Answer first question
      act(() => {
        const answerId = result.current.currentQuestion.answers[0].id
        result.current.selectAnswer(answerId)
        result.current.submitAnswer()
      })

      expect(result.current.quizStatus).toBe(QUIZ_STATUS.IN_PROGRESS)

      // Answer second (last) question
      act(() => {
        const answerId = result.current.currentQuestion.answers[0].id
        result.current.selectAnswer(answerId)
        result.current.submitAnswer()
      })

      expect(result.current.quizStatus).toBe(QUIZ_STATUS.COMPLETED)
      expect(result.current.userAnswers).toHaveLength(2)
    })

    it('should not increment currentQuestionIndex on last question', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.startQuiz(mockRawQuestions, 2)
      })

      // Answer first question
      act(() => {
        const answerId = result.current.currentQuestion.answers[0].id
        result.current.selectAnswer(answerId)
        result.current.submitAnswer()
      })

      expect(result.current.currentQuestionIndex).toBe(1)

      // Answer last question
      act(() => {
        const answerId = result.current.currentQuestion.answers[0].id
        result.current.selectAnswer(answerId)
        result.current.submitAnswer()
      })

      // Should stay on last question index
      expect(result.current.currentQuestionIndex).toBe(1)
    })
  })

  describe('RESTART_QUIZ action', () => {
    it('should reset to initial state', () => {
      const { result } = renderHook(() => useQuiz())

      // Start and play quiz
      act(() => {
        result.current.startQuiz(mockRawQuestions, 2)
      })

      act(() => {
        const answerId = result.current.currentQuestion.answers[0].id
        result.current.selectAnswer(answerId)
        result.current.submitAnswer()
      })

      // Restart
      act(() => {
        result.current.restartQuiz()
      })

      expect(result.current.quizStatus).toBe(QUIZ_STATUS.NOT_STARTED)
      expect(result.current.questions).toEqual([])
      expect(result.current.currentQuestionIndex).toBe(0)
      expect(result.current.selectedAnswer).toBe(null)
      expect(result.current.userAnswers).toEqual([])
      expect(result.current.score).toBe(0)
      expect(result.current.currentQuestion).toBe(null)
    })

    it('should allow starting new quiz after restart', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.startQuiz(mockRawQuestions, 2)
      })

      act(() => {
        result.current.restartQuiz()
      })

      act(() => {
        result.current.startQuiz(mockRawQuestions, 3)
      })

      expect(result.current.quizStatus).toBe(QUIZ_STATUS.IN_PROGRESS)
      expect(result.current.questions).toHaveLength(3)
    })
  })

  describe('complete quiz flow', () => {
    it('should handle full quiz completion', () => {
      const { result } = renderHook(() => useQuiz())

      // Start quiz with 3 questions
      act(() => {
        result.current.startQuiz(mockRawQuestions, 3)
      })

      expect(result.current.quizStatus).toBe(QUIZ_STATUS.IN_PROGRESS)

      // Answer all 3 questions
      for (let i = 0; i < 3; i++) {
        const correctAnswer = result.current.currentQuestion.answers.find(
          a => a.isCorrect
        )

        act(() => {
          result.current.selectAnswer(correctAnswer.id)
          result.current.submitAnswer()
        })
      }

      expect(result.current.quizStatus).toBe(QUIZ_STATUS.COMPLETED)
      expect(result.current.score).toBe(3)
      expect(result.current.userAnswers).toHaveLength(3)
    })

    it('should track mixed correct and wrong answers', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.startQuiz(mockRawQuestions, 3)
      })

      // Answer 1: Correct
      act(() => {
        const correctAnswer = result.current.currentQuestion.answers.find(
          a => a.isCorrect
        )
        result.current.selectAnswer(correctAnswer.id)
        result.current.submitAnswer()
      })

      // Answer 2: Wrong
      act(() => {
        const wrongAnswer = result.current.currentQuestion.answers.find(
          a => !a.isCorrect
        )
        result.current.selectAnswer(wrongAnswer.id)
        result.current.submitAnswer()
      })

      // Answer 3: Correct
      act(() => {
        const correctAnswer = result.current.currentQuestion.answers.find(
          a => a.isCorrect
        )
        result.current.selectAnswer(correctAnswer.id)
        result.current.submitAnswer()
      })

      expect(result.current.score).toBe(2)
      expect(result.current.userAnswers[0].isCorrect).toBe(true)
      expect(result.current.userAnswers[1].isCorrect).toBe(false)
      expect(result.current.userAnswers[2].isCorrect).toBe(true)
    })
  })
})
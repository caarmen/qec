import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useQuiz, QUIZ_STATUS, DIFFICULTY } from '../../hooks/useQuiz'

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
      expect(result.current.selectedAnswers).toEqual([])
      expect(result.current.userAnswers).toEqual([])
      expect(result.current.score).toBe(0)
      expect(result.current.totalQuestions).toBe(0)
      expect(result.current.currentQuestion).toBe(null)
      expect(result.current.hasAnswerSelected).toBe(false)
      expect(result.current.selectedQuestionCount).toBe(40)
    })

    it('should provide all required action functions', () => {
      const { result } = renderHook(() => useQuiz())

      expect(typeof result.current.startQuiz).toBe('function')
      expect(typeof result.current.selectQuestionCount).toBe('function')
      expect(typeof result.current.selectDifficulty).toBe('function')
      expect(typeof result.current.selectAnswer).toBe('function')
      expect(typeof result.current.submitAnswer).toBe('function')
      expect(typeof result.current.restartQuiz).toBe('function')
    })
  })

  describe('START_QUIZ action', () => {
    it('should start quiz with processed questions', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.selectQuestionCount(2)
        result.current.startQuiz(mockRawQuestions)
      })

      expect(result.current.quizStatus).toBe(QUIZ_STATUS.ANSWERING)
      expect(result.current.questions).toHaveLength(2)
      expect(result.current.currentQuestionIndex).toBe(0)
      expect(result.current.score).toBe(0)
      expect(result.current.totalQuestions).toBe(2)
    })

    it('should use selectedQuestionCount when starting the quiz', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.selectQuestionCount(3)
        result.current.startQuiz(mockRawQuestions)
      })

      expect(result.current.questions).toHaveLength(3)
      expect(result.current.totalQuestions).toBe(3)
    })

    it('should use selected difficulty when starting the quiz', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.startQuiz(mockRawQuestions)
        result.current.selectDifficulty(DIFFICULTY.DIFFICULT)
      })

      expect(result.current.difficulty).toEqual(DIFFICULTY.DIFFICULT)
    })


    it('should default to 40 questions when count not specified', () => {
      const manyQuestions = Array(45).fill(null).map((_, i) => ({
        question: `Question ${i}`,
        theme: "Theme",
        correctAnswers: ["Correct"],
        wrongAnswers: ["Wrong 1", "Wrong 2"]
      }))

      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.startQuiz(manyQuestions)
      })

      expect(result.current.questions).toHaveLength(40)
    })

    it('should set current question correctly', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.selectQuestionCount(3)
        result.current.startQuiz(mockRawQuestions)
      })

      expect(result.current.currentQuestion).toBeTruthy()
      expect(result.current.currentQuestion).toHaveProperty('id')
      expect(result.current.currentQuestion).toHaveProperty('question')
      expect(result.current.currentQuestion).toHaveProperty('answers')
    })

    it('should reset state when restarting new quiz', () => {
      const { result } = renderHook(() => useQuiz())

      // Start first quiz
      act(() => {
        result.current.selectQuestionCount(2)
        result.current.selectDifficulty(DIFFICULTY.DIFFICULT)
        result.current.startQuiz(mockRawQuestions)
      })

      // Select answer and submit
      const firstAnswerId = result.current.currentQuestion.answers[0].id
      act(() => {
        result.current.selectAnswer([firstAnswerId])
        result.current.submitAnswer()
      })

      // Start new quiz
      act(() => {
        result.current.selectQuestionCount(2)
        result.current.restartQuiz(mockRawQuestions)
      })

      expect(result.current.currentQuestionIndex).toBe(0)
      expect(result.current.score).toBe(0)
      expect(result.current.userAnswers).toEqual([])
      expect(result.current.selectedAnswers).toEqual([])
      expect(result.current.difficulty).toEqual(DIFFICULTY.NORMAL)
    })

    it('should reflect updated question count after changing selection', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.selectQuestionCount(2)
        result.current.startQuiz(mockRawQuestions)
      })

      expect(result.current.totalQuestions).toBe(2)

      act(() => {
        result.current.restartQuiz()
        result.current.selectQuestionCount(3)
        result.current.startQuiz(mockRawQuestions)
      })

      expect(result.current.totalQuestions).toBe(3)
    })

    it('should reflect updated difficulty after changing selection', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.selectQuestionCount(2)
        result.current.selectDifficulty(DIFFICULTY.NORMAL)
        result.current.startQuiz(mockRawQuestions)
      })

      expect(result.current.difficulty).toEqual(DIFFICULTY.NORMAL)

      act(() => {
        result.current.restartQuiz()
        result.current.startQuiz(mockRawQuestions)
        result.current.selectDifficulty(DIFFICULTY.DIFFICULT)
      })

      expect(result.current.difficulty).toEqual(DIFFICULTY.DIFFICULT)
    })
  })

  describe('SELECT_QUESTION_COUNT action', () => {
    it('should set selectedQuestionCount', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.selectQuestionCount(40)
      })

      expect(result.current.selectedQuestionCount).toBe(40)
    })

    it('should allow changing selectedQuestionCount', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.selectQuestionCount(20)
      })

      expect(result.current.selectedQuestionCount).toBe(20)

      act(() => {
        result.current.selectQuestionCount(80)
      })

      expect(result.current.selectedQuestionCount).toBe(80)
    })
  })

  describe('SELECT_DIFFICULTY action', () => {
    it('should allow changing selected difficulty', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.selectDifficulty(DIFFICULTY.DIFFICULT)
      })

      expect(result.current.difficulty).toEqual(DIFFICULTY.DIFFICULT)

      act(() => {
        result.current.selectDifficulty(DIFFICULTY.NORMAL)
      })

      expect(result.current.difficulty).toEqual(DIFFICULTY.NORMAL)
    })
  })


  describe('SELECT_ANSWER action', () => {
    it('should select an answer', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.selectQuestionCount(2)
        result.current.startQuiz(mockRawQuestions)
      })

      const answerId = 'test-answer-id'

      act(() => {
        result.current.selectAnswer([answerId])
      })

      expect(result.current.selectedAnswers).toEqual([answerId])
      expect(result.current.hasAnswerSelected).toBe(true)
    })

    it('should allow changing selected answer', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.selectQuestionCount(2)
        result.current.startQuiz(mockRawQuestions)
      })

      act(() => {
        result.current.selectAnswer(['answer-1'])
      })

      expect(result.current.selectedAnswers).toEqual(['answer-1'])

      act(() => {
        result.current.selectAnswer(['answer-2'])
      })

      expect(result.current.selectedAnswers).toEqual(['answer-2'])
    })
  })

  describe('SUBMIT_ANSWER action', () => {
    it('should increment score for correct answer', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.selectQuestionCount(3)
        result.current.startQuiz(mockRawQuestions)
      })

      // Find correct answer
      const correctAnswer = result.current.currentQuestion.answers.find(
        a => a.isCorrect
      )

      act(() => {
        result.current.selectAnswer([correctAnswer.id])
        result.current.submitAnswer()
      })

      expect(result.current.score).toBe(1)
      expect(result.current.userAnswers).toHaveLength(1)
      expect(result.current.userAnswers[0].isCorrect).toBe(true)
    })

    it('should not increment score for wrong answer', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.selectQuestionCount(3)
        result.current.startQuiz(mockRawQuestions)
      })

      // Find wrong answer
      const wrongAnswer = result.current.currentQuestion.answers.find(
        a => !a.isCorrect
      )

      act(() => {
        result.current.selectAnswer([wrongAnswer.id])
        result.current.submitAnswer()
      })

      expect(result.current.score).toBe(0)
      expect(result.current.userAnswers).toHaveLength(1)
      expect(result.current.userAnswers[0].isCorrect).toBe(false)
    })

    it('should move to next question', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.selectQuestionCount(3)
        result.current.startQuiz(mockRawQuestions)
      })

      expect(result.current.currentQuestionIndex).toBe(0)

      const answerId = result.current.currentQuestion.answers[0].id

      act(() => {
        result.current.selectAnswer([answerId])
        result.current.submitAnswer()
        result.current.goToNextQuestion()
      })

      expect(result.current.currentQuestionIndex).toBe(1)
    })

    it('should reset selectedAnswers when moving to next question', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.selectQuestionCount(3)
        result.current.startQuiz(mockRawQuestions)
      })

      const answerId = result.current.currentQuestion.answers[0].id

      act(() => {
        result.current.selectAnswer([answerId])
        result.current.submitAnswer()
      })

      expect(result.current.selectedAnswers).not.toEqual([])
      expect(result.current.hasAnswerSelected).toBe(true)

      act(() => {
        result.current.goToNextQuestion()
      })
      expect(result.current.selectedAnswers).toEqual([])
      expect(result.current.hasAnswerSelected).toBe(false)
    })

    it('should store user answer with question ID and correctness', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.selectQuestionCount(3)
        result.current.startQuiz(mockRawQuestions)
      })

      const questionId = result.current.currentQuestion.id
      const answerId = result.current.currentQuestion.answers[0].id

      act(() => {
        result.current.selectAnswer([answerId])
        result.current.submitAnswer()
      })

      expect(result.current.userAnswers[0]).toEqual({
        questionId,
        answerIds: [answerId],
        isCorrect: expect.any(Boolean)
      })
    })

    it('should complete quiz on last question', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.selectQuestionCount(2)
        result.current.startQuiz(mockRawQuestions)
      })

      // Answer first question
      act(() => {
        const answerId = result.current.currentQuestion.answers[0].id
        result.current.selectAnswer([answerId])
        result.current.submitAnswer()
      })

      expect(result.current.quizStatus).toBe(QUIZ_STATUS.REVIEWING_ANSWER)
      act(() =>{
        result.current.goToNextQuestion()
      })

      expect(result.current.quizStatus).toBe(QUIZ_STATUS.ANSWERING)

      // Answer second (last) question
      act(() => {
        const answerId = result.current.currentQuestion.answers[0].id
        result.current.selectAnswer([answerId])
        result.current.submitAnswer()
      })
      expect(result.current.quizStatus).toBe(QUIZ_STATUS.REVIEWING_ANSWER)

      act(() =>{
        result.current.goToNextQuestion()
      })

      expect(result.current.quizStatus).toBe(QUIZ_STATUS.COMPLETED)
      expect(result.current.userAnswers).toHaveLength(2)
    })

    it('should not increment currentQuestionIndex on last question', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.selectQuestionCount(2)
        result.current.startQuiz(mockRawQuestions)
      })

      // Answer first question
      act(() => {
        const answerId = result.current.currentQuestion.answers[0].id
        result.current.selectAnswer([answerId])
        result.current.submitAnswer()
        result.current.goToNextQuestion()
      })

      expect(result.current.currentQuestionIndex).toBe(1)

      // Answer last question
      act(() => {
        const answerId = result.current.currentQuestion.answers[0].id
        result.current.selectAnswer([answerId])
        result.current.submitAnswer()
        result.current.goToNextQuestion()
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
        result.current.selectQuestionCount(2)
        result.current.startQuiz(mockRawQuestions)
      })

      act(() => {
        const answerId = result.current.currentQuestion.answers[0].id
        result.current.selectAnswer([answerId])
        result.current.submitAnswer()
      })

      // Restart
      act(() => {
        result.current.restartQuiz()
      })

      expect(result.current.quizStatus).toBe(QUIZ_STATUS.CONFIGURING)
      expect(result.current.questions).toEqual([])
      expect(result.current.currentQuestionIndex).toBe(0)
      expect(result.current.selectedAnswers).toEqual([])
      expect(result.current.userAnswers).toEqual([])
      expect(result.current.score).toBe(0)
      expect(result.current.currentQuestion).toBe(null)
      expect(result.current.selectedQuestionCount).toBe(40)
    })

    it('should allow starting new quiz after restart', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.selectQuestionCount(2)
        result.current.startQuiz(mockRawQuestions)
      })

      act(() => {
        result.current.restartQuiz()
      })

      act(() => {
        result.current.selectQuestionCount(3)
        result.current.startQuiz(mockRawQuestions)
      })

      expect(result.current.quizStatus).toBe(QUIZ_STATUS.ANSWERING)
      expect(result.current.questions).toHaveLength(3)
    })
  })

  describe('complete quiz flow', () => {
    it('should handle full quiz completion', () => {
      const { result } = renderHook(() => useQuiz())

      // Start quiz with 3 questions
      act(() => {
        result.current.selectQuestionCount(3)
        result.current.startQuiz(mockRawQuestions)
      })

      expect(result.current.quizStatus).toBe(QUIZ_STATUS.ANSWERING)

      // Answer all 3 questions
      for (let i = 0; i < 3; i++) {
        const correctAnswer = result.current.currentQuestion.answers.find(
          a => a.isCorrect
        )

        act(() => {
          result.current.selectAnswer([correctAnswer.id])
          result.current.submitAnswer()
          result.current.goToNextQuestion()
        })
      }

      expect(result.current.quizStatus).toBe(QUIZ_STATUS.COMPLETED)
      expect(result.current.score).toBe(3)
      expect(result.current.userAnswers).toHaveLength(3)
    })

    it('should track mixed correct and wrong answers', () => {
      const { result } = renderHook(() => useQuiz())

      act(() => {
        result.current.selectQuestionCount(3)
        result.current.startQuiz(mockRawQuestions)
      })

      // Answer 1: Correct
      act(() => {
        const correctAnswer = result.current.currentQuestion.answers.find(
          a => a.isCorrect
        )
        result.current.selectAnswer([correctAnswer.id])
        result.current.submitAnswer()
      })

      // Answer 2: Wrong
      act(() => {
        const wrongAnswer = result.current.currentQuestion.answers.find(
          a => !a.isCorrect
        )
        result.current.selectAnswer([wrongAnswer.id])
        result.current.submitAnswer()
      })

      // Answer 3: Correct
      act(() => {
        const correctAnswer = result.current.currentQuestion.answers.find(
          a => a.isCorrect
        )
        result.current.selectAnswer([correctAnswer.id])
        result.current.submitAnswer()
      })

      expect(result.current.score).toBe(2)
      expect(result.current.userAnswers[0].isCorrect).toBe(true)
      expect(result.current.userAnswers[1].isCorrect).toBe(false)
      expect(result.current.userAnswers[2].isCorrect).toBe(true)
    })
  })
})

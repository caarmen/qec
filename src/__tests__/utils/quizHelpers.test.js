import { describe, it, expect } from 'vitest'
import {
  isAnswerCorrect,
  calculateScore,
  calculatePercentage,
  hasAnswerSelected,
  isLastQuestion,
  getNextQuestionIndex,
  formatResults
} from '../../utils/quizHelpers'

describe('quizHelpers', () => {
  describe('isAnswerCorrect', () => {
    const mockQuestion = {
      id: 'q1',
      question: 'Test question',
      answers: [
        { id: 'q1-a0', text: 'Correct answer', isCorrect: true },
        { id: 'q1-a1', text: 'Wrong answer 1', isCorrect: false },
        { id: 'q1-a2', text: 'Wrong answer 2', isCorrect: false }
      ]
    }

    it('should return true for correct answer', () => {
      const result = isAnswerCorrect(mockQuestion, 'q1-a0')
      expect(result).toBe(true)
    })

    it('should return false for wrong answer', () => {
      const result = isAnswerCorrect(mockQuestion, 'q1-a1')
      expect(result).toBe(false)
    })

    it('should return false for non-existent answer ID', () => {
      const result = isAnswerCorrect(mockQuestion, 'invalid-id')
      expect(result).toBe(false)
    })

    it('should return false for null question', () => {
      const result = isAnswerCorrect(null, 'q1-a0')
      expect(result).toBe(false)
    })

    it('should return false for null answer ID', () => {
      const result = isAnswerCorrect(mockQuestion, null)
      expect(result).toBe(false)
    })

    it('should return false for undefined answer ID', () => {
      const result = isAnswerCorrect(mockQuestion, undefined)
      expect(result).toBe(false)
    })
  })

  describe('calculateScore', () => {
    it('should count correct answers', () => {
      const userAnswers = [
        { questionId: 'q1', answerId: 'a1', isCorrect: true },
        { questionId: 'q2', answerId: 'a2', isCorrect: false },
        { questionId: 'q3', answerId: 'a3', isCorrect: true },
        { questionId: 'q4', answerId: 'a4', isCorrect: true }
      ]

      const score = calculateScore(userAnswers)
      expect(score).toBe(3)
    })

    it('should return 0 for all wrong answers', () => {
      const userAnswers = [
        { questionId: 'q1', answerId: 'a1', isCorrect: false },
        { questionId: 'q2', answerId: 'a2', isCorrect: false }
      ]

      const score = calculateScore(userAnswers)
      expect(score).toBe(0)
    })

    it('should return total for all correct answers', () => {
      const userAnswers = [
        { questionId: 'q1', answerId: 'a1', isCorrect: true },
        { questionId: 'q2', answerId: 'a2', isCorrect: true }
      ]

      const score = calculateScore(userAnswers)
      expect(score).toBe(2)
    })

    it('should return 0 for empty array', () => {
      const score = calculateScore([])
      expect(score).toBe(0)
    })

    it('should return 0 for null input', () => {
      const score = calculateScore(null)
      expect(score).toBe(0)
    })

    it('should return 0 for undefined input', () => {
      const score = calculateScore(undefined)
      expect(score).toBe(0)
    })

    it('should return 0 for non-array input', () => {
      const score = calculateScore('not an array')
      expect(score).toBe(0)
    })
  })

  describe('calculatePercentage', () => {
    it('should calculate correct percentage', () => {
      expect(calculatePercentage(7, 10)).toBe(70)
      expect(calculatePercentage(5, 10)).toBe(50)
      expect(calculatePercentage(10, 10)).toBe(100)
    })

    it('should round to nearest integer', () => {
      expect(calculatePercentage(1, 3)).toBe(33) // 33.33...
      expect(calculatePercentage(2, 3)).toBe(67) // 66.66...
    })

    it('should return 0 for zero correct answers', () => {
      expect(calculatePercentage(0, 10)).toBe(0)
    })

    it('should return 100 for perfect score', () => {
      expect(calculatePercentage(10, 10)).toBe(100)
    })

    it('should return 0 for zero total questions', () => {
      expect(calculatePercentage(5, 0)).toBe(0)
    })

    it('should return 0 for null total questions', () => {
      expect(calculatePercentage(5, null)).toBe(0)
    })

    it('should return 0 for negative total questions', () => {
      expect(calculatePercentage(5, -10)).toBe(0)
    })
  })

  describe('hasAnswerSelected', () => {
    it('should return true for valid answer ID', () => {
      expect(hasAnswerSelected('q1-a0')).toBe(true)
      expect(hasAnswerSelected('some-id')).toBe(true)
    })

    it('should return false for null', () => {
      expect(hasAnswerSelected(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(hasAnswerSelected(undefined)).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(hasAnswerSelected('')).toBe(false)
    })

    it('should return true for number zero (edge case)', () => {
      // In case answer IDs could be numbers
      expect(hasAnswerSelected(0)).toBe(true)
    })
  })

  describe('isLastQuestion', () => {
    it('should return true for last question', () => {
      expect(isLastQuestion(9, 10)).toBe(true)
      expect(isLastQuestion(4, 5)).toBe(true)
      expect(isLastQuestion(0, 1)).toBe(true)
    })

    it('should return false for not last question', () => {
      expect(isLastQuestion(0, 10)).toBe(false)
      expect(isLastQuestion(5, 10)).toBe(false)
      expect(isLastQuestion(8, 10)).toBe(false)
    })

    it('should return false for first question', () => {
      expect(isLastQuestion(0, 10)).toBe(false)
    })

    it('should handle single question quiz', () => {
      expect(isLastQuestion(0, 1)).toBe(true)
    })
  })

  describe('getNextQuestionIndex', () => {
    it('should increment index for non-last question', () => {
      expect(getNextQuestionIndex(0, 10)).toBe(1)
      expect(getNextQuestionIndex(5, 10)).toBe(6)
      expect(getNextQuestionIndex(8, 10)).toBe(9)
    })

    it('should not increment on last question', () => {
      expect(getNextQuestionIndex(9, 10)).toBe(9)
      expect(getNextQuestionIndex(4, 5)).toBe(4)
    })

    it('should handle first question', () => {
      expect(getNextQuestionIndex(0, 10)).toBe(1)
    })

    it('should handle single question quiz', () => {
      expect(getNextQuestionIndex(0, 1)).toBe(0)
    })
  })

  describe('formatResults', () => {
    it('should format results correctly', () => {
      const results = formatResults(7, 10)
      
      expect(results).toEqual({
        score: 7,
        total: 10,
        percentage: 70,
        correctAnswers: 7,
        totalQuestions: 10
      })
    })

    it('should format perfect score', () => {
      const results = formatResults(10, 10)
      
      expect(results).toEqual({
        score: 10,
        total: 10,
        percentage: 100,
        correctAnswers: 10,
        totalQuestions: 10
      })
    })

    it('should format zero score', () => {
      const results = formatResults(0, 10)
      
      expect(results).toEqual({
        score: 0,
        total: 10,
        percentage: 0,
        correctAnswers: 0,
        totalQuestions: 10
      })
    })

    it('should handle partial scores with rounding', () => {
      const results = formatResults(1, 3)
      
      expect(results.percentage).toBe(33) // Rounded
      expect(results.score).toBe(1)
      expect(results.total).toBe(3)
    })
  })
})
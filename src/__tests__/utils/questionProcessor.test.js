import { describe, it, expect, beforeEach } from 'vitest'
import { shuffleArray, formatQuestion, processQuestions } from '../../utils/questionProcessor'

describe('questionProcessor', () => {
  describe('shuffleArray', () => {
    it('should return a new array with same length', () => {
      const original = [1, 2, 3, 4, 5]
      const shuffled = shuffleArray(original)
      
      expect(shuffled).toHaveLength(original.length)
      expect(shuffled).not.toBe(original) // Different reference
    })

    it('should contain all original elements', () => {
      const original = [1, 2, 3, 4, 5]
      const shuffled = shuffleArray(original)
      
      expect(shuffled.sort()).toEqual(original.sort())
    })

    it('should handle empty array', () => {
      const result = shuffleArray([])
      expect(result).toEqual([])
    })

    it('should handle single element array', () => {
      const result = shuffleArray([1])
      expect(result).toEqual([1])
    })

    it('should actually shuffle (probabilistic test)', () => {
      const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      let wasShuffled = false
      
      // Run multiple times to check if shuffling occurs
      for (let i = 0; i < 10; i++) {
        const shuffled = shuffleArray(original)
        if (JSON.stringify(shuffled) !== JSON.stringify(original)) {
          wasShuffled = true
          break
        }
      }
      
      expect(wasShuffled).toBe(true)
    })
  })

  describe('formatQuestion', () => {
    const mockRawQuestion = {
      question: "Quelle est la capitale de la France ?",
      theme: "Géographie",
      correctAnswers: ["Paris"],
      wrongAnswers: ["Lyon", "Marseille", "Toulouse"]
    }

    it('should format question with correct structure', () => {
      const formatted = formatQuestion(mockRawQuestion, 0)
      
      expect(formatted).toHaveProperty('id')
      expect(formatted).toHaveProperty('question')
      expect(formatted).toHaveProperty('theme')
      expect(formatted).toHaveProperty('answers')
      expect(formatted.id).toBe('question-0')
      expect(formatted.question).toBe(mockRawQuestion.question)
      expect(formatted.theme).toBe(mockRawQuestion.theme)
    })

    it('should combine correct and wrong answers', () => {
      const formatted = formatQuestion(mockRawQuestion, 0)
      
      expect(formatted.answers).toHaveLength(4) // 1 correct + 3 wrong
    })

    it('should mark correct answers with isCorrect: true', () => {
      const formatted = formatQuestion(mockRawQuestion, 0)
      
      const correctAnswers = formatted.answers.filter(a => a.isCorrect)
      expect(correctAnswers).toHaveLength(1)
      expect(correctAnswers[0].text).toBe("Paris")
    })

    it('should mark wrong answers with isCorrect: false', () => {
      const formatted = formatQuestion(mockRawQuestion, 0)
      
      const wrongAnswers = formatted.answers.filter(a => !a.isCorrect)
      expect(wrongAnswers).toHaveLength(3)
    })

    it('should add unique IDs to each answer', () => {
      const formatted = formatQuestion(mockRawQuestion, 0)
      
      const ids = formatted.answers.map(a => a.id)
      const uniqueIds = new Set(ids)
      
      expect(uniqueIds.size).toBe(ids.length)
      expect(ids[0]).toMatch(/^q0-a\d+$/)
    })

    it('should handle multiple correct answers', () => {
      const multiCorrectQuestion = {
        question: "Test question",
        theme: "Test",
        correctAnswers: ["Answer 1", "Answer 2"],
        wrongAnswers: ["Wrong 1", "Wrong 2"]
      }
      
      const formatted = formatQuestion(multiCorrectQuestion, 0)
      const correctAnswers = formatted.answers.filter(a => a.isCorrect)
      
      expect(correctAnswers).toHaveLength(2)
      expect(formatted.answers).toHaveLength(4)
    })
  })

  describe('processQuestions', () => {
    const mockQuestions = [
      {
        question: "Question 1",
        theme: "Theme 1",
        correctAnswers: ["Correct 1"],
        wrongAnswers: ["Wrong 1", "Wrong 2"]
      },
      {
        question: "Question 2",
        theme: "Theme 2",
        correctAnswers: ["Correct 2"],
        wrongAnswers: ["Wrong 3", "Wrong 4"]
      },
      {
        question: "Question 3",
        theme: "Theme 3",
        correctAnswers: ["Correct 3"],
        wrongAnswers: ["Wrong 5", "Wrong 6"]
      }
    ]

    it('should return empty array for invalid input', () => {
      expect(processQuestions(null)).toEqual([])
      expect(processQuestions(undefined)).toEqual([])
      expect(processQuestions("not an array")).toEqual([])
    })

    it('should return empty array for empty input', () => {
      expect(processQuestions([])).toEqual([])
    })

    it('should return requested number of questions', () => {
      const result = processQuestions(mockQuestions, 2)
      expect(result).toHaveLength(2)
    })

    it('should default to 10 questions when count not specified', () => {
      const manyQuestions = Array(15).fill(null).map((_, i) => ({
        question: `Question ${i}`,
        theme: "Theme",
        correctAnswers: ["Correct"],
        wrongAnswers: ["Wrong 1", "Wrong 2"]
      }))
      
      const result = processQuestions(manyQuestions)
      expect(result).toHaveLength(10)
    })

    it('should return all questions if count exceeds available', () => {
      const result = processQuestions(mockQuestions, 100)
      expect(result).toHaveLength(3)
    })

    it('should format all questions correctly', () => {
      const result = processQuestions(mockQuestions, 2)
      
      result.forEach(question => {
        expect(question).toHaveProperty('id')
        expect(question).toHaveProperty('question')
        expect(question).toHaveProperty('theme')
        expect(question).toHaveProperty('answers')
        expect(Array.isArray(question.answers)).toBe(true)
      })
    })

    it('should generate unique question IDs', () => {
      const result = processQuestions(mockQuestions, 3)
      const ids = result.map(q => q.id)
      const uniqueIds = new Set(ids)
      
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should shuffle questions (probabilistic test)', () => {
      const orderedQuestions = Array(10).fill(null).map((_, i) => ({
        question: `Question ${i}`,
        theme: "Theme",
        correctAnswers: [`Correct ${i}`],
        wrongAnswers: ["Wrong 1", "Wrong 2"]
      }))
      
      let wasShuffled = false
      
      for (let i = 0; i < 5; i++) {
        const result = processQuestions(orderedQuestions, 10)
        const firstQuestion = result[0].question
        
        if (firstQuestion !== "Question 0") {
          wasShuffled = true
          break
        }
      }
      
      expect(wasShuffled).toBe(true)
    })
  })
})
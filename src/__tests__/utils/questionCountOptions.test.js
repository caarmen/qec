import { describe, it, expect } from 'vitest'
import {
  QUESTION_COUNT_OPTIONS,
  getAvailableQuestionCountOptions
} from '../../utils/questionCountOptions'

describe('questionCountOptions', () => {
  describe('getAvailableQuestionCountOptions', () => {
    it('returns options filtered by pool size with default 40 when available', () => {
      const result = getAvailableQuestionCountOptions(50)

      expect(result).toEqual({
        options: [10, 20, 40],
        defaultValue: 40
      })
    })

    it('returns first available option as default when 40 is not available', () => {
      const result = getAvailableQuestionCountOptions(15)

      expect(result).toEqual({
        options: [10],
        defaultValue: 10
      })
    })

    it('returns empty options and null default when no options fit the pool size', () => {
      const result = getAvailableQuestionCountOptions(5)

      expect(result).toEqual({
        options: [],
        defaultValue: null
      })
    })

    it('throws when totalQuestions is invalid', () => {
      expect(() => getAvailableQuestionCountOptions(0)).toThrow(
        'totalQuestions must be a positive, finite number'
      )
      expect(() => getAvailableQuestionCountOptions(-10)).toThrow(
        'totalQuestions must be a positive, finite number'
      )
      expect(() => getAvailableQuestionCountOptions(Number.NaN)).toThrow(
        'totalQuestions must be a positive, finite number'
      )
    })

    it('throws when options contain invalid values', () => {
      expect(() =>
        getAvailableQuestionCountOptions(50, [10, 20, Number.NaN])
      ).toThrow('options must contain only positive, finite numbers')

      expect(() =>
        getAvailableQuestionCountOptions(50, [10, 0, 40])
      ).toThrow('options must contain only positive, finite numbers')

      expect(() =>
        getAvailableQuestionCountOptions(50, [10, -20, 40])
      ).toThrow('options must contain only positive, finite numbers')
    })

    it('accepts custom options and keeps order', () => {
      const result = getAvailableQuestionCountOptions(30, [5, 15, 25, 35])

      expect(result).toEqual({
        options: [5, 15, 25],
        defaultValue: 5
      })
    })
  })

  describe('QUESTION_COUNT_OPTIONS', () => {
    it('exposes the default question count options', () => {
      expect(QUESTION_COUNT_OPTIONS).toEqual([10, 20, 40, 80])
    })
  })
})

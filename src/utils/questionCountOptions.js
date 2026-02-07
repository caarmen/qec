/**
 * Question count options configuration
 * @module questionCountOptions
 */

/**
 * Default set of question count options
 * @constant {number[]}
 */
export const QUESTION_COUNT_OPTIONS = [10, 20, 40, 80]

/**
 * Calculates available question count options based on pool size
 * @param {number} totalQuestions - Total number of questions in the pool
 * @param {number[]} [options=QUESTION_COUNT_OPTIONS] - Candidate options to filter
 * @returns {{ options: number[], defaultValue: number | null }}
 */
export function getAvailableQuestionCountOptions(
  totalQuestions,
  options = QUESTION_COUNT_OPTIONS
) {
  if (!Number.isFinite(totalQuestions) || totalQuestions <= 0) {
    throw new Error('totalQuestions must be a positive, finite number')
  }

  const invalidOption = options.find(
    (value) => !Number.isFinite(value) || value <= 0
  )

  if (invalidOption !== undefined) {
    throw new Error('options must contain only positive, finite numbers')
  }

  const availableOptions = options.filter((value) => value <= totalQuestions)

  const defaultValue = availableOptions.includes(40)
    ? 40
    : availableOptions[0] ?? null

  return { options: availableOptions, defaultValue }
}

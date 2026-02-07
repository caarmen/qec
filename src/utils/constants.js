/**
 * Quiz configuration constants
 * @module constants
 */

/**
 * Default number of questions to show in a quiz
 * @constant {number}
 */
export const DEFAULT_QUESTION_COUNT = 40

/**
 * Quiz status values (re-exported from useQuiz for convenience)
 * @constant {Object}
 */
export { QUIZ_STATUS } from '../hooks/useQuiz'

/**
 * Score thresholds for performance evaluation
 * Can be used for displaying different messages based on score
 * @constant {Object}
 * @property {number} EXCELLENT - 90% or higher
 * @property {number} GOOD - 70% or higher
 * @property {number} PASS - 50% or higher
 */
export const SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
  PASS: 50
}

/**
 * Maximum card width for responsive design
 * @constant {string}
 */
export const MAX_CARD_WIDTH = 'max-w-md'

/**
 * Mobile padding for responsive layout
 * @constant {string}
 */
export const MOBILE_PADDING = 'px-4'

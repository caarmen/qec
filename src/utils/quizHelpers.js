/**
 * Checks if a selected answer is correct
 * @param {Object} question - The question object containing answers array
 * @param {string} selectedAnswerId - The ID of the selected answer
 * @returns {boolean} - True if answer is correct, false otherwise
 * @example
 * isAnswerCorrect(question, 'q1-a0') // true or false
 */
export function isAnswerCorrect(question, selectedAnswerId) {
  if (!question || !selectedAnswerId) {
    return false
  }

  const selectedAnswer = question.answers.find(
    answer => answer.id === selectedAnswerId
  )

  return selectedAnswer ? selectedAnswer.isCorrect : false
}

/**
 * Calculates the total score from user answers
 * @param {Array<Object>} userAnswers - Array of user answer objects with isCorrect property
 * @returns {number} - Total number of correct answers
 * @example
 * calculateScore([{isCorrect: true}, {isCorrect: false}]) // 1
 */
export function calculateScore(userAnswers) {
  if (!userAnswers || !Array.isArray(userAnswers)) {
    return 0
  }

  return userAnswers.filter(answer => answer.isCorrect).length
}

/**
 * Calculates percentage score rounded to nearest integer
 * @param {number} correctAnswers - Number of correct answers
 * @param {number} totalQuestions - Total number of questions
 * @returns {number} - Percentage score (0-100)
 * @example
 * calculatePercentage(7, 10) // 70
 */
export function calculatePercentage(correctAnswers, totalQuestions) {
  if (!totalQuestions || totalQuestions <= 0) {
    return 0
  }

  return Math.round((correctAnswers / totalQuestions) * 100)
}

/**
 * Validates if an answer has been selected
 * @param {string|null|undefined} selectedAnswer - The selected answer ID
 * @returns {boolean} - True if answer is selected, false otherwise
 * @example
 * hasAnswerSelected('q1-a0') // true
 * hasAnswerSelected(null) // false
 */
export function hasAnswerSelected(selectedAnswer) {
  return selectedAnswer !== null && selectedAnswer !== undefined && selectedAnswer !== ''
}

/**
 * Checks if the current question is the last question in the quiz
 * @param {number} currentIndex - Current question index (0-based)
 * @param {number} totalQuestions - Total number of questions
 * @returns {boolean} - True if on last question, false otherwise
 * @example
 * isLastQuestion(9, 10) // true
 * isLastQuestion(5, 10) // false
 */
export function isLastQuestion(currentIndex, totalQuestions) {
  return currentIndex === totalQuestions - 1
}

/**
 * Gets the next question index, capped at the last question
 * @param {number} currentIndex - Current question index (0-based)
 * @param {number} totalQuestions - Total number of questions
 * @returns {number} - Next question index (same index if already at last question)
 * @example
 * getNextQuestionIndex(0, 10) // 1
 * getNextQuestionIndex(9, 10) // 9 (stays at last)
 */
export function getNextQuestionIndex(currentIndex, totalQuestions) {
  if (isLastQuestion(currentIndex, totalQuestions)) {
    return currentIndex
  }
  return currentIndex + 1
}

/**
 * Formats quiz results for display
 * @param {number} score - Number of correct answers
 * @param {number} total - Total number of questions
 * @returns {Object} - Formatted results object with score, total, percentage, etc.
 * @example
 * formatResults(7, 10) 
 * // { score: 7, total: 10, percentage: 70, correctAnswers: 7, totalQuestions: 10 }
 */
export function formatResults(score, total) {
  return {
    score,
    total,
    percentage: calculatePercentage(score, total),
    correctAnswers: score,
    totalQuestions: total
  }
}
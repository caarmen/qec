/**
 * Checks if a selected answer is correct
 * @param {Object} question - The question object
 * @param {string} selectedAnswerId - The ID of the selected answer
 * @returns {boolean} - True if answer is correct, false otherwise
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
 * Calculates the total score
 * @param {Array} userAnswers - Array of user answer objects
 * @returns {number} - Total number of correct answers
 */
export function calculateScore(userAnswers) {
  if (!userAnswers || !Array.isArray(userAnswers)) {
    return 0
  }

  return userAnswers.filter(answer => answer.isCorrect).length
}

/**
 * Calculates percentage score
 * @param {number} correctAnswers - Number of correct answers
 * @param {number} totalQuestions - Total number of questions
 * @returns {number} - Percentage score (0-100)
 */
export function calculatePercentage(correctAnswers, totalQuestions) {
  if (!totalQuestions || totalQuestions <= 0) {
    return 0
  }

  return Math.round((correctAnswers / totalQuestions) * 100)
}

/**
 * Validates if an answer has been selected
 * @param {string|null} selectedAnswer - The selected answer ID
 * @returns {boolean} - True if answer is selected, false otherwise
 */
export function hasAnswerSelected(selectedAnswer) {
  return selectedAnswer !== null && selectedAnswer !== undefined && selectedAnswer !== ''
}

/**
 * Checks if quiz is on the last question
 * @param {number} currentIndex - Current question index
 * @param {number} totalQuestions - Total number of questions
 * @returns {boolean} - True if on last question, false otherwise
 */
export function isLastQuestion(currentIndex, totalQuestions) {
  return currentIndex === totalQuestions - 1
}

/**
 * Gets the next question index
 * @param {number} currentIndex - Current question index
 * @param {number} totalQuestions - Total number of questions
 * @returns {number} - Next question index (capped at total)
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
 * @returns {Object} - Formatted results object
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
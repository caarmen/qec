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

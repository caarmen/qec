/**
 * Checks if the provided selectedAnswerIds match exactly all the expected
 * correct answer ids for the given question.
 * @param {Object} question - The question object containing answers array
 * @param {Array<string>} selectedAnswerIds - The IDs of the selected answers
 * @returns {boolean} - True if answer is correct, false otherwise
 * @example
 * isAnswerCorrect(question, ['q1-a0', 'q1-a3']) // true or false
 */
export function isAnswerCorrect(question, selectedAnswerIds) {
  if (!question || !selectedAnswerIds) {
    return false
  }

  const expectedCorrectAnswerIds = question.answers.filter(answer => answer.isCorrect).map(answer => answer.id)
  return expectedCorrectAnswerIds.length == selectedAnswerIds.length &&
    expectedCorrectAnswerIds.every((v) => selectedAnswerIds.includes(v))
}

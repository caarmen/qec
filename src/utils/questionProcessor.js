/**
 * Shuffles an array using the Fisher-Yates algorithm
 * This creates a new array and does not mutate the original
 * @param {Array} array - Array to shuffle
 * @returns {Array} - New shuffled array with same elements
 * @example
 * shuffleArray([1, 2, 3, 4, 5]) // [3, 1, 5, 2, 4]
 */
export function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Formats a raw question object into quiz format with mixed and shuffled answers
 * Combines correct and wrong answers, shuffles them, and adds unique IDs
 * @param {Object} rawQuestion - Question from questions.json
 * @param {string} rawQuestion.question - The question text
 * @param {string} rawQuestion.theme - The question theme/category
 * @param {Array<string>} rawQuestion.correctAnswers - Array of correct answer texts
 * @param {Array<string>} rawQuestion.wrongAnswers - Array of wrong answer texts
 * @param {number} index - Question index for ID generation
 * @returns {Object} - Formatted question with id, question, theme, and shuffled answers array
 * @example
 * formatQuestion({
 *   question: "What is 2+2?",
 *   theme: "Math",
 *   correctAnswers: ["4"],
 *   wrongAnswers: ["3", "5"]
 * }, 0)
 * // { id: 'question-0', question: "What is 2+2?", theme: "Math", answers: [...] }
 */
export function formatQuestion(rawQuestion, index) {
  // Combine correct and wrong answers
  // Take only one of the possible correct answers.
  // In the future, we may choose multiple correct answers.
  const correctAnswers = shuffleArray(rawQuestion.correctAnswers).slice(0, 1);

  // Take only up to 3 of the possible wrong answers.
  const wrongAnswers = shuffleArray(rawQuestion.wrongAnswers).slice(0, 3);

  const allAnswers = [
    ...correctAnswers.map(text => ({ text, isCorrect: true })),
    ...wrongAnswers.map(text => ({ text, isCorrect: false }))
  ]

  // Shuffle answers and add IDs
  const shuffledAnswers = shuffleArray(allAnswers).map((answer, idx) => ({
    id: `q${index}-a${idx}`,
    text: answer.text,
    isCorrect: answer.isCorrect
  }))

  return {
    id: `question-${index}`,
    question: rawQuestion.question,
    theme: rawQuestion.theme,
    answers: shuffledAnswers
  }
}

/**
 * Processes raw questions data for quiz use
 * Shuffles the question pool, selects a subset, and formats each question
 * @param {Array<Object>} rawQuestions - Questions from questions.json
 * @param {number} count - Number of questions to select
 * @returns {Array<Object>} - Formatted and shuffled questions ready for quiz
 * @example
 * processQuestions(rawQuestions, 10)
 * // Returns 10 randomly selected and formatted questions
 */
export function processQuestions(rawQuestions, count) {
  if (!rawQuestions || !Array.isArray(rawQuestions)) {
    return []
  }

  // Shuffle all questions and take the requested count
  const shuffledQuestions = shuffleArray(rawQuestions).slice(0, count)

  // Format each question
  return shuffledQuestions.map((question, index) => 
    formatQuestion(question, index)
  )
}
/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - New shuffled array
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
 * Formats a raw question object into quiz format with mixed answers
 * @param {Object} rawQuestion - Question from questions.json
 * @param {number} index - Question index for ID generation
 * @returns {Object} - Formatted question with shuffled answers
 */
export function formatQuestion(rawQuestion, index) {
  // Combine correct and wrong answers
  const allAnswers = [
    ...rawQuestion.correctAnswers.map(text => ({ text, isCorrect: true })),
    ...rawQuestion.wrongAnswers.map(text => ({ text, isCorrect: false }))
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
 * @param {Array} rawQuestions - Questions from questions.json
 * @param {number} count - Number of questions to select (default: 10)
 * @returns {Array} - Formatted and shuffled questions ready for quiz
 */
export function processQuestions(rawQuestions, count = 10) {
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
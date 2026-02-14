import Button from './ui/Button'
import {useRef, useEffect} from 'react'
import { DIFFICULTY } from '../hooks/useQuiz'

/**
 * ResultsScreen component - Displays quiz results and allows restart
 * @param {Object} props - Component props
 * @param {number} props.score - Number of correct answers
 * @param {number} props.totalQuestions - Total number of questions in quiz
 * @param {Function} props.onRestart - Callback when user clicks restart button
 * @returns {JSX.Element} ResultsScreen component
 */
function ResultsScreen({ 
  score, 
  totalQuestions, 
  difficulty,
  onRestart 
}) {
  /* Focus on the top of the screen when entering it, for a11y */
  const headingRef = useRef(null);

  useEffect(() =>{
    headingRef.current?.focus()

  }, [])
  const percentage = Math.round((score / totalQuestions) * 100)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* Completion header */}
        <h2
          className="text-2xl font-semibold text-gray-900"
          ref={headingRef}
          tabIndex={-1}
          >
          Quiz Terminé !
        </h2>

        {/* Score summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p class="text-sm text-gray-600 font-medium">
            Mode : {difficulty === DIFFICULTY.DIFFICULT ? "Difficile" : "Normal" }
          </p>
          <p className="text-gray-900">
            <span className="font-medium">Total de questions :</span> {totalQuestions}
          </p>
          <p className="text-gray-900">
            <span className="font-medium">Réponses correctes :</span> {score}
          </p>
          <p className="text-green-600 font-medium text-lg">
            {`Score : ${percentage}%`}
          </p>
        </div>

        {/* Restart button */}
        <Button onClick={onRestart}>
          Recommencer le Quiz
        </Button>
      </div>
    </div>
  )
}

export default ResultsScreen
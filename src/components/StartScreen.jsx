import Button from './ui/Button'

/**
 * StartScreen component - Initial screen to begin the quiz
 * @param {Object} props - Component props
 * @param {Function} props.onStart - Callback function when user clicks start button
 * @returns {JSX.Element} StartScreen component
 */
function StartScreen({ onStart }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Quiz de Naturalisation Française
        </h1>
        
        <p className="text-gray-600">
          Testez vos connaissances civiques et évaluez votre préparation pour la naturalisation française.
        </p>
        
        <Button onClick={onStart}>
          Commencer le Quiz
        </Button>
      </div>
    </div>
  )
}

export default StartScreen
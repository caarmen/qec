import Button from './ui/Button'

function ResultsScreen({ 
  score, 
  totalQuestions, 
  onRestart 
}) {
  const percentage = Math.round((score / totalQuestions) * 100)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* Completion header */}
        <h2 className="text-2xl font-semibold text-gray-900">
          Quiz Terminé 🎉
        </h2>

        {/* Score summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-gray-900">
            <span className="font-medium">Total de questions :</span> {totalQuestions}
          </p>
          <p className="text-gray-900">
            <span className="font-medium">Réponses correctes :</span> {score}
          </p>
          <p className="text-green-600 font-medium text-lg">
            Score : {percentage}%
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
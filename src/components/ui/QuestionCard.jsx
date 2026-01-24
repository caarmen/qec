function QuestionCard({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 space-y-6 ${className}`}>
      {children}
    </div>
  )
}

export default QuestionCard
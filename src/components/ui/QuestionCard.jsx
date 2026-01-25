import { memo } from 'react'

/**
 * QuestionCard component - Container card for quiz content
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {JSX.Element} QuestionCard component
 */
function QuestionCard({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 space-y-6 ${className}`}>
      {children}
    </div>
  )
}

export default memo(QuestionCard)
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuizScreen from '../../components/QuizScreen'

describe('QuizScreen', () => {
  const mockQuestion = {
    id: 'q1',
    question: 'Quelle est la devise de la République française ?',
    theme: 'Principes et valeurs',
    answers: [
      { id: 'q1-a0', text: 'Liberté, Égalité, Fraternité', isCorrect: true },
      { id: 'q1-a1', text: 'Liberté, Unité, Solidarité', isCorrect: false },
      { id: 'q1-a2', text: 'Travail, Famille, Patrie', isCorrect: false },
      { id: 'q1-a3', text: 'Paix et Justice', isCorrect: false }
    ]
  }

  const defaultProps = {
    currentQuestion: mockQuestion,
    currentQuestionIndex: 0,
    totalQuestions: 10,
    selectedAnswer: null,
    onSelectAnswer: vi.fn(),
    onSubmitAnswer: vi.fn(),
    hasAnswerSelected: false
  }

  describe('rendering', () => {
    it('should render the progress indicator', () => {
      render(<QuizScreen {...defaultProps} />)
      
      expect(screen.getByText('Question 1 sur 10')).toBeInTheDocument()
    })

    it('should render the question text', () => {
      render(<QuizScreen {...defaultProps} />)
      
      expect(screen.getByRole('heading', { 
        name: /quelle est la devise de la république française/i,
        level: 2
      })).toBeInTheDocument()
    })

    it('should render all answer options', () => {
      render(<QuizScreen {...defaultProps} />)
      
      expect(screen.getByRole('radio', { name: /liberté, égalité, fraternité/i })).toBeInTheDocument()
      expect(screen.getByRole('radio', { name: /liberté, unité, solidarité/i })).toBeInTheDocument()
      expect(screen.getByRole('radio', { name: /travail, famille, patrie/i })).toBeInTheDocument()
      expect(screen.getByRole('radio', { name: /paix et justice/i })).toBeInTheDocument()
    })

    it('should render the Next button', () => {
      render(<QuizScreen {...defaultProps} />)
      
      expect(screen.getByRole('button', { name: /suivant/i })).toBeInTheDocument()
    })

    it('should render null when no currentQuestion', () => {
      const { container } = render(<QuizScreen {...defaultProps} currentQuestion={null} />)
      
      expect(container.firstChild).toBeNull()
    })

    it('should apply correct layout styles', () => {
      const { container } = render(<QuizScreen {...defaultProps} />)
      
      const layout = container.firstChild
      expect(layout).toHaveClass('min-h-screen')
      expect(layout).toHaveClass('bg-gray-50')
      expect(layout).toHaveClass('flex')
      expect(layout).toHaveClass('items-center')
      expect(layout).toHaveClass('justify-center')
    })

    it('should render progress with correct question number', () => {
      render(<QuizScreen {...defaultProps} currentQuestionIndex={4} totalQuestions={10} />)
      
      expect(screen.getByText('Question 5 sur 10')).toBeInTheDocument()
    })

    it('should render last question progress correctly', () => {
      render(<QuizScreen {...defaultProps} currentQuestionIndex={9} totalQuestions={10} />)
      
      expect(screen.getByText('Question 10 sur 10')).toBeInTheDocument()
    })
  })

  describe('answer selection', () => {
    it('should not have any answer selected initially', () => {
      render(<QuizScreen {...defaultProps} />)
      
      const options = screen.getAllByRole('radio')
      options.forEach(option => {
        expect(option).toHaveAttribute('aria-checked', 'false')
      })
    })

    it('should highlight selected answer', () => {
      render(<QuizScreen {...defaultProps} selectedAnswer="q1-a0" />)
      
      const selectedOption = screen.getByRole('radio', { name: /liberté, égalité, fraternité/i })
      expect(selectedOption).toHaveAttribute('aria-checked', 'true')
    })

    it('should call onSelectAnswer when answer is clicked', async () => {
      const handleSelectAnswer = vi.fn()
      const user = userEvent.setup()
      
      render(<QuizScreen {...defaultProps} onSelectAnswer={handleSelectAnswer} />)
      
      const option = screen.getByRole('radio', { name: /liberté, égalité, fraternité/i })
      await user.click(option)
      
      expect(handleSelectAnswer).toHaveBeenCalledTimes(1)
      expect(handleSelectAnswer).toHaveBeenCalledWith('q1-a0')
    })

    it('should allow changing selection', async () => {
      const handleSelectAnswer = vi.fn()
      const user = userEvent.setup()
      
      render(<QuizScreen {...defaultProps} onSelectAnswer={handleSelectAnswer} />)
      
      const option1 = screen.getByRole('radio', { name: /liberté, égalité, fraternité/i })
      const option2 = screen.getByRole('radio', { name: /liberté, unité, solidarité/i })
      
      await user.click(option1)
      await user.click(option2)
      
      expect(handleSelectAnswer).toHaveBeenCalledTimes(2)
      expect(handleSelectAnswer).toHaveBeenNthCalledWith(1, 'q1-a0')
      expect(handleSelectAnswer).toHaveBeenNthCalledWith(2, 'q1-a1')
    })
  })

  describe('submit button', () => {
    it('should be disabled when no answer is selected', () => {
      render(<QuizScreen {...defaultProps} hasAnswerSelected={false} />)
      
      const button = screen.getByRole('button', { name: /suivant/i })
      expect(button).toBeDisabled()
    })

    it('should be enabled when answer is selected', () => {
      render(<QuizScreen {...defaultProps} hasAnswerSelected={true} selectedAnswer="q1-a0" />)
      
      const button = screen.getByRole('button', { name: /suivant/i })
      expect(button).not.toBeDisabled()
    })

    it('should call onSubmitAnswer when clicked', async () => {
      const handleSubmitAnswer = vi.fn()
      const user = userEvent.setup()
      
      render(<QuizScreen {...defaultProps} hasAnswerSelected={true} onSubmitAnswer={handleSubmitAnswer} />)
      
      const button = screen.getByRole('button', { name: /suivant/i })
      await user.click(button)
      
      expect(handleSubmitAnswer).toHaveBeenCalledTimes(1)
    })

    it('should not call onSubmitAnswer when disabled', async () => {
      const handleSubmitAnswer = vi.fn()
      const user = userEvent.setup()
      
      render(<QuizScreen {...defaultProps} hasAnswerSelected={false} onSubmitAnswer={handleSubmitAnswer} />)
      
      const button = screen.getByRole('button', { name: /suivant/i })
      await user.click(button)
      
      expect(handleSubmitAnswer).not.toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<QuizScreen {...defaultProps} />)
      
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toBeInTheDocument()
    })

    it('should have keyboard accessible answer options', async () => {
      const handleSelectAnswer = vi.fn()
      const user = userEvent.setup()
      
      render(<QuizScreen {...defaultProps} onSelectAnswer={handleSelectAnswer} />)
      
      const option = screen.getByRole('radio', { name: /liberté, égalité, fraternité/i })
      option.focus()
      
      await user.keyboard('{Enter}')
      
      expect(handleSelectAnswer).toHaveBeenCalledWith('q1-a0')
    })

    it('should have keyboard accessible submit button', async () => {
      const handleSubmitAnswer = vi.fn()
      const user = userEvent.setup()
      
      render(<QuizScreen {...defaultProps} hasAnswerSelected={true} onSubmitAnswer={handleSubmitAnswer} />)
      
      const button = screen.getByRole('button', { name: /suivant/i })
      button.focus()
      
      await user.keyboard('{Enter}')
      
      expect(handleSubmitAnswer).toHaveBeenCalledTimes(1)
    })
  })

  describe('content variations', () => {
    it('should render different question text', () => {
      const differentQuestion = {
        ...mockQuestion,
        question: 'En quelle année la Révolution française a-t-elle débuté ?'
      }
      
      render(<QuizScreen {...defaultProps} currentQuestion={differentQuestion} />)
      
      expect(screen.getByRole('heading', { 
        name: /en quelle année la révolution française/i 
      })).toBeInTheDocument()
    })

    it('should render questions with different number of answers', () => {
      const twoAnswersQuestion = {
        id: 'q2',
        question: 'Question with two answers',
        answers: [
          { id: 'q2-a0', text: 'Answer 1', isCorrect: true },
          { id: 'q2-a1', text: 'Answer 2', isCorrect: false }
        ]
      }
      
      render(<QuizScreen {...defaultProps} currentQuestion={twoAnswersQuestion} />)
      
      const options = screen.getAllByRole('radio')
      expect(options).toHaveLength(2)
    })

    it('should handle long question text', () => {
      const longQuestion = {
        ...mockQuestion,
        question: 'Ceci est une très longue question qui contient beaucoup de texte pour tester le rendu et la mise en page du composant avec un contenu plus substantiel'
      }
      
      render(<QuizScreen {...defaultProps} currentQuestion={longQuestion} />)
      
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/très longue question/)
    })

    it('should handle long answer text', () => {
      const longAnswerQuestion = {
        ...mockQuestion,
        answers: [
          { 
            id: 'q1-a0', 
            text: 'Ceci est une très longue réponse qui contient beaucoup de texte', 
            isCorrect: true 
          }
        ]
      }
      
      render(<QuizScreen {...defaultProps} currentQuestion={longAnswerQuestion} />)
      
      expect(screen.getByRole('radio', { name: /très longue réponse/ })).toBeInTheDocument()
    })
  })

  describe('integration', () => {
    it('should handle complete user flow: select and submit', async () => {
      const handleSelectAnswer = vi.fn()
      const handleSubmitAnswer = vi.fn()
      const user = userEvent.setup()
      
      const { rerender } = render(
        <QuizScreen 
          {...defaultProps} 
          onSelectAnswer={handleSelectAnswer}
          onSubmitAnswer={handleSubmitAnswer}
        />
      )
      
      // Initially, button is disabled
      const button = screen.getByRole('button', { name: /suivant/i })
      expect(button).toBeDisabled()
      
      // Select an answer
      const option = screen.getByRole('radio', { name: /liberté, égalité, fraternité/i })
      await user.click(option)
      
      expect(handleSelectAnswer).toHaveBeenCalledWith('q1-a0')
      
      // Rerender with answer selected
      rerender(
        <QuizScreen 
          {...defaultProps}
          selectedAnswer="q1-a0"
          hasAnswerSelected={true}
          onSelectAnswer={handleSelectAnswer}
          onSubmitAnswer={handleSubmitAnswer}
        />
      )
      
      // Now button should be enabled
      expect(button).not.toBeDisabled()
      
      // Submit answer
      await user.click(button)
      
      expect(handleSubmitAnswer).toHaveBeenCalledTimes(1)
    })
  })
})
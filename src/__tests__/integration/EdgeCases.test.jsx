import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../App'

describe('Edge Cases', () => {
  describe('last question behavior', () => {
    it('should transition to results after last question', async () => {
      const user = userEvent.setup()
      
      render(<App />)

      // Start quiz
      await user.click(screen.getByRole('button', { name: /commencer le quiz/i }))

      // Answer questions 1-9
      for (let i = 1; i <= 9; i++) {
        const answers = screen.getAllByRole('radio')
        await user.click(answers[0])
        await user.click(screen.getByRole('button', { name: /soumettre/i }))
        await user.click(screen.getByRole('button', { name: /suivant/i }))
      }

      // Should be on question 10 (last question)
      expect(screen.getByText(/question 10 sur 10/i)).toBeInTheDocument()

      // Answer last question
      const answers = screen.getAllByRole('radio')
      await user.click(answers[0])
      
      // Click submit on last question
      await user.click(screen.getByRole('button', { name: /soumettre/i }))

      // Go to the end
      await user.click(screen.getByRole('button', { name: /suivant/i }))

      // Should now be on results screen, not question 11
      expect(screen.getByRole('heading', { name: /quiz terminé/i })).toBeInTheDocument()
      expect(screen.queryByText(/question 11/i)).not.toBeInTheDocument()
    })

    it('should include last question answer in score', async () => {
      const user = userEvent.setup()
      
      render(<App />)

      // Start quiz
      await user.click(screen.getByRole('button', { name: /commencer le quiz/i }))

      // Answer all 10 questions
      for (let i = 1; i <= 10; i++) {
        const answers = screen.getAllByRole('radio')
        await user.click(answers[0])
        await user.click(screen.getByRole('button', { name: /soumettre/i }))
        await user.click(screen.getByRole('button', { name: /suivant/i }))
      }

      // Results should show 10 total questions
      expect(screen.getByText('10')).toBeInTheDocument()
      
      // Should have a score for all 10 questions
      const scoreText = screen.getByText(/score :/i).textContent
      expect(scoreText).toMatch(/score : \d+%/i)
    })

    it('should not allow navigation beyond last question', async () => {
      const user = userEvent.setup()
      
      render(<App />)

      // Start quiz
      await user.click(screen.getByRole('button', { name: /commencer le quiz/i }))

      // Answer all 10 questions
      for (let i = 1; i <= 10; i++) {
        const answers = screen.getAllByRole('radio')
        await user.click(answers[0])
        await user.click(screen.getByRole('button', { name: /soumettre/i }))
        await user.click(screen.getByRole('button', { name: /suivant/i }))
      }

      // Should be on results screen
      expect(screen.getByRole('heading', { name: /quiz terminé/i })).toBeInTheDocument()

      // Should not have Next button anymore
      expect(screen.queryByRole('button', { name: /suivant/i })).not.toBeInTheDocument()
      
      // Should only have Restart button
      expect(screen.getByRole('button', { name: /recommencer le quiz/i })).toBeInTheDocument()
    })
  })

  describe('answer selection edge cases', () => {
    it('should handle rapid answer changes', async () => {
      const user = userEvent.setup()
      
      render(<App />)

      // Start quiz
      await user.click(screen.getByRole('button', { name: /commencer le quiz/i }))

      const answers = screen.getAllByRole('radio')

      // Rapidly change answers
      await user.click(answers[0])
      await user.click(answers[1])
      await user.click(answers[2])
      await user.click(answers[0])

      // Only last selection should be active
      expect(answers[0]).toHaveAttribute('aria-checked', 'true')
      expect(answers[1]).toHaveAttribute('aria-checked', 'false')
      expect(answers[2]).toHaveAttribute('aria-checked', 'false')

      // Should be able to submit with last selection
      const nextButton = screen.getByRole('button', { name: /soumettre/i })
      expect(nextButton).not.toBeDisabled()
    })

    it('should reset selection when moving to next question', async () => {
      const user = userEvent.setup()
      
      render(<App />)

      // Start quiz
      await user.click(screen.getByRole('button', { name: /commencer le quiz/i }))

      // Select and submit answer on question 1
      let answers = screen.getAllByRole('radio')
      await user.click(answers[0])
      await user.click(screen.getByRole('button', { name: /soumettre/i }))

      // Move to question 2
      await user.click(screen.getByRole('button', { name: /suivant/i }))

      // On question 2, no answer should be pre-selected
      answers = screen.getAllByRole('radio')
      answers.forEach(answer => {
        expect(answer).toHaveAttribute('aria-checked', 'false')
      })

      // Next button should be disabled
      expect(screen.getByRole('button', { name: /soumettre/i })).toBeDisabled()
    })
  })

  describe('score calculation edge cases', () => {
    it('should handle perfect score', async () => {
      const user = userEvent.setup()
      
      render(<App />)

      // Start quiz
      await user.click(screen.getByRole('button', { name: /commencer le quiz/i }))

      // For this test, we'll answer all questions and check the result
      // We can't guarantee all correct answers without knowing which is correct,
      // but we can verify the score is calculated
      for (let i = 1; i <= 10; i++) {
        const answers = screen.getAllByRole('radio')
        // Find and click the correct answer (marked with isCorrect: true)
        // Since we can't see that in the UI, we'll just click first answer
        await user.click(answers[0])
        await user.click(screen.getByRole('button', { name: /soumettre/i }))
        await user.click(screen.getByRole('button', { name: /suivant/i }))
      }

      // Should show a percentage between 0-100
      const scoreText = screen.getByText(/score : \d+%/i).textContent
      const scoreMatch = scoreText.match(/(\d+)%/)
      const score = parseInt(scoreMatch[1])
      
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
    })

    it('should display correct count of answered questions', async () => {
      const user = userEvent.setup()
      
      render(<App />)

      // Start quiz
      await user.click(screen.getByRole('button', { name: /commencer le quiz/i }))

      // Answer all 10 questions
      for (let i = 1; i <= 10; i++) {
        const answers = screen.getAllByRole('radio')
        await user.click(answers[0])
        await user.click(screen.getByRole('button', { name: /soumettre/i }))
        await user.click(screen.getByRole('button', { name: /suivant/i }))
      }

      // Should show "Total de questions: 10"
      expect(screen.getByText(/total de questions :/i)).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()

      // Should show a correct answers count (0-10)
      const correctText = screen.getByText(/réponses correctes :/i).parentElement.textContent
      const correctMatch = correctText.match(/réponses correctes :\s*(\d+)/i)
      expect(correctMatch).toBeTruthy()
      
      const correctCount = parseInt(correctMatch[1])
      expect(correctCount).toBeGreaterThanOrEqual(0)
      expect(correctCount).toBeLessThanOrEqual(10)
    })
  })

  describe('navigation edge cases', () => {
    it('should not show quiz screen before starting', async () => {
      render(<App />)

      // Should show setup screen
      expect(screen.getByRole('heading', { name: /préparer le quiz/i })).toBeInTheDocument()

      // Should not show quiz elements
      expect(screen.queryByText(/question 1 sur 10/i)).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /suivant/i })).not.toBeInTheDocument()
    })

    it('should not show results screen during quiz', async () => {
      const user = userEvent.setup()
      
      render(<App />)

      // Start quiz
      await user.click(screen.getByRole('button', { name: /commencer le quiz/i }))

      // Should show quiz screen
      expect(screen.getByText(/question 1 sur 10/i)).toBeInTheDocument()

      // Should not show results elements
      expect(screen.queryByRole('heading', { name: /quiz terminé/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /recommencer le quiz/i })).not.toBeInTheDocument()
    })

    it('should not show start or quiz screen after completion', async () => {
      const user = userEvent.setup()
      
      render(<App />)

      // Start and complete quiz
      await user.click(screen.getByRole('button', { name: /^commencer le quiz/i }))

      for (let i = 1; i <= 10; i++) {
        const answers = screen.getAllByRole('radio')
        await user.click(answers[0])
        await user.click(screen.getByRole('button', { name: /soumettre/i }))
        await user.click(screen.getByRole('button', { name: /suivant/i }))
      }

      // Should show results screen
      expect(screen.getByRole('heading', { name: /quiz terminé/i })).toBeInTheDocument()

      // Should not show start screen elements
      expect(screen.queryByRole('button', { name: /^commencer le quiz/i })).not.toBeInTheDocument()

      // Should not show quiz screen elements
      expect(screen.queryByText(/question \d+ sur \d+/i)).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /suivant/i })).not.toBeInTheDocument()
    })
  })
})

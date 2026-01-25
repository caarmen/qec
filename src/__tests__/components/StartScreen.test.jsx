import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StartScreen from '../../components/StartScreen'

describe('StartScreen', () => {
  describe('rendering', () => {
    it('should render the title', () => {
      render(<StartScreen onStart={vi.fn()} />)
      
      expect(screen.getByRole('heading', { 
        name: /quiz de naturalisation française/i,
        level: 1 
      })).toBeInTheDocument()
    })

    it('should render the description', () => {
      render(<StartScreen onStart={vi.fn()} />)
      
      expect(screen.getByText(/testez vos connaissances civiques/i)).toBeInTheDocument()
    })

    it('should render the start button', () => {
      render(<StartScreen onStart={vi.fn()} />)
      
      expect(screen.getByRole('button', { name: /commencer le quiz/i })).toBeInTheDocument()
    })

    it('should apply correct layout styles', () => {
      const { container } = render(<StartScreen onStart={vi.fn()} />)
      
      const layout = container.firstChild
      expect(layout).toHaveClass('min-h-screen')
      expect(layout).toHaveClass('bg-gray-50')
      expect(layout).toHaveClass('flex')
      expect(layout).toHaveClass('items-center')
      expect(layout).toHaveClass('justify-center')
    })

    it('should apply correct card styles', () => {
      const { container } = render(<StartScreen onStart={vi.fn()} />)
      
      const card = container.querySelector('.bg-white')
      expect(card).toHaveClass('max-w-md')
      expect(card).toHaveClass('rounded-xl')
      expect(card).toHaveClass('shadow-sm')
      expect(card).toHaveClass('p-6')
      expect(card).toHaveClass('space-y-6')
    })

    it('should apply correct title styles', () => {
      render(<StartScreen onStart={vi.fn()} />)
      
      const title = screen.getByRole('heading', { level: 1 })
      expect(title).toHaveClass('text-2xl')
      expect(title).toHaveClass('font-semibold')
      expect(title).toHaveClass('text-gray-900')
    })

    it('should apply correct description styles', () => {
      render(<StartScreen onStart={vi.fn()} />)
      
      const description = screen.getByText(/testez vos connaissances civiques/i)
      expect(description).toHaveClass('text-gray-600')
    })
  })

  describe('interaction', () => {
    it('should call onStart when button is clicked', async () => {
      const handleStart = vi.fn()
      const user = userEvent.setup()
      
      render(<StartScreen onStart={handleStart} />)
      
      const button = screen.getByRole('button', { name: /commencer le quiz/i })
      await user.click(button)
      
      expect(handleStart).toHaveBeenCalledTimes(1)
    })

    it('should call onStart only once per click', async () => {
      const handleStart = vi.fn()
      const user = userEvent.setup()
      
      render(<StartScreen onStart={handleStart} />)
      
      const button = screen.getByRole('button', { name: /commencer le quiz/i })
      await user.click(button)
      
      expect(handleStart).toHaveBeenCalledTimes(1)
    })

    it('should be keyboard accessible', async () => {
      const handleStart = vi.fn()
      const user = userEvent.setup()
      
      render(<StartScreen onStart={handleStart} />)
      
      const button = screen.getByRole('button', { name: /commencer le quiz/i })
      button.focus()
      
      expect(button).toHaveFocus()
      
      await user.keyboard('{Enter}')
      
      expect(handleStart).toHaveBeenCalledTimes(1)
    })
  })

  describe('accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<StartScreen onStart={vi.fn()} />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
    })

    it('should have a clickable button', () => {
      render(<StartScreen onStart={vi.fn()} />)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).not.toBeDisabled()
    })

    it('should have descriptive button text', () => {
      render(<StartScreen onStart={vi.fn()} />)
      
      const button = screen.getByRole('button', { name: /commencer le quiz/i })
      expect(button).toHaveTextContent('Commencer le Quiz')
    })
  })

  describe('content', () => {
    it('should display correct French text', () => {
      render(<StartScreen onStart={vi.fn()} />)
      
      expect(screen.getByText('Quiz de Naturalisation Française')).toBeInTheDocument()
      expect(screen.getByText(/testez vos connaissances civiques et évaluez votre préparation/i)).toBeInTheDocument()
      expect(screen.getByText('Commencer le Quiz')).toBeInTheDocument()
    })

    it('should have informative description text', () => {
      render(<StartScreen onStart={vi.fn()} />)
      
      const description = screen.getByText(/testez vos connaissances civiques/i)
      expect(description).toBeInTheDocument()
      expect(description.tagName).toBe('P')
    })
  })

  describe('layout', () => {
    it('should center content on screen', () => {
      const { container } = render(<StartScreen onStart={vi.fn()} />)
      
      const layout = container.firstChild
      expect(layout).toHaveClass('items-center')
      expect(layout).toHaveClass('justify-center')
    })

    it('should have responsive padding', () => {
      const { container } = render(<StartScreen onStart={vi.fn()} />)
      
      const layout = container.firstChild
      expect(layout).toHaveClass('px-4')
    })

    it('should limit card width for readability', () => {
      const { container } = render(<StartScreen onStart={vi.fn()} />)
      
      const card = container.querySelector('.bg-white')
      expect(card).toHaveClass('w-full')
      expect(card).toHaveClass('max-w-md')
    })
  })
})
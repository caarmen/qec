import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../../components/ui/Button'

describe('Button', () => {
  describe('rendering', () => {
    it('should render with children', () => {
      render(<Button>Click me</Button>)
      
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
    })

    it('should render as enabled by default', () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole('button')
      expect(button).not.toBeDisabled()
    })

    it('should render as disabled when disabled prop is true', () => {
      render(<Button disabled>Click me</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('should apply primary variant styles by default', () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-blue-600')
      expect(button).toHaveClass('text-white')
    })

    it('should apply secondary variant styles when specified', () => {
      render(<Button variant="secondary">Click me</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-gray-200')
      expect(button).toHaveClass('text-gray-900')
    })

    it('should apply base styles to all variants', () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('w-full')
      expect(button).toHaveClass('py-3')
      expect(button).toHaveClass('rounded-lg')
      expect(button).toHaveClass('font-medium')
    })

    it('should accept additional className', () => {
      render(<Button className="custom-class">Click me</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
      expect(button).toHaveClass('bg-blue-600') // Still has base styles
    })

    it('should forward additional props', () => {
      render(<Button data-testid="custom-button" aria-label="Custom label">Click me</Button>)
      
      const button = screen.getByTestId('custom-button')
      expect(button).toHaveAttribute('aria-label', 'Custom label')
    })
  })

  describe('interaction', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not call onClick when disabled', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick} disabled>Click me</Button>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should call onClick multiple times when clicked multiple times', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      await user.click(button)
      await user.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(3)
    })
  })

  describe('accessibility', () => {
    it('should be keyboard accessible', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      button.focus()
      
      expect(button).toHaveFocus()
      
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should have proper disabled cursor style', () => {
      render(<Button disabled>Click me</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('disabled:cursor-not-allowed')
    })

    it('should be identified as a button by screen readers', () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole('button')
      expect(button.tagName).toBe('BUTTON')
    })
  })

  describe('variants', () => {
    it('should apply disabled styles to primary variant', () => {
      render(<Button disabled>Click me</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('disabled:bg-gray-300')
    })

    it('should apply disabled styles to secondary variant', () => {
      render(<Button variant="secondary" disabled>Click me</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('disabled:bg-gray-100')
    })

    it('should fallback to primary variant for invalid variant', () => {
      render(<Button variant="invalid">Click me</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-blue-600')
    })
  })
})
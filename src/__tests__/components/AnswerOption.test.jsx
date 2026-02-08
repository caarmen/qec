import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AnswerOption from '../../components/ui/AnswerOption'

describe('AnswerOption', () => {
  const defaultProps = {
    id: 'answer-1',
    text: 'Test answer',
    role: 'radio',
    onSelect: vi.fn()
  }

  describe('rendering', () => {
    it('should render answer text', () => {
      render(<AnswerOption {...defaultProps} />)
      
      expect(screen.getByRole('radio', { name: /test answer/i })).toBeInTheDocument()
    })

    it('should render as unselected by default', () => {
      render(<AnswerOption {...defaultProps} />)
      
      const option = screen.getByRole('radio')
      expect(option).toHaveAttribute('aria-checked', 'false')
      expect(option).toHaveAttribute('aria-pressed', 'false')
      expect(option).toHaveClass('border-gray-200')
    })

    it('should render as selected when isSelected is true', () => {
      render(<AnswerOption {...defaultProps} isSelected />)
      
      const option = screen.getByRole('radio')
      expect(option).toHaveAttribute('aria-checked', 'true')
      expect(option).toHaveAttribute('aria-pressed', 'true')
      expect(option).toHaveClass('border-blue-600')
      expect(option).toHaveClass('bg-blue-50')
    })

    it('should apply base styles', () => {
      render(<AnswerOption {...defaultProps} />)
      
      const option = screen.getByRole('radio')
      expect(option).toHaveClass('w-full')
      expect(option).toHaveClass('text-left')
      expect(option).toHaveClass('border')
      expect(option).toHaveClass('rounded-lg')
      expect(option).toHaveClass('p-4')
    })

    it('should apply hover styles when not selected', () => {
      render(<AnswerOption {...defaultProps} />)
      
      const option = screen.getByRole('radio')
      expect(option).toHaveClass('hover:bg-gray-50')
    })

    it('should render as disabled when disabled prop is true', () => {
      render(<AnswerOption {...defaultProps} disabled />)
      
      const option = screen.getByRole('radio')
      expect(option).toBeDisabled()
      expect(option).toHaveClass('opacity-50')
      expect(option).toHaveClass('cursor-not-allowed')
    })

    it('should render with long text', () => {
      const longText = 'This is a very long answer text that should wrap properly within the card component without breaking the layout or causing any display issues.'
      
      render(<AnswerOption {...defaultProps} text={longText} />)
      
      expect(screen.getByText(longText)).toBeInTheDocument()
    })
  })

  describe('interaction', () => {
    it('should call onSelect with id when clicked', async () => {
      const handleSelect = vi.fn()
      const user = userEvent.setup()
      
      render(<AnswerOption {...defaultProps} onSelect={handleSelect} />)
      
      const option = screen.getByRole('radio')
      await user.click(option)
      
      expect(handleSelect).toHaveBeenCalledTimes(1)
      expect(handleSelect).toHaveBeenCalledWith('answer-1')
    })

    it('should not call onSelect when disabled', async () => {
      const handleSelect = vi.fn()
      const user = userEvent.setup()
      
      render(<AnswerOption {...defaultProps} onSelect={handleSelect} disabled />)
      
      const option = screen.getByRole('radio')
      await user.click(option)
      
      expect(handleSelect).not.toHaveBeenCalled()
    })

    it('should call onSelect when Enter key is pressed', async () => {
      const handleSelect = vi.fn()
      const user = userEvent.setup()
      
      render(<AnswerOption {...defaultProps} onSelect={handleSelect} />)
      
      const option = screen.getByRole('radio')
      option.focus()
      await user.keyboard('{Enter}')
      
      expect(handleSelect).toHaveBeenCalledTimes(1)
      expect(handleSelect).toHaveBeenCalledWith('answer-1')
    })

    it('should call onSelect when Space key is pressed', async () => {
      const handleSelect = vi.fn()
      const user = userEvent.setup()
      
      render(<AnswerOption {...defaultProps} onSelect={handleSelect} />)
      
      const option = screen.getByRole('radio')
      option.focus()
      await user.keyboard(' ')
      
      expect(handleSelect).toHaveBeenCalledTimes(1)
      expect(handleSelect).toHaveBeenCalledWith('answer-1')
    })

    it('should not call onSelect when other keys are pressed', async () => {
      const handleSelect = vi.fn()
      const user = userEvent.setup()
      
      render(<AnswerOption {...defaultProps} onSelect={handleSelect} />)
      
      const option = screen.getByRole('radio')
      option.focus()
      await user.keyboard('a')
      await user.keyboard('{Tab}')
      
      expect(handleSelect).not.toHaveBeenCalled()
    })

    it('should not call onSelect when disabled and Enter is pressed', async () => {
      const handleSelect = vi.fn()
      const user = userEvent.setup()
      
      render(<AnswerOption {...defaultProps} onSelect={handleSelect} disabled />)
      
      const option = screen.getByRole('radio')
      option.focus()
      await user.keyboard('{Enter}')
      
      expect(handleSelect).not.toHaveBeenCalled()
    })

    it('should work without onSelect callback', async () => {
      const user = userEvent.setup()
      
      render(<AnswerOption id="answer-1" text="Test" role="radio" />)
      
      const option = screen.getByRole('radio')
      
      // Should not throw error
      await expect(user.click(option)).resolves.not.toThrow()
    })

    const roles = ["radio", "checkbox"]
    roles.forEach((role) => {

      it(`should be selectable multiple times - ${role}`, async () => {
        const handleSelect = vi.fn()
        const user = userEvent.setup()

        render(<AnswerOption {...defaultProps} role={role} onSelect={handleSelect} />)

        const option = screen.getByRole(role)
        await user.click(option)
        await user.click(option)
        await user.click(option)

        expect(handleSelect).toHaveBeenCalledTimes(3)
      })
    })
  })

  describe('accessibility', () => {
    it('should have radio role', () => {
      render(<AnswerOption {...defaultProps} />)
      
      const option = screen.getByRole('radio')
      expect(option).toBeInTheDocument()
    })

    it('should have proper aria-checked attribute', () => {
      const { rerender } = render(<AnswerOption {...defaultProps} isSelected={false} />)
      
      let option = screen.getByRole('radio')
      expect(option).toHaveAttribute('aria-checked', 'false')
      
      rerender(<AnswerOption {...defaultProps} isSelected={true} />)
      
      option = screen.getByRole('radio')
      expect(option).toHaveAttribute('aria-checked', 'true')
    })

    it('should have proper aria-pressed attribute', () => {
      const { rerender } = render(<AnswerOption {...defaultProps} isSelected={false} />)
      
      let option = screen.getByRole('radio')
      expect(option).toHaveAttribute('aria-pressed', 'false')
      
      rerender(<AnswerOption {...defaultProps} isSelected={true} />)
      
      option = screen.getByRole('radio')
      expect(option).toHaveAttribute('aria-pressed', 'true')
    })

    it('should be keyboard focusable', () => {
      render(<AnswerOption {...defaultProps} />)
      
      const option = screen.getByRole('radio')
      option.focus()
      
      expect(option).toHaveFocus()
    })

    it('should have button type', () => {
      render(<AnswerOption {...defaultProps} />)
      
      const option = screen.getByRole('radio')
      expect(option).toHaveAttribute('type', 'button')
    })
  })

  describe('visual states', () => {
    it('should toggle between selected and unselected styles', () => {
      const { rerender } = render(<AnswerOption {...defaultProps} isSelected={false} />)
      
      let option = screen.getByRole('radio')
      expect(option).toHaveClass('border-gray-200')
      expect(option).not.toHaveClass('bg-blue-50')
      
      rerender(<AnswerOption {...defaultProps} isSelected={true} />)
      
      option = screen.getByRole('radio')
      expect(option).toHaveClass('border-blue-600')
      expect(option).toHaveClass('bg-blue-50')
    })

    it('should maintain selected styles when disabled', () => {
      render(<AnswerOption {...defaultProps} isSelected disabled />)
      
      const option = screen.getByRole('radio')
      expect(option).toHaveClass('border-blue-600')
      expect(option).toHaveClass('bg-blue-50')
      expect(option).toHaveClass('opacity-50')
    })

    it('should indicate correctness after submission', () => {
      const {rerender} = render(<AnswerOption {...defaultProps} isSelected={false} feedback={'correct'}/>)
      let option = screen.getByRole('radio')
      expect(option).toHaveClass('bg-green-50')
      expect(screen.getByText(/✔/)).toBeInTheDocument()

      rerender(<AnswerOption {...defaultProps} isSelected={false} feedback={'incorrect'}/>)
      option = screen.getByRole('radio')
      expect(option).toHaveClass('bg-red-50')
      expect(screen.getByText(/✖/)).toBeInTheDocument()
    })
  })
})
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SegmentedControlOption from '../../components/ui/SegmentedControlOption'

describe('SegmentedControlOption', () => {
  const defaultProps = {
    value: 20,
    label: '20',
    onSelect: vi.fn()
  }

  describe('rendering', () => {
    it('should render label and radio role', () => {
      render(<SegmentedControlOption {...defaultProps} />)

      const option = screen.getByRole('radio', { name: '20' })
      expect(option).toBeInTheDocument()
    })

    it('should render as unselected by default', () => {
      render(<SegmentedControlOption {...defaultProps} />)

      const option = screen.getByRole('radio')
      expect(option).toHaveAttribute('aria-checked', 'false')
      expect(option).toHaveAttribute('tabindex', '-1')
      expect(option).toHaveClass('border-gray-300')
    })

    it('should render as selected when isSelected is true', () => {
      render(<SegmentedControlOption {...defaultProps} isSelected />)

      const option = screen.getByRole('radio')
      expect(option).toHaveAttribute('aria-checked', 'true')
      expect(option).toHaveAttribute('tabindex', '0')
      expect(option).toHaveClass('bg-blue-600')
      expect(option).toHaveClass('text-white')
    })

    it('should render as disabled when disabled prop is true', () => {
      render(<SegmentedControlOption {...defaultProps} disabled />)

      const option = screen.getByRole('radio')
      expect(option).toBeDisabled()
      expect(option).toHaveClass('cursor-not-allowed')
    })

    it('should apply additional className', () => {
      render(<SegmentedControlOption {...defaultProps} className="custom-class" />)

      const option = screen.getByRole('radio')
      expect(option).toHaveClass('custom-class')
    })
  })

  describe('interaction', () => {
    it('should call onSelect with value when clicked', async () => {
      const handleSelect = vi.fn()
      const user = userEvent.setup()

      render(<SegmentedControlOption {...defaultProps} onSelect={handleSelect} />)

      const option = screen.getByRole('radio')
      await user.click(option)

      expect(handleSelect).toHaveBeenCalledTimes(1)
      expect(handleSelect).toHaveBeenCalledWith(20)
    })

    it('should not call onSelect when disabled', async () => {
      const handleSelect = vi.fn()
      const user = userEvent.setup()

      render(<SegmentedControlOption {...defaultProps} onSelect={handleSelect} disabled />)

      const option = screen.getByRole('radio')
      await user.click(option)

      expect(handleSelect).not.toHaveBeenCalled()
    })

    it('should forward onKeyDown handler', async () => {
      const handleKeyDown = vi.fn()
      const user = userEvent.setup()

      render(
        <SegmentedControlOption
          {...defaultProps}
          onKeyDown={handleKeyDown}
        />
      )

      const option = screen.getByRole('radio')
      option.focus()
      await user.keyboard('{ArrowRight}')

      expect(handleKeyDown).toHaveBeenCalled()
    })

    it('should work without onSelect callback', async () => {
      const user = userEvent.setup()

      render(<SegmentedControlOption value={10} label="10" />)

      const option = screen.getByRole('radio')
      await expect(user.click(option)).resolves.not.toThrow()
    })
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import SegmentedControl from '../../components/ui/SegmentedControl'

const defaultOptions = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 40, label: '40' },
  { value: 80, label: '80', disabled: true }
]

const optionsNoDisabled = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 40, label: '40' },
  { value: 80, label: '80' }
]

function ControlledSegmentedControl({
  initialValue = 40,
  options = defaultOptions,
  onChange = () => {}
}) {
  const [value, setValue] = useState(initialValue)

  const handleChange = (nextValue) => {
    setValue(nextValue)
    onChange(nextValue)
  }

  return (
    <SegmentedControl
      label="Nombre de questions"
      helperText="Choisissez la durée de votre session"
      options={options}
      value={value}
      onChange={handleChange}
    />
  )
}

describe('SegmentedControl', () => {
  describe('rendering', () => {
    it('should render label, helper text, and options', () => {
      render(<ControlledSegmentedControl />)

      expect(screen.getByText('Nombre de questions')).toBeInTheDocument()
      expect(screen.getByText('Choisissez la durée de votre session')).toBeInTheDocument()

      const radioGroup = screen.getByRole('radiogroup')
      expect(radioGroup).toBeInTheDocument()
      expect(radioGroup).toHaveClass('grid')
      expect(radioGroup).toHaveClass('grid-cols-4')

      const options = screen.getAllByRole('radio')
      expect(options).toHaveLength(4)
      expect(screen.getByRole('radio', { name: '40' })).toHaveAttribute('aria-checked', 'true')
    })

    it('should render disabled options as disabled', () => {
      render(<ControlledSegmentedControl />)

      const disabledOption = screen.getByRole('radio', { name: '80' })
      expect(disabledOption).toBeDisabled()
      expect(disabledOption).toHaveClass('cursor-not-allowed')
    })
  })

  describe('interaction', () => {
    it('should call onChange and update selection when clicked', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()

      render(<ControlledSegmentedControl onChange={handleChange} />)

      const option = screen.getByRole('radio', { name: '20' })
      await user.click(option)

      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange).toHaveBeenCalledWith(20)
      expect(option).toHaveAttribute('aria-checked', 'true')
    })

    it('should not call onChange when clicking a disabled option', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()

      render(
        <SegmentedControl
          label="Nombre de questions"
          helperText="Choisissez la durée de votre session"
          options={defaultOptions}
          value={40}
          onChange={handleChange}
        />
      )

      const disabledOption = screen.getByRole('radio', { name: '80' })
      await user.click(disabledOption)

      expect(handleChange).not.toHaveBeenCalled()
    })

    it('should support arrow key navigation and update selection', async () => {
      const user = userEvent.setup()

      render(<ControlledSegmentedControl initialValue={20} />)

      const currentOption = screen.getByRole('radio', { name: '20' })
      currentOption.focus()

      await user.keyboard('{ArrowRight}')

      const nextOption = screen.getByRole('radio', { name: '40' })
      expect(nextOption).toHaveAttribute('aria-checked', 'true')
      expect(nextOption).toHaveFocus()
    })

    it('should support Home/End keys to jump to first/last option', async () => {
      const user = userEvent.setup()

      render(
        <ControlledSegmentedControl
          initialValue={40}
          options={optionsNoDisabled}
        />
      )

      const currentOption = screen.getByRole('radio', { name: '40' })
      currentOption.focus()

      await user.keyboard('{Home}')
      const firstOption = screen.getByRole('radio', { name: '10' })
      expect(firstOption).toHaveAttribute('aria-checked', 'true')
      expect(firstOption).toHaveFocus()

      await user.keyboard('{End}')
      const lastOption = screen.getByRole('radio', { name: '80' })
      expect(lastOption).toHaveAttribute('aria-checked', 'true')
      expect(lastOption).toHaveFocus()
    })
  })

  describe('accessibility', () => {
    it('should only allow the selected option to be tabbable', () => {
      render(<ControlledSegmentedControl initialValue={20} />)

      const selectedOption = screen.getByRole('radio', { name: '20' })
      const unselectedOption = screen.getByRole('radio', { name: '10' })

      expect(selectedOption).toHaveAttribute('tabindex', '0')
      expect(unselectedOption).toHaveAttribute('tabindex', '-1')
    })
  })
})

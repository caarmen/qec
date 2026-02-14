import { memo } from "react";

/**
 * Button component - Reusable button with variants and states
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button text or content
 * @param {Function} [props.onClick] - Click handler
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * @param {'primary'|'secondary'} [props.variant='primary'] - Button style variant
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {Object} [props...rest] - Additional button attributes
 * @returns {JSX.Element} Button component
 */
function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
  ...props
}) {
  const baseStyles =
    "w-full py-3 rounded-lg font-medium text-base transition-colors";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed",
  };

  const variantStyles = variants[variant] || variants.primary;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default memo(Button);

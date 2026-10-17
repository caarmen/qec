import { useTranslation } from "react-i18next";
import { useTheme, THEME } from "../../hooks/useTheme";

/**
 * ThemeToggle component - Manual light/dark theme switch with sun/moon icon
 * @param {Object} props - Component props
 * @param {string} [props.className=''] - Additional CSS classes (e.g. positioning)
 * @returns {JSX.Element} ThemeToggle component
 */
function ThemeToggle({ className = "" }) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === THEME.DARK;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark ? t("theme.a11yToggleLight") : t("theme.a11yToggleDark")
      }
      className={`
        w-10 h-10 rounded-full flex items-center justify-center
        border border-gray-300 bg-white text-gray-700
        hover:bg-gray-50 transition-colors
        focus:outline-none focus:ring-2 focus:ring-primary-500
        dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700
        ${className}
      `.trim()}
    >
      {isDark ? (
        /* Sun icon: switch back to light mode */
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.36-6.36l-1.42 1.42M7.05 16.95l-1.42 1.42m0-12.73l1.42 1.42m9.9 9.9l1.42 1.42M12 8a4 4 0 100 8 4 4 0 000-8z"
          />
        </svg>
      ) : (
        /* Moon icon: switch to dark mode */
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
          />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;

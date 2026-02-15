import Button from "./ui/Button";
import { useRef, useEffect } from "react";
import { DIFFICULTY } from "../hooks/useQuiz";
import { useTranslation } from "react-i18next";

/**
 * ResultsScreen component - Displays quiz results and allows restart
 * @param {Object} props - Component props
 * @param {number} props.score - Number of correct answers
 * @param {number} props.totalQuestions - Total number of questions in quiz
 * @param {Function} props.onRestart - Callback when user clicks restart button
 * @returns {JSX.Element} ResultsScreen component
 */
function ResultsScreen({ score, totalQuestions, difficulty, onRestart }) {
  const { t } = useTranslation();
  /* Focus on the top of the screen when entering it, for a11y */
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xs p-6 space-y-6">
        {/* Completion header */}
        <h2
          className="text-2xl font-semibold text-gray-900"
          ref={headingRef}
          tabIndex={-1}
        >
          {t("resultsScreen.title")}
        </h2>

        {/* Score summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm text-gray-600 font-medium">
            {t("resultsScreen.difficulty", {
              difficulty: t(
                difficulty === DIFFICULTY.DIFFICULT
                  ? "common.difficultyDifficult"
                  : "common.difficultyNormal",
              ),
            })}
          </p>
          <p className="text-gray-900">
            <span className="font-medium">
              {t("resultsScreen.totalCountLabel")}
            </span>{" "}
            {totalQuestions}
          </p>
          <p className="text-gray-900">
            <span className="font-medium">
              {t("resultsScreen.correctCountLabel")}
            </span>{" "}
            {score}
          </p>
          <p className="text-green-600 font-medium text-lg">
            {`Score : ${percentage}%`}
          </p>
        </div>

        {/* Restart button */}
        <Button onClick={onRestart}>{t("resultsScreen.buttonRestart")}</Button>
      </div>
    </div>
  );
}

export default ResultsScreen;

import { useEffect, useMemo, useRef } from "react";
import Button from "./ui/Button";
import SegmentedControl from "./ui/SegmentedControl";
import Dropdown from "./ui/Dropdown";
import { getAvailableQuestionCountOptions } from "../utils/questionCountOptions";
import { DIFFICULTY } from "../hooks/useQuiz";
import { useTranslation } from "react-i18next";

/**
 * QuizStartScreen component - Landing screen with quiz configuration
 * @param {Object} props - Component props
 * @param {number} props.totalQuestions - Total questions available in the pool
 * @param {number|null} props.selectedQuestionCount - Selected question count
 * @param {Function} props.onSelectQuestionCount - Callback when selecting question count
 * @param {Function} props.onStart - Callback when starting the quiz
 * @returns {JSX.Element} QuizStartScreen component
 */
function QuizStartScreen({
  totalQuestions,
  selectedQuestionCount,
  selectedDifficulty,
  onSelectQuestionCount,
  onSelectDifficulty,
  onStart,
}) {
  const { t } = useTranslation();
  /* Focus on the top of the screen when entering it, for a11y */
  const mainRef = useRef(null);

  useEffect(() => {
    mainRef.current?.focus();
  }, []);

  const { options: questionCountOptions, defaultValue: defaultQuestionCount } =
    useMemo(
      () => getAvailableQuestionCountOptions(totalQuestions),
      [totalQuestions],
    );

  const questionCountOptionItems = useMemo(
    () =>
      questionCountOptions.map((value) => ({ value, label: String(value) })),
    [questionCountOptions],
  );

  const questionCountEffectiveValue =
    selectedQuestionCount ?? defaultQuestionCount;

  const difficultyOptionItems = [
    { value: DIFFICULTY.NORMAL, label: "Normal" },
    { value: DIFFICULTY.DIFFICULT, label: "Difficile" },
  ];

  return (
    <main
      ref={mainRef}
      tabIndex={-1}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6 space-y-8">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {t("startScreen.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("startScreen.shortDescription")}
          </p>
        </div>

        <Dropdown
          label={t("startScreen.config.questionCount.label")}
          helperText={t("startScreen.config.questionCount.helperText")}
          options={questionCountOptionItems}
          value={questionCountEffectiveValue}
          onChange={onSelectQuestionCount}
        />
        <SegmentedControl
          label={t("startScreen.config.difficulty.label")}
          helperText={t("startScreen.config.difficulty.helperText")}
          options={difficultyOptionItems}
          value={selectedDifficulty}
          onChange={onSelectDifficulty}
        />

        <Button onClick={onStart} disabled={!questionCountEffectiveValue}>
          {t("startScreen.buttonStart")}
        </Button>
      </div>
    </main>
  );
}

export default QuizStartScreen;

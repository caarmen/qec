import { memo } from "react";

/**
 * RichText - Renders text with `backtick` spans as inline code.
 *
 * Everything between two backticks is rendered as a <code> element. An
 * unmatched trailing backtick is rendered as a literal character. This is
 * deliberately not a markdown parser: question and answer texts only need
 * inline code spans.
 *
 * @param {Object} props - Component props
 * @param {string} props.text - Text possibly containing `code` spans
 * @returns {JSX.Element} Text with inline code spans
 */
function RichText({ text = "" }) {
  const parts = text.split("`");
  const hasDanglingBacktick = parts.length % 2 === 0;

  return parts.map((part, index) => {
    if (hasDanglingBacktick && index === parts.length - 1) {
      return <span key={index}>{`\`${part}`}</span>;
    }
    if (index % 2 === 1) {
      return (
        <code
          key={index}
          className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[0.9em] dark:bg-gray-700"
        >
          {part}
        </code>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default memo(RichText);

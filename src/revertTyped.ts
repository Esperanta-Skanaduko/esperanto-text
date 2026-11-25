import type { TypedChange } from './typingTypes.js';

/**
 * Undoes the last conversion when the user presses Backspace straight after it,
 * putting back the letters they typed (`ĉ` becomes `cx`). It does nothing if the
 * text or the caret has moved since the conversion.
 *
 * @param value - The current text.
 * @param caret - The current caret position.
 * @param change - The change returned by `convertTyped`.
 * @returns The reverted value and caret, or `null` when the undo no longer applies.
 */
export const revertTyped = (value: string, caret: number, change: TypedChange): { value: string; caret: number } | null => {
  const end = change.index + change.replacement.length;
  if (caret !== end || value.slice(change.index, end) !== change.replacement) return null;
  return {
    value: value.slice(0, change.index) + change.original + value.slice(end),
    caret: change.index + change.original.length,
  };
};

import { DEFAULT_H_EXCEPTIONS, SUPERSIGN_LETTERS } from './constants.js';
import type { TypedChange, TypingOptions } from './typingTypes.js';

const BY_BASE = new Map(SUPERSIGN_LETTERS.map((letter) => [letter.base, letter.unicode]));

/**
 * Looks at the two characters just before the caret and, if the user has just
 * finished typing a supersign letter (`c` then `x`), replaces them with it.
 * Call it after every character the user types. It is pure: it returns the new
 * value and caret and a record of the change, and touches nothing else.
 *
 * h-system typing never converts inside the start of a known exception, so
 * typing `flugh` while writing `flughaveno` stays as typed.
 *
 * @param value - The full text after the keystroke.
 * @param caret - Caret position after the keystroke.
 * @param options - Which spellings to convert.
 * @returns The (possibly changed) value and caret, and the change made or `null`.
 */
export const convertTyped = (
  value: string,
  caret: number,
  options: TypingOptions = {},
): { value: string; caret: number; change: TypedChange | null } => {
  const unchanged = { value, caret, change: null };
  if (caret < 2) return unchanged;
  const pair = value.slice(caret - 2, caret);
  const first = pair[0]!;
  const second = pair[1]!;
  const letter = BY_BASE.get(first.toLowerCase());
  if (letter === undefined) return unchanged;

  const isX = second.toLowerCase() === 'x';
  const isH = second.toLowerCase() === 'h' && first.toLowerCase() !== 'u';
  if (!((isX && (options.x ?? true)) || (isH && (options.h ?? false)))) return unchanged;

  if (isH) {
    const wordStart = value.slice(0, caret).search(/[\p{L}\p{M}]+$/u);
    const wordSoFar = value.slice(wordStart, caret).toLowerCase();
    const exceptions = options.exceptions ?? DEFAULT_H_EXCEPTIONS;
    if (exceptions.some((exception) => exception.at === 'start' && exception.text.startsWith(wordSoFar) && wordSoFar.length < exception.text.length)) {
      return unchanged;
    }
  }

  const replacement = first === first.toUpperCase() ? letter.toUpperCase() : letter;
  return {
    value: value.slice(0, caret - 2) + replacement + value.slice(caret),
    caret: caret - 1,
    change: { index: caret - 2, original: pair, replacement },
  };
};

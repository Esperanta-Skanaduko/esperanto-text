import type { HSystemException } from './constants.js';

/**
 * Tells whether a word is a known h-system look-alike that must not be converted.
 *
 * @param word - One word, in any case, written in the h-system.
 * @param exceptions - The exception list to check against.
 * @returns True when the word starts with, or equals, an exception.
 */
export const isHException = (word: string, exceptions: readonly HSystemException[]): boolean => {
  const lower = word.toLowerCase();
  return exceptions.some((exception) =>
    exception.at === 'whole' ? lower === exception.text : lower.startsWith(exception.text),
  );
};

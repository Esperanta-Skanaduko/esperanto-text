import { DEFAULT_H_EXCEPTIONS, SUPERSIGN_LETTERS } from './constants.js';
import { isHException } from './isHException.js';
import { mapWords } from './mapWords.js';
import type { ConvertOptions } from './types.js';

const BY_BASE = new Map(SUPERSIGN_LETTERS.map((letter) => [letter.base, letter.unicode]));

/**
 * Converts h-system text (`chu`, `ghis`, `jhaudo`) to proper Esperanto letters.
 *
 * The h-system is ambiguous, so this is a best effort, not an exact inverse:
 * - `ch gh hh jh sh` become `ĉ ĝ ĥ ĵ ŝ`.
 * - `au` and `eu` become `aŭ` and `eŭ`, because ŭ is written as a plain `u`.
 * - Words in the exception list (default: `flughaveno`, `traurba`, `reuzi`, `Nauro`)
 *   are left alone, since there the letters are two separate letters.
 * Any other compound that happens to contain these pairs will be converted
 * wrongly. Pass `exceptions` to add your own, or use `detectSpelling` first.
 *
 * @param text - Text written in the h-system.
 * @param options - Exceptions and URL handling.
 * @returns The text with the h-system spellings replaced by supersign letters.
 */
export const fromHSystem = (text: string, options: ConvertOptions = {}): string => {
  const exceptions = options.exceptions ?? DEFAULT_H_EXCEPTIONS;
  return mapWords(
    text,
    (word) => {
      if (isHException(word, exceptions)) return word;
      return word
        .replace(/([cghjs])h/gi, (_match, letter: string) => {
          const converted = BY_BASE.get(letter.toLowerCase()) as string;
          return letter === letter.toUpperCase() ? converted.toUpperCase() : converted;
        })
        .replace(/([ae])u/gi, (_match, vowel: string, offset: number, whole: string) => {
          const isUpper = whole[offset + 1] === whole[offset + 1]!.toUpperCase();
          return vowel + (isUpper ? 'Ŭ' : 'ŭ');
        });
    },
    options.skipUrls ?? true,
  );
};

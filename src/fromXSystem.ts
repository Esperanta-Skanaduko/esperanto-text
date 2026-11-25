import { DEFAULT_PROTECTED_WORDS, SUPERSIGN_LETTERS } from './constants.js';
import { mapWords } from './mapWords.js';
import type { ConvertOptions } from './types.js';

const BY_BASE = new Map(SUPERSIGN_LETTERS.map((letter) => [letter.base, letter.unicode]));

/**
 * Converts x-system text (`cxu`, `Gxis`) to proper Esperanto letters (`ĉu`, `Ĝis`).
 * The letter `x` is not in the Esperanto alphabet, so the conversion has no
 * ambiguity apart from foreign words such as `Linux`, which are protected.
 * Case follows the base letter: `Cx`, `cx` and `CX` give `Ĉ`, `ĉ` and `Ĉ`.
 *
 * @param text - Text written in the x-system.
 * @param options - Protected words and URL handling.
 * @returns The same text with `cx gx hx jx sx ux` replaced by `ĉ ĝ ĥ ĵ ŝ ŭ`.
 */
export const fromXSystem = (text: string, options: ConvertOptions = {}): string => {
  const protectedWords = new Set((options.protectedWords ?? DEFAULT_PROTECTED_WORDS).map((word) => word.toLowerCase()));
  return mapWords(
    text,
    (word) => {
      if (protectedWords.has(word.toLowerCase())) return word;
      return word.replace(/([cghjsu])x/gi, (_match, letter: string) => {
        const converted = BY_BASE.get(letter.toLowerCase()) as string;
        return letter === letter.toUpperCase() ? converted.toUpperCase() : converted;
      });
    },
    options.skipUrls ?? true,
  );
};

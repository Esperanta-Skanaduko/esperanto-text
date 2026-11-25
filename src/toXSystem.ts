import { SUPERSIGN_LETTERS } from './constants.js';
import { isAllCaps } from './isAllCaps.js';
import { mapWords } from './mapWords.js';
import type { ConvertOptions } from './types.js';

const BY_UNICODE = new Map(SUPERSIGN_LETTERS.map((letter) => [letter.unicode, letter.base]));

/**
 * Converts proper Esperanto letters to the x-system: `ĉu` becomes `cxu`, `Ĝis`
 * becomes `Gxis`, and a capitalised word such as `ĈU` becomes `CXU`.
 * Input is normalised to NFC first, so a letter typed as `c` plus a combining
 * circumflex is recognised too.
 *
 * @param text - Text containing `ĉ ĝ ĥ ĵ ŝ ŭ` in any case.
 * @param options - URL handling.
 * @returns The text with every supersign letter replaced by its x-system spelling.
 */
export const toXSystem = (text: string, options: ConvertOptions = {}): string =>
  mapWords(
    text.normalize('NFC'),
    (word) => {
      const shout = isAllCaps(word);
      return word.replace(/[ĉĝĥĵŝŭĈĜĤĴŜŬ]/g, (letter) => {
        const base = BY_UNICODE.get(letter.toLowerCase()) as string;
        const isUpper = letter !== letter.toLowerCase();
        return isUpper ? (shout ? `${base.toUpperCase()}X` : `${base.toUpperCase()}x`) : `${base}x`;
      });
    },
    options.skipUrls ?? true,
  );

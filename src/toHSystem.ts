import { SUPERSIGN_LETTERS } from './constants.js';
import { isAllCaps } from './isAllCaps.js';
import { mapWords } from './mapWords.js';
import type { ConvertOptions } from './types.js';

const BY_UNICODE = new Map(SUPERSIGN_LETTERS.map((letter) => [letter.unicode, letter.h]));

/**
 * Converts proper Esperanto letters to the h-system: `ĉu` becomes `chu`, `ĵaŭdo`
 * becomes `jhaudo` (ŭ is written as a plain `u`). A capitalised word such as `ĈU`
 * becomes `CHU`. The result cannot always be converted back exactly, because a
 * plain `u` or `ch` can also be ordinary letters; see `fromHSystem`.
 *
 * @param text - Text containing `ĉ ĝ ĥ ĵ ŝ ŭ` in any case.
 * @param options - URL handling.
 * @returns The text with every supersign letter replaced by its h-system spelling.
 */
export const toHSystem = (text: string, options: ConvertOptions = {}): string =>
  mapWords(
    text.normalize('NFC'),
    (word) => {
      const shout = isAllCaps(word);
      return word.replace(/[ĉĝĥĵŝŭĈĜĤĴŜŬ]/g, (letter) => {
        const spelling = BY_UNICODE.get(letter.toLowerCase()) as string;
        if (letter === letter.toLowerCase()) return spelling;
        return shout ? spelling.toUpperCase() : spelling[0]!.toUpperCase() + spelling.slice(1);
      });
    },
    options.skipUrls ?? true,
  );

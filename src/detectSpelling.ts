import type { DetectedSpelling } from './types.js';

/**
 * Guesses how a text spells the supersign letters.
 *
 * - `unicode`: it already contains `ĉ ĝ ĥ ĵ ŝ ŭ`.
 * - `x`: it contains pairs such as `cx` or `ux`.
 * - `h`: it contains `ch gh jh sh hh` (a guess, since foreign words use them too).
 * - `mixed`: proper letters together with x-system pairs.
 * - `none`: nothing that looks like any of them.
 *
 * @param text - Any text.
 * @returns The detected spelling.
 */
export const detectSpelling = (text: string): DetectedSpelling => {
  const normalized = text.normalize('NFC');
  const hasUnicode = /[ĉĝĥĵŝŭĈĜĤĴŜŬ]/.test(normalized);
  const hasX = /[cghjsu]x/i.test(normalized);
  if (hasUnicode && hasX) return 'mixed';
  if (hasUnicode) return 'unicode';
  if (hasX) return 'x';
  if (/[cgjsh]h/i.test(normalized)) return 'h';
  return 'none';
};

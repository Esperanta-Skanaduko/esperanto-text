import { detectSpelling } from './detectSpelling.js';
import { fromHSystem } from './fromHSystem.js';
import { fromXSystem } from './fromXSystem.js';
import type { ConvertOptions, Spelling } from './types.js';

/**
 * Converts x-system or h-system text to proper Esperanto letters.
 * With `from: 'auto'` (the default) the spelling is detected: x-system and mixed
 * texts are converted as x-system, h-system guesses as h-system, and text that
 * already uses proper letters (or has nothing to convert) is returned unchanged.
 *
 * @param text - Text in any spelling.
 * @param from - `x`, `h`, or `auto`.
 * @param options - Protected words, exceptions and URL handling.
 * @returns Text with proper Esperanto letters.
 */
export const toUnicode = (text: string, from: Exclude<Spelling, 'unicode'> | 'auto' = 'auto', options: ConvertOptions = {}): string => {
  const spelling = from === 'auto' ? detectSpelling(text) : from;
  if (spelling === 'x' || spelling === 'mixed') return fromXSystem(text, options);
  if (spelling === 'h') return fromHSystem(text, options);
  return text;
};

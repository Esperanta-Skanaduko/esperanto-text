import { convertTyped } from '../convertTyped.js';
import { revertTyped } from '../revertTyped.js';
import type { TypedChange, TypingOptions } from '../typingTypes.js';

/**
 * Makes a text input or textarea turn `cx` into `ĉ` (and, if enabled, `ch` into
 * `ĉ`) as the user types. Pressing Backspace right after a conversion puts the
 * typed letters back, so `Linux` can still be written. Only characters typed
 * one at a time are converted; pasted text is left alone.
 *
 * For a React-controlled input use `useEsperantoInput` from `esperanto-text/react`
 * instead, because React ignores value changes made behind its back.
 *
 * @param element - The input or textarea to enhance.
 * @param options - Which spellings to convert.
 * @returns A function that removes the listeners again.
 */
export const attachEsperantoInput = (element: HTMLInputElement | HTMLTextAreaElement, options: TypingOptions = {}): (() => void) => {
  let lastChange: TypedChange | null = null;

  const onInput = (event: Event): void => {
    const typed = event as InputEvent;
    if (typed.inputType !== 'insertText' || typeof typed.data !== 'string' || typed.data.length !== 1) {
      lastChange = null;
      return;
    }
    const caret = element.selectionStart ?? element.value.length;
    const result = convertTyped(element.value, caret, options);
    lastChange = result.change;
    if (result.change) {
      element.setRangeText(result.change.replacement, result.change.index, result.change.index + result.change.original.length, 'end');
    }
  };

  const onKeyDown = (rawEvent: Event): void => {
    const event = rawEvent as KeyboardEvent;
    if (event.key !== 'Backspace' || lastChange === null || element.selectionStart !== element.selectionEnd) return;
    const reverted = revertTyped(element.value, element.selectionStart ?? 0, lastChange);
    if (reverted === null) {
      lastChange = null;
      return;
    }
    event.preventDefault();
    element.setRangeText(lastChange.original, lastChange.index, lastChange.index + lastChange.replacement.length, 'end');
    lastChange = null;
  };

  element.addEventListener('input', onInput);
  element.addEventListener('keydown', onKeyDown);
  return () => {
    element.removeEventListener('input', onInput);
    element.removeEventListener('keydown', onKeyDown);
  };
};

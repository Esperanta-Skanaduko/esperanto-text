import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent, RefObject } from 'react';
import { convertTyped } from '../convertTyped.js';
import { revertTyped } from '../revertTyped.js';
import type { TypedChange, TypingOptions } from '../typingTypes.js';

/** What `useEsperantoInput` returns. Spread `inputProps` onto an `<input>` or `<textarea>`. */
export interface EsperantoInputBinding<T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement> {
  /** The current text. */
  value: string;
  /** Replaces the text, for example to clear the field. Nothing is converted. */
  setValue: (value: string) => void;
  /** Props for the element: `value`, `onChange`, `onKeyDown` and a `ref`. */
  inputProps: {
    value: string;
    onChange: (event: ChangeEvent<T>) => void;
    onKeyDown: (event: KeyboardEvent<T>) => void;
    ref: RefObject<T | null>;
  };
}

/**
 * React hook for a controlled text field that turns `cx` into `ĉ` as the user
 * types, with Backspace undoing the last conversion. It keeps the caret where the
 * user expects it after React re-renders the value.
 *
 * Pass the element type as a type argument for a textarea: `useEsperantoInput<HTMLTextAreaElement>()`.
 *
 * @param initialValue - Starting text.
 * @param options - Which spellings to convert.
 * @returns The value, a setter, and the props to spread onto the field.
 */
export const useEsperantoInput = <T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement>(
  initialValue = '',
  options: TypingOptions = {},
): EsperantoInputBinding<T> => {
  const [value, setValue] = useState(initialValue);
  const ref = useRef<T | null>(null);
  const pendingCaret = useRef<number | null>(null);
  const lastChange = useRef<TypedChange | null>(null);

  useLayoutEffect(() => {
    if (pendingCaret.current !== null && ref.current) {
      ref.current.setSelectionRange(pendingCaret.current, pendingCaret.current);
      pendingCaret.current = null;
    }
  });

  const onChange = useCallback(
    (event: ChangeEvent<T>) => {
      const next = event.target.value;
      const caret = event.target.selectionStart ?? next.length;
      const native = event.nativeEvent as InputEvent;
      const wasTyped = native.inputType === 'insertText' && typeof native.data === 'string' && native.data.length === 1;
      if (!wasTyped) {
        lastChange.current = null;
        setValue(next);
        return;
      }
      const result = convertTyped(next, caret, options);
      lastChange.current = result.change;
      pendingCaret.current = result.caret;
      setValue(result.value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.x, options.h, options.exceptions],
  );

  const onKeyDown = useCallback((event: KeyboardEvent<T>) => {
    const target = event.currentTarget;
    if (event.key !== 'Backspace' || lastChange.current === null || target.selectionStart !== target.selectionEnd) return;
    const reverted = revertTyped(target.value, target.selectionStart ?? 0, lastChange.current);
    lastChange.current = null;
    if (reverted === null) return;
    event.preventDefault();
    pendingCaret.current = reverted.caret;
    setValue(reverted.value);
  }, []);

  return { value, setValue, inputProps: { value, onChange, onKeyDown, ref } };
};

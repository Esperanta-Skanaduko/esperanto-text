import type { HSystemException } from './constants.js';

/** Which spellings are converted while the user types. */
export interface TypingOptions {
  /** Convert `cx gx hx jx sx ux`. Default `true`. */
  readonly x?: boolean;
  /** Convert `ch gh hh jh sh`. Default `false`, because `ch` is also common in other languages. */
  readonly h?: boolean;
  /** h-system exceptions that must not convert while typing. Replaces the default list. */
  readonly exceptions?: readonly HSystemException[];
}

/** A conversion that just happened, kept so Backspace can undo it. */
export interface TypedChange {
  /** Index in the value where the replacement starts. */
  readonly index: number;
  /** The characters the user typed, for example `cx`. */
  readonly original: string;
  /** The letter that replaced them, for example `ĉ`. */
  readonly replacement: string;
}

/** One Esperanto letter that carries a supersign, in every spelling this library knows. */
export interface SupersignLetter {
  /** The letter with its supersign, lower case: `ĉ`. */
  readonly unicode: string;
  /** The plain base letter, lower case: `c`. */
  readonly base: string;
  /** The h-system spelling, lower case: `ch`. For `ŭ` this is plain `u`. */
  readonly h: string;
}

/** The six letters that need a supersign, with their base letter and h-system spelling. */
export const SUPERSIGN_LETTERS: readonly SupersignLetter[] = [
  { unicode: 'ĉ', base: 'c', h: 'ch' },
  { unicode: 'ĝ', base: 'g', h: 'gh' },
  { unicode: 'ĥ', base: 'h', h: 'hh' },
  { unicode: 'ĵ', base: 'j', h: 'jh' },
  { unicode: 'ŝ', base: 's', h: 'sh' },
  { unicode: 'ŭ', base: 'u', h: 'u' },
];

/**
 * Foreign words and names that contain a base letter followed by `x`, such as
 * `Linux` or `Redux`. The x-system would turn them into `Linŭ` and `Redŭ`, so
 * they are left alone by default. Compared case-insensitively against whole words.
 */
export const DEFAULT_PROTECTED_WORDS: readonly string[] = [
  'lux', 'flux', 'crux', 'dux', 'tux', 'redux', 'linux', 'deluxe', 'luxe', 'luxury', 'tuxedo', 'luxembourg',
];

/** Where in a word an h-system exception applies. */
export type ExceptionPosition = 'start' | 'whole';

/** A spelling that looks like the h-system but is not, so it must not be converted. */
export interface HSystemException {
  /** The word or word start, lower case, written in the h-system. */
  readonly text: string;
  /** `start`: the word begins with `text`. `whole`: the word is exactly `text`. */
  readonly at: ExceptionPosition;
  /** Why this spelling is not a supersign letter. */
  readonly why: string;
}

/**
 * Compounds and names where the plain letters really are two letters. The
 * h-system cannot tell them from a supersign letter by looking at the spelling,
 * so a short list of known cases is the only defence. It is deliberately small
 * and conservative; pass your own `exceptions` to extend it.
 */
export const DEFAULT_H_EXCEPTIONS: readonly HSystemException[] = [
  { text: 'flughaven', at: 'start', why: 'flugi + haveno (airport): g and h are separate letters' },
  { text: 'traur', at: 'start', why: 'tra + urbo (traurba): the u does not belong to an au pair' },
  { text: 'reuz', at: 'start', why: 're + uzi: the u starts a new part' },
  { text: 'reun', at: 'start', why: 're + unu-: the u starts a new part' },
  { text: 'nauro', at: 'start', why: 'Nauru (the country) keeps a plain u' },
  { text: 'nauru', at: 'start', why: 'Nauru (the country) keeps a plain u' },
];

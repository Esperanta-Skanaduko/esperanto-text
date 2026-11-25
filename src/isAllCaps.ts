/**
 * Tells whether a word is written in capitals and has more than one letter,
 * which decides between `Cx` and `CX` when converting `Ĉ`.
 *
 * @param word - A word made of letters.
 * @returns True for words such as `ĈU` or `AŬ`, false for `Ĉu` or `Ĉ`.
 */
export const isAllCaps = (word: string): boolean =>
  [...word].length > 1 && word === word.toUpperCase() && word !== word.toLowerCase();

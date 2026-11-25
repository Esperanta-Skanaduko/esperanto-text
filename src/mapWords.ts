const TOKENS = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+|[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)|([\p{L}\p{M}]+)/gu;

/**
 * Applies a function to every word of a text and leaves everything else exactly
 * as it was. A word is a run of letters; URLs and e-mail addresses are skipped
 * when `skipUrls` is on, so `https://example.com/lux` is never touched.
 *
 * @param text - The text to process.
 * @param convertWord - Receives each word and returns its replacement.
 * @param skipUrls - Leave URLs and e-mail addresses untouched.
 * @returns The text with every word replaced.
 */
export const mapWords = (text: string, convertWord: (word: string) => string, skipUrls: boolean): string =>
  text.replace(TOKENS, (match: string, url: string | undefined) => {
    if (url !== undefined) return skipUrls ? match : convertWord(match);
    return convertWord(match);
  });

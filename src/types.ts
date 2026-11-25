import type { HSystemException } from './constants.js';

/** A way of writing the six supersign letters. */
export type Spelling = 'unicode' | 'x' | 'h';

/** What `detectSpelling` can report about a text. */
export type DetectedSpelling = Spelling | 'mixed' | 'none';

/** Options shared by the text converters. */
export interface ConvertOptions {
  /** Leave URLs and e-mail addresses untouched. Default `true`. */
  readonly skipUrls?: boolean;
  /** Whole words (any case) that must not be converted from the x-system. Replaces the default list. */
  readonly protectedWords?: readonly string[];
  /** Known h-system look-alikes that must not be converted. Replaces the default list. */
  readonly exceptions?: readonly HSystemException[];
}

import { describe, expect, it } from 'vitest';
import { detectSpelling, fromHSystem, fromXSystem, toHSystem, toUnicode, toXSystem } from '../src/index.js';

const SENTENCE = {
  unicode: 'Morgaŭ estas ĵaŭdo. Mi devus aĉeti manĝaĵon.',
  x: 'Morgaux estas jxauxdo. Mi devus acxeti mangxajxon.',
  h: 'Morgau estas jhaudo. Mi devus acheti manghajhon.',
};

describe('x-system', () => {
  it('converts the six letters in lower and upper case', () => {
    expect(fromXSystem('cx gx hx jx sx ux')).toBe('ĉ ĝ ĥ ĵ ŝ ŭ');
    expect(fromXSystem('Cx Gx Hx Jx Sx Ux')).toBe('Ĉ Ĝ Ĥ Ĵ Ŝ Ŭ');
    expect(fromXSystem('CXU GXIS')).toBe('ĈU ĜIS');
  });

  it('converts a real sentence both ways', () => {
    expect(fromXSystem(SENTENCE.x)).toBe(SENTENCE.unicode);
    expect(toXSystem(SENTENCE.unicode)).toBe(SENTENCE.x);
  });

  it('writes capitalised words as CX when the whole word is in capitals', () => {
    expect(toXSystem('ĈU')).toBe('CXU');
    expect(toXSystem('Ĉu')).toBe('Cxu');
    expect(toXSystem('Ĉ')).toBe('Cx');
    expect(toXSystem('AŬTO')).toBe('AUXTO');
  });

  it('recognises a letter typed as a base letter plus a combining mark', () => {
    expect(toXSystem('ĉu')).toBe('cxu');
  });

  it('is exactly reversible for any text without a stray x', () => {
    const letters = 'abcĉdeĝfhĥijĵklmnoprsŝtuŭvz ABCĈDEĜHĤJĴSŜUŬ.,';
    let seed = 7;
    const next = () => (seed = (seed * 1103515245 + 12345) % 2147483648);
    for (let run = 0; run < 400; run += 1) {
      const text = Array.from({ length: 30 }, () => letters[next() % letters.length]).join('');
      expect(fromXSystem(toXSystem(text), { protectedWords: [] })).toBe(text);
    }
  });

  it('leaves foreign words and names that contain "ux" alone', () => {
    expect(fromXSystem('Linux, Redux kaj lux')).toBe('Linux, Redux kaj lux');
    expect(fromXSystem('Linux kaj cxu')).toBe('Linux kaj ĉu');
  });

  it('NEGATIVE CONTROL: without protection the same words are damaged', () => {
    expect(fromXSystem('Linux', { protectedWords: [] })).toBe('Linŭ');
  });

  it('skips URLs and e-mail addresses unless told not to', () => {
    const text = 'Vidu https://example.com/lux?cx=1 kaj ni@example.com kaj cxu';
    expect(fromXSystem(text)).toBe('Vidu https://example.com/lux?cx=1 kaj ni@example.com kaj ĉu');
    expect(fromXSystem('www.cxu.com', { skipUrls: false })).toBe('www.ĉu.com');
  });

  it('does not touch an x that is not after one of the six letters', () => {
    expect(fromXSystem('taxi, exa, xylofono, boxo')).toBe('taxi, exa, xylofono, boxo');
  });
});

describe('h-system', () => {
  it('converts the real-sentence example both ways (ŭ is a plain u)', () => {
    expect(toHSystem(SENTENCE.unicode)).toBe(SENTENCE.h);
    expect(fromHSystem(SENTENCE.h)).toBe(SENTENCE.unicode);
  });

  it('keeps the case of the base letter', () => {
    expect(toHSystem('Ĉu ĈU ĉu')).toBe('Chu CHU chu');
    expect(fromHSystem('Chu CHU chu')).toBe('Ĉu ĈU ĉu');
  });

  it('turns au and eu into aŭ and eŭ', () => {
    expect(fromHSystem('auto, neutrala, Europo')).toBe('aŭto, neŭtrala, Eŭropo');
  });

  it('does not touch iu, ou or uu, which are ordinary pairs', () => {
    expect(fromHSystem('iu, ĉiu, uu')).toBe('iu, ĉiu, uu');
  });

  it.each([
    ['flughaveno', 'flughaveno'],
    ['traurba promeno', 'traurba promeno'],
    ['reuzi', 'reuzi'],
    ['Nauro', 'Nauro'],
  ])('keeps the known exception %s as typed', (input, expected) => {
    expect(fromHSystem(input)).toBe(expected);
  });

  it('NEGATIVE CONTROL: without the exception list the compounds are converted wrongly', () => {
    expect(fromHSystem('flughaveno', { exceptions: [] })).toBe('fluĝaveno');
    expect(fromHSystem('traurba', { exceptions: [] })).toBe('traŭrba');
  });

  it('converts hh to ĥ', () => {
    expect(fromHSystem('hhoro')).toBe('ĥoro');
  });

  it('round-trips text without exceptions', () => {
    const text = 'Ĉu vi ŝatas ĵaŭdon kaj ĝardenojn? Eŭropo estas ĉirkaŭ ĥoro.';
    expect(fromHSystem(toHSystem(text))).toBe(text);
  });
});

describe('detectSpelling and toUnicode', () => {
  it('detects each spelling', () => {
    expect(detectSpelling(SENTENCE.unicode)).toBe('unicode');
    expect(detectSpelling(SENTENCE.x)).toBe('x');
    expect(detectSpelling(SENTENCE.h)).toBe('h');
    expect(detectSpelling('Ĉu vi parolas cxu?')).toBe('mixed');
    expect(detectSpelling('Saluton mondo')).toBe('none');
  });

  it('auto-converts by detected spelling and leaves real letters alone', () => {
    expect(toUnicode(SENTENCE.x)).toBe(SENTENCE.unicode);
    expect(toUnicode(SENTENCE.h)).toBe(SENTENCE.unicode);
    expect(toUnicode(SENTENCE.unicode)).toBe(SENTENCE.unicode);
    expect(toUnicode('Hello there')).toBe('Hello there');
  });

  it('honours an explicit spelling', () => {
    expect(toUnicode('chu', 'h')).toBe('ĉu');
    expect(toUnicode('cxu', 'x')).toBe('ĉu');
  });
});

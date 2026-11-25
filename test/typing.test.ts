import { describe, expect, it } from 'vitest';
import { convertTyped, revertTyped } from '../src/index.js';

describe('convertTyped', () => {
  it('converts cx just after the x is typed and moves the caret back by one', () => {
    const result = convertTyped('Ni parolas cx', 13);
    expect(result.value).toBe('Ni parolas ĉ');
    expect(result.caret).toBe(12);
    expect(result.change).toEqual({ index: 11, original: 'cx', replacement: 'ĉ' });
  });

  it('keeps the case: Cx gives Ĉ, cX gives ĉ', () => {
    expect(convertTyped('Cx', 2).value).toBe('Ĉ');
    expect(convertTyped('cX', 2).value).toBe('ĉ');
  });

  it('converts in the middle of a text and keeps what follows the caret', () => {
    const result = convertTyped('acxeti', 3);
    expect(result.value).toBe('aĉeti');
    expect(result.caret).toBe(2);
  });

  it('does nothing for other pairs, a lone letter or h-system when it is off', () => {
    expect(convertTyped('ax', 2).change).toBeNull();
    expect(convertTyped('x', 1).change).toBeNull();
    expect(convertTyped('ch', 2).change).toBeNull();
  });

  it('converts ch only when the h-system is enabled, and never uh', () => {
    expect(convertTyped('ch', 2, { h: true }).value).toBe('ĉ');
    expect(convertTyped('uh', 2, { h: true }).change).toBeNull();
    expect(convertTyped('cx', 2, { x: false, h: true }).change).toBeNull();
  });

  it('does not convert inside the start of a known h-system exception', () => {
    expect(convertTyped('flugh', 5, { h: true }).change).toBeNull();
    expect(convertTyped('flugh', 5, { h: true, exceptions: [] }).value).toBe('fluĝ');
    expect(convertTyped('sugh', 4, { h: true }).value).toBe('suĝ');
  });
});

describe('revertTyped', () => {
  it('puts the typed letters back right after a conversion', () => {
    const typed = convertTyped('Linux', 5);
    expect(typed.value).toBe('Linŭ');
    const reverted = revertTyped(typed.value, typed.caret, typed.change!);
    expect(reverted).toEqual({ value: 'Linux', caret: 5 });
  });

  it('refuses when the caret or the text moved', () => {
    const typed = convertTyped('cx', 2);
    expect(revertTyped('ĉ', 0, typed.change!)).toBeNull();
    expect(revertTyped('ĉa', 2, typed.change!)).toBeNull();
    expect(revertTyped('ŝ', 1, typed.change!)).toBeNull();
  });
});

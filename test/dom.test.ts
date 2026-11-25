import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { attachEsperantoInput } from '../src/dom/index.js';

const user = userEvent.setup();

let input: HTMLInputElement;
let detach: () => void;

beforeEach(() => {
  input = document.createElement('input');
  document.body.appendChild(input);
});
afterEach(() => {
  detach?.();
  input.remove();
});

describe('attachEsperantoInput', () => {
  it('turns typed cx into ĉ', async () => {
    detach = attachEsperantoInput(input);
    await user.type(input, 'Ni parolas cxiam');
    expect(input.value).toBe('Ni parolas ĉiam');
  });

  it('puts the letters back when Backspace follows a conversion, then types on normally', async () => {
    detach = attachEsperantoInput(input);
    await user.type(input, 'Linux');
    expect(input.value).toBe('Linŭ');
    await user.type(input, '{Backspace}');
    expect(input.value).toBe('Linux');
    await user.type(input, 'es');
    expect(input.value).toBe('Linuxes');
  });

  it('Backspace deletes normally when nothing was just converted', async () => {
    detach = attachEsperantoInput(input);
    await user.type(input, 'abc{Backspace}');
    expect(input.value).toBe('ab');
  });

  it('converts ch only when asked to', async () => {
    detach = attachEsperantoInput(input, { h: true });
    await user.type(input, 'chu');
    expect(input.value).toBe('ĉu');
  });

  it('NEGATIVE CONTROL: after detaching nothing is converted', async () => {
    attachEsperantoInput(input)();
    detach = () => undefined;
    await user.type(input, 'cxu');
    expect(input.value).toBe('cxu');
  });

  it('does not convert pasted text', async () => {
    detach = attachEsperantoInput(input);
    input.focus();
    await user.paste('cxu');
    expect(input.value).toBe('cxu');
  });
});

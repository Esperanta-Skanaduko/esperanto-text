import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useEsperantoInput } from '../src/react/index.js';
import type { TypingOptions } from '../src/index.js';

const user = userEvent.setup();

const Field = ({ options }: { options?: TypingOptions }) => {
  const { value, inputProps } = useEsperantoInput('', options);
  return (
    <>
      <input aria-label="field" {...inputProps} />
      <output>{value}</output>
    </>
  );
};

describe('useEsperantoInput', () => {
  it('converts as the user types and keeps the caret in place', async () => {
    render(<Field />);
    const field = screen.getByLabelText('field') as HTMLInputElement;
    await user.type(field, 'cxu vi');
    expect(field.value).toBe('ĉu vi');
    expect(screen.getByRole('status').textContent).toBe('ĉu vi');
  });

  it('keeps the caret after a conversion in the middle of the text', async () => {
    render(<Field />);
    const field = screen.getByLabelText('field') as HTMLInputElement;
    await user.type(field, 'aeti');
    await user.type(field, 'cx', { initialSelectionStart: 1, initialSelectionEnd: 1 });
    expect(field.value).toBe('aĉeti');
    expect(field.selectionStart).toBe(2);
  });

  it('Backspace right after a conversion restores what was typed', async () => {
    render(<Field />);
    const field = screen.getByLabelText('field') as HTMLInputElement;
    await user.type(field, 'Linux{Backspace}');
    expect(field.value).toBe('Linux');
  });

  it('converts ch when the h-system is on', async () => {
    render(<Field options={{ h: true }} />);
    const field = screen.getByLabelText('field') as HTMLInputElement;
    await user.type(field, 'chu');
    expect(field.value).toBe('ĉu');
  });
});

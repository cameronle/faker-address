import { describe, expect, it } from 'vitest';
import { clampCount, escapeHtml } from './utils';

describe('utility helpers', () => {
  it('escapes generated values before rendering HTML', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('clamps the requested generation count', () => {
    expect(clampCount('0')).toBe(1);
    expect(clampCount('25')).toBe(25);
    expect(clampCount('999')).toBe(50);
    expect(clampCount('nope')).toBe(1);
  });
});

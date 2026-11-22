import { describe, expect, it } from 'vitest';
import { countryOptions, languageOptionsForCountry } from './localeCatalog';

describe('country catalog', () => {
  it('keeps only country or region entries', () => {
    expect(countryOptions.some((item) => item.key === 'OTHER')).toBe(false);
    expect(countryOptions.some((item) => item.key === 'US' && item.label === '美国')).toBe(true);
  });

  it('keeps the selected country language list', () => {
    expect(languageOptionsForCountry('US').map((item) => item.code)).toContain('en');
  });
});

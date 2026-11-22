import { describe, expect, it } from 'vitest';
import { generateProfiles } from './generator';
import { availableLocaleCodes } from './generated/locale-loaders';

describe('Faker locale generation', () => {
  it('generates a Japanese profile with the expected shape', async () => {
    const [profile] = await generateProfiles('ja', 1);
    expect(profile.locale).toBe('ja');
    expect(profile.name).toBeTruthy();
    expect(profile.address).toBeTruthy();
    expect(profile.postcode).toBeTruthy();
    expect(profile.email).toContain('@');
    expect(profile.country).toBe('日本');
  });

  it.each(availableLocaleCodes)('loads and generates locale %s', async (code) => {
    const [profile] = await generateProfiles(code, 1);
    expect(profile.locale).toBe(code);
    expect(profile.name).toBeTruthy();
    expect(profile.address).toBeTruthy();
  });
});

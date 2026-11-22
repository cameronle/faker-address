import type { Faker } from '@faker-js/faker';
import { countryLabel, localeLabel } from './localeCatalog';
import { localeLoaders } from './generated/locale-loaders';
import type { GeneratedProfile } from './types';

const cache = new Map<string, Faker>();
let fallbackPromise: Promise<Faker> | undefined;

type FakerModule = { faker?: Faker; default?: Faker };

export async function loadFaker(code: string): Promise<Faker> {
  const cached = cache.get(code);
  if (cached) return cached;
  const loader = localeLoaders[code];
  if (!loader) throw new Error(`Unknown Faker locale: ${code}`);
  const module = (await loader()) as FakerModule;
  const instance = module.faker ?? module.default;
  if (!instance) throw new Error(`Faker locale ${code} did not expose a faker instance`);
  cache.set(code, instance);
  return instance;
}

async function loadFallbackFaker(): Promise<Faker> {
  fallbackPromise ??= loadFaker('en');
  return fallbackPromise;
}

function safe<T>(
  field: string,
  selected: () => T,
  fallback: () => T,
  fallbackFields: string[],
): T {
  try {
    const value = selected();
    if (value !== undefined && value !== null && String(value).trim() !== '') return value;
  } catch {
    // Use the complete English locale for fields not covered by the selected locale.
  }
  fallbackFields.push(field);
  return fallback();
}

export async function generateProfiles(code: string, count: number): Promise<GeneratedProfile[]> {
  const selected = await loadFaker(code);
  const fallback = await loadFallbackFaker();
  return Array.from({ length: Math.max(1, Math.min(50, count)) }, () => {
    const fallbackFields: string[] = [];
    const firstName = safe('firstName', () => selected.person.firstName(), () => fallback.person.firstName(), fallbackFields);
    const lastName = safe('lastName', () => selected.person.lastName(), () => fallback.person.lastName(), fallbackFields);
    const street = safe('street', () => selected.location.streetAddress(), () => fallback.location.streetAddress(), fallbackFields);
    const city = safe('city', () => selected.location.city(), () => fallback.location.city(), fallbackFields);
    const state = safe('state', () => selected.location.state(), () => fallback.location.state(), fallbackFields);
    const postcode = safe('postcode', () => selected.location.zipCode(), () => fallback.location.zipCode(), fallbackFields);
    const phone = safe('phone', () => selected.phone.number(), () => fallback.phone.number(), fallbackFields);
    const company = safe('company', () => selected.company.name(), () => fallback.company.name(), fallbackFields);
    const email = safe(
      'email',
      () => selected.internet.email({ firstName, lastName }),
      () => fallback.internet.email({ firstName, lastName }),
      fallbackFields,
    );
    const name = `${firstName} ${lastName}`.trim();
    const country = countryLabel(code);
    const address = [street, city, state, postcode, country].filter(Boolean).join(', ');

    return {
      locale: code,
      localeLabel: localeLabel(code),
      name,
      address,
      street,
      city,
      state,
      postcode,
      phone,
      email,
      company,
      country,
      fallbackFields: [...new Set(fallbackFields)],
      generatedAt: new Date().toISOString(),
    };
  });
}

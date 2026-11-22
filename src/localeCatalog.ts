import { availableLocaleCodes } from './generated/locale-loaders';

const languageNames = new Intl.DisplayNames(['zh-CN'], { type: 'language' });
const regionNames = new Intl.DisplayNames(['zh-CN'], { type: 'region' });

const defaultRegions: Record<string, string> = {
  af_ZA: 'ZA', bn_BD: 'BD', da: 'DK', de: 'DE', dv: 'MV', el: 'GR', fi: 'FI', hr: 'HR',
  hu: 'HU', hy: 'AM', id_ID: 'ID', is_IS: 'IS', it: 'IT', ja: 'JP', ko: 'KR', lv: 'LV',
  nl: 'NL', ne: 'NP', pl: 'PL', ro: 'RO', ru: 'RU', sk: 'SK', sv: 'SE', th: 'TH', tr: 'TR',
  uk: 'UA', vi: 'VN', zh_CN: 'CN', zh_TW: 'TW', zu_ZA: 'ZA',
};

const specialNames: Record<string, string> = {
  en_AU_ocker: '英语（澳大利亚·俚语）',
  en_BORK: '英语（Bork 测试方言）',
  sr_RS_latin: '塞尔维亚语（拉丁字母）',
  mn_MN_cyrl: '蒙古语（西里尔字母）',
  uz_UZ_latin: '乌兹别克语（拉丁字母）',
};

function languageCodeFor(code: string): string {
  return code.split('_')[0];
}

function regionCodeFor(code: string): string {
  const explicit = code.split('_').find((part) => /^[A-Z]{2}$/.test(part));
  return explicit ?? defaultRegions[code] ?? 'OTHER';
}

function languageLabelFor(code: string): string {
  const language = languageCodeFor(code);
  try {
    return languageNames.of(language) ?? language;
  } catch {
    return language;
  }
}

function countryLabelFor(code: string): string {
  const region = regionCodeFor(code);
  if (region === 'OTHER') return '其他语言';
  try {
    return region.length === 2 ? regionNames.of(region) ?? languageLabelFor(code) : languageLabelFor(code);
  } catch {
    return languageLabelFor(code);
  }
}

function labelFor(code: string): string {
  if (specialNames[code]) return specialNames[code];
  const normalized = code.replaceAll('_', '-');
  try {
    const name = languageNames.of(normalized);
    if (name && name !== normalized) return name;
  } catch {
    // Fall through to a readable code label.
  }
  return `${languageLabelFor(code)}（${countryLabelFor(code)}）`;
}

export type LocaleOption = {
  code: string;
  label: string;
  countryKey: string;
  countryLabel: string;
  languageCode: string;
  languageLabel: string;
};

export type CountryOption = {
  key: string;
  label: string;
};

export type LanguageOption = {
  code: string;
  label: string;
  localeCode: string;
};

export const localeOptions: LocaleOption[] = availableLocaleCodes.map((code) => ({
  code,
  label: labelFor(code),
  countryKey: regionCodeFor(code),
  countryLabel: countryLabelFor(code),
  languageCode: languageCodeFor(code),
  languageLabel: languageLabelFor(code),
}));

export const countryOptions: CountryOption[] = [...new Map(
  localeOptions.map((item) => [item.countryKey, { key: item.countryKey, label: item.countryLabel }]),
).values()].sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));

export function languageOptionsForCountry(countryKey: string): LanguageOption[] {
  const grouped = new Map<string, LocaleOption>();
  for (const item of localeOptions.filter((locale) => locale.countryKey === countryKey)) {
    const current = grouped.get(item.languageCode);
    const isSpecial = item.code.includes('BORK') || item.code.includes('ocker') || item.code.includes('latin') || item.code.includes('cyrl');
    if (!current || (!isSpecial && current.code.includes('_'))) grouped.set(item.languageCode, item);
  }
  return [...grouped.values()]
    .sort((a, b) => a.languageLabel.localeCompare(b.languageLabel, 'zh-CN'))
    .map((item) => ({ code: item.languageCode, label: item.languageLabel, localeCode: item.code }));
}

export function localeForSelection(countryKey: string, languageCode: string): string {
  const match = localeOptions.find((item) => item.countryKey === countryKey && item.languageCode === languageCode);
  return match?.code ?? localeOptions.find((item) => item.countryKey === countryKey)?.code ?? countryKey;
}

export function localeLabel(code: string): string {
  return localeOptions.find((item) => item.code === code)?.label ?? code;
}

import { availableLocaleCodes } from './generated/locale-loaders';

const languageNames = new Intl.DisplayNames(['zh-CN'], { type: 'language' });
const regionNames = new Intl.DisplayNames(['zh-CN'], { type: 'region' });

const specialNames: Record<string, string> = {
  en_AU_ocker: '英语（澳大利亚·俚语）',
  en_BORK: '英语（Bork 测试方言）',
  sr_RS_latin: '塞尔维亚语（拉丁字母）',
  mn_MN_cyrl: '蒙古语（西里尔字母）',
  uz_UZ_latin: '乌兹别克语（拉丁字母）',
};

const searchAliases: Record<string, string> = {
  af_ZA: '南非 south africa', ar: '阿拉伯 arabic', bn_BD: '孟加拉 bangladesh', cs_CZ: '捷克 czechia',
  de: '德国 germany', de_AT: '奥地利 austria', de_CH: '瑞士 switzerland', en_AU: '澳大利亚 australia',
  en_CA: '加拿大 canada', en_GB: '英国 uk united kingdom', en_HK: '香港 hong kong', en_IN: '印度 india',
  en_US: '美国 united states usa', en_ZA: '南非 south africa', es_MX: '墨西哥 mexico', fr_CA: '加拿大 canada',
  fr_CH: '瑞士 switzerland', id_ID: '印度尼西亚 indonesia', is_IS: '冰岛 iceland', it: '意大利 italy',
  ja: '日本 japan', ka_GE: '格鲁吉亚 georgia', ko: '韩国 korea south korea', mn_MN_cyrl: '蒙古 mongolia',
  nb_NO: '挪威 norway', nl_BE: '比利时 belgium', pt_BR: '巴西 brazil', pt_PT: '葡萄牙 portugal',
  ro_MD: '摩尔多瓦 moldova', ru: '俄罗斯 russia', sl_SI: '斯洛文尼亚 slovenia', sv: '瑞典 sweden',
  ta_IN: '印度 india', th: '泰国 thailand', tr: '土耳其 turkey', uk: '乌克兰 ukraine',
  uz_UZ_latin: '乌兹别克斯坦 uzbekistan', vi: '越南 vietnam', zh_CN: '中国 china', zh_TW: '台湾 taiwan', zu_ZA: '南非 south africa',
};

function labelFor(code: string): string {
  if (specialNames[code]) return specialNames[code];
  const normalized = code.replaceAll('_', '-');
  try {
    const name = languageNames.of(normalized);
    if (name && name !== normalized) return name;
  } catch {
    // Fall through to a readable code label.
  }
  const [language, region] = code.split('_');
  try {
    const languageLabel = languageNames.of(language) ?? language;
    const regionLabel = region && region.length === 2 ? regionNames.of(region) : undefined;
    return regionLabel ? `${languageLabel}（${regionLabel}）` : languageLabel;
  } catch {
    return code;
  }
}

export type LocaleOption = {
  code: string;
  label: string;
  searchText: string;
};

export const localeOptions: LocaleOption[] = availableLocaleCodes.map((code) => {
  const label = labelFor(code);
  return { code, label, searchText: `${code} ${label} ${searchAliases[code] ?? ''}`.toLowerCase() };
});

export function localeLabel(code: string): string {
  return localeOptions.find((item) => item.code === code)?.label ?? code;
}

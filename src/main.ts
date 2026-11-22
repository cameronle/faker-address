import {
  countryOptions,
  languageOptionsForCountry,
  localeForSelection,
} from './localeCatalog';
import { generateProfiles } from './generator';
import { clampCount, copyText, escapeHtml } from './utils';
import {
  ALL_US_LOCATIONS,
  usCitiesForState,
  usStateOptions,
  type UsLocationFilter,
} from './usLocations';
import type { GeneratedProfile } from './types';
import './styles.css';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Missing #app root');

const themeMedia = window.matchMedia('(prefers-color-scheme: light)');
const themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
const syncThemeColor = (event?: MediaQueryListEvent): void => {
  if (themeMeta) themeMeta.content = (event?.matches ?? themeMedia.matches) ? '#f6f7fb' : '#0d1020';
};
syncThemeColor();
themeMedia.addEventListener('change', syncThemeColor);

let selectedCountry = countryOptions.find((item) => item.key === 'JP')?.key ?? countryOptions[0]?.key ?? 'US';
let selectedLanguage = languageOptionsForCountry(selectedCountry)[0]?.code ?? 'en';
let selectedUsState = ALL_US_LOCATIONS;
let selectedUsCity = ALL_US_LOCATIONS;
let count = 1;
let results: GeneratedProfile[] = [];

app.innerHTML = `
  <main class="app-shell">
    <header class="page-header">
      <h1>地址生成器</h1>
      <p>选择国家、语言和数量，生成测试资料。</p>
    </header>

    <section class="controls" aria-label="生成设置">
      <label class="field">
        <span>国家 / 地区</span>
        <select id="countrySelect" aria-label="选择国家或地区"></select>
      </label>
      <label class="field">
        <span>语言</span>
        <select id="languageSelect" aria-label="选择语言"></select>
      </label>
      <label class="field count-field">
        <span>数量</span>
        <input id="countInput" type="number" min="1" max="50" value="1" inputmode="numeric" />
      </label>
      <button class="generate-button" id="generateButton" type="button">生成</button>
    </section>

    <section class="us-filters" id="usFilters" aria-label="美国州和城市筛选" hidden>
      <label class="field">
        <span>美国州</span>
        <select id="usStateSelect" aria-label="选择美国州"></select>
      </label>
      <label class="field">
        <span>城市</span>
        <select id="usCitySelect" aria-label="选择美国城市"></select>
      </label>
    </section>

    <section class="results-section" aria-live="polite">
      <div class="results-title"><h2>结果</h2><span id="resultCount"></span></div>
      <div id="results" class="results-grid empty-state">选择条件后点击生成</div>
    </section>

    <p class="notice">仅供开发测试，不保证是真实地址，不用于付款、账单、实名或邮寄。</p>
  </main>
`;

const countrySelect = document.querySelector<HTMLSelectElement>('#countrySelect')!;
const languageSelect = document.querySelector<HTMLSelectElement>('#languageSelect')!;
const countInput = document.querySelector<HTMLInputElement>('#countInput')!;
const generateButton = document.querySelector<HTMLButtonElement>('#generateButton')!;
const resultCount = document.querySelector<HTMLSpanElement>('#resultCount')!;
const resultsContainer = document.querySelector<HTMLDivElement>('#results')!;
const usFilters = document.querySelector<HTMLElement>('#usFilters')!;
const usStateSelect = document.querySelector<HTMLSelectElement>('#usStateSelect')!;
const usCitySelect = document.querySelector<HTMLSelectElement>('#usCitySelect')!;

function renderCountries(): void {
  countrySelect.innerHTML = countryOptions
    .map((item) => `<option value="${escapeHtml(item.key)}">${escapeHtml(item.label)}</option>`)
    .join('');
  countrySelect.value = selectedCountry;
}

function renderLanguages(): void {
  const options = languageOptionsForCountry(selectedCountry);
  if (!options.some((item) => item.code === selectedLanguage)) selectedLanguage = options[0]?.code ?? 'en';
  languageSelect.innerHTML = options
    .map((item) => `<option value="${escapeHtml(item.code)}">${escapeHtml(item.label)}</option>`)
    .join('');
  languageSelect.value = selectedLanguage;
}

function renderUsCities(): void {
  const cities = selectedUsState === ALL_US_LOCATIONS ? [] : usCitiesForState(selectedUsState);
  usCitySelect.innerHTML = [
    `<option value="${ALL_US_LOCATIONS}">全部城市</option>`,
    ...cities.map((location) => `<option value="${escapeHtml(location.city)}">${escapeHtml(location.city)}</option>`),
  ].join('');
  if (!cities.some((location) => location.city === selectedUsCity)) selectedUsCity = ALL_US_LOCATIONS;
  usCitySelect.value = selectedUsCity;
  usCitySelect.disabled = selectedUsState === ALL_US_LOCATIONS;
}

function renderUsFilters(): void {
  const visible = selectedCountry === 'US';
  usFilters.hidden = !visible;
  if (!visible) return;
  usStateSelect.innerHTML = [
    `<option value="${ALL_US_LOCATIONS}">全部州</option>`,
    ...usStateOptions.map((state) => `<option value="${escapeHtml(state.value)}">${escapeHtml(state.label)}</option>`),
  ].join('');
  usStateSelect.value = selectedUsState;
  renderUsCities();
}

function detailRow(label: string, value: string, full = false): string {
  return `<div class="detail-row${full ? ' full-address' : ''}" data-copy-row="${escapeHtml(value)}"><span>${escapeHtml(label)}</span><div><strong>${escapeHtml(value || '—')}</strong><button class="copy-field" type="button" data-copy="${escapeHtml(value)}" aria-label="复制${escapeHtml(label)}">⧉</button></div></div>`;
}

function renderResults(): void {
  resultCount.textContent = results.length ? `${results.length} 条` : '';
  if (!results.length) {
    resultsContainer.className = 'results-grid empty-state';
    resultsContainer.textContent = '选择条件后点击生成';
    return;
  }
  resultsContainer.className = 'results-grid';
  resultsContainer.innerHTML = results.map((profile, index) => {
    const fullAddress = [profile.street, profile.city, profile.state, profile.postcode, profile.country]
      .filter(Boolean)
      .join('，');
    return `
    <article class="result-card">
      <div class="card-top"><span>${String(index + 1).padStart(2, '0')}</span><span>${escapeHtml(profile.country)}</span></div>
      <h3>地址详情</h3>
      <div class="detail-table">
        ${detailRow('街道', profile.street)}
        ${detailRow('城市', profile.city)}
        ${detailRow('州 / 省 / 地区', profile.state)}
        ${detailRow('邮编', profile.postcode)}
        ${detailRow('国家', profile.country)}
        ${detailRow('电话', profile.phone)}
        ${detailRow('完整地址', fullAddress, true)}
      </div>
    </article>
  `;
  }).join('');
}

function setBusy(busy: boolean): void {
  generateButton.disabled = busy;
  generateButton.textContent = busy ? '生成中…' : '生成';
}

countrySelect.addEventListener('change', () => {
  selectedCountry = countrySelect.value;
  renderLanguages();
  renderUsFilters();
});

usStateSelect.addEventListener('change', () => {
  selectedUsState = usStateSelect.value;
  selectedUsCity = ALL_US_LOCATIONS;
  renderUsCities();
});

usCitySelect.addEventListener('change', () => {
  selectedUsCity = usCitySelect.value;
});

languageSelect.addEventListener('change', () => {
  selectedLanguage = languageSelect.value;
});

countInput.addEventListener('change', () => {
  count = clampCount(countInput.value);
  countInput.value = String(count);
});

generateButton.addEventListener('click', async () => {
  const locale = localeForSelection(selectedCountry, selectedLanguage);
  const usFilter: UsLocationFilter | undefined = selectedCountry === 'US' && selectedUsState !== ALL_US_LOCATIONS
    ? { stateCode: selectedUsState, city: selectedUsCity }
    : undefined;
  setBusy(true);
  try {
    results = await generateProfiles(locale, count, usFilter);
    renderResults();
  } catch (error) {
    resultCount.textContent = '';
    resultsContainer.className = 'results-grid empty-state error-state';
    resultsContainer.textContent = `生成失败：${error instanceof Error ? error.message : String(error)}`;
  } finally {
    setBusy(false);
  }
});

resultsContainer.addEventListener('click', async (event) => {
  const target = event.target as HTMLElement;
  const button = target.closest<HTMLButtonElement>('[data-copy]');
  const row = target.closest<HTMLElement>('[data-copy-row]');
  const value = button?.dataset.copy ?? row?.dataset.copyRow;
  if (value === undefined) return;
  const copied = await copyText(value);
  const feedbackButton = button ?? row?.querySelector<HTMLButtonElement>('.copy-field');
  if (feedbackButton) {
    feedbackButton.textContent = copied ? '✓' : '×';
    window.setTimeout(() => { feedbackButton.textContent = '⧉'; }, 1200);
  }
});

renderCountries();
renderLanguages();
renderUsFilters();
renderResults();

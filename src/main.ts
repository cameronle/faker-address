import {
  countryOptions,
  languageOptionsForCountry,
  localeForSelection,
  localeLabel,
} from './localeCatalog';
import { generateProfiles } from './generator';
import { clampCount, copyText, escapeHtml } from './utils';
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

function field(label: string, value: string): string {
  return `<div class="data-field"><span>${escapeHtml(label)}</span><div><strong>${escapeHtml(value || '—')}</strong><button class="copy-field" type="button" data-copy="${escapeHtml(value)}" aria-label="复制${escapeHtml(label)}">复制</button></div></div>`;
}

function renderResults(): void {
  resultCount.textContent = results.length ? `${results.length} 条` : '';
  if (!results.length) {
    resultsContainer.className = 'results-grid empty-state';
    resultsContainer.textContent = '选择条件后点击生成';
    return;
  }
  resultsContainer.className = 'results-grid';
  resultsContainer.innerHTML = results.map((profile, index) => `
    <article class="result-card">
      <div class="card-top"><span>${String(index + 1).padStart(2, '0')}</span><span>${escapeHtml(profile.localeLabel)}</span></div>
      <div class="data-fields">
        ${field('姓名', profile.name)}
        ${field('地址', profile.address)}
        ${field('城市 / 州省', [profile.city, profile.state].filter(Boolean).join(' · '))}
        ${field('邮编', profile.postcode)}
        ${field('电话', profile.phone)}
        ${field('邮箱', profile.email)}
      </div>
    </article>
  `).join('');
}

function setBusy(busy: boolean): void {
  generateButton.disabled = busy;
  generateButton.textContent = busy ? '生成中…' : '生成';
}

countrySelect.addEventListener('change', () => {
  selectedCountry = countrySelect.value;
  renderLanguages();
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
  setBusy(true);
  try {
    results = await generateProfiles(locale, count);
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
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-copy]');
  if (!button) return;
  const copied = await copyText(button.dataset.copy ?? '');
  button.textContent = copied ? '已复制' : '失败';
  window.setTimeout(() => { button.textContent = '复制'; }, 1200);
});

renderCountries();
renderLanguages();
renderResults();

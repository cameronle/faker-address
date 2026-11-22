import { localeOptions } from './localeCatalog';
import { generateProfiles } from './generator';
import { clampCount, copyText, escapeHtml } from './utils';
import type { GeneratedProfile } from './types';
import './styles.css';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Missing #app root');

let selectedLocale = localeOptions.find((item) => item.code === 'ja')?.code ?? localeOptions[0]?.code ?? 'en';
let count = 1;
let results: GeneratedProfile[] = [];
let localeFilter = '';

app.innerHTML = `
  <div class="shell">
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">✦</div>
        <div>
          <p class="eyebrow">LOCAL · SYNTHETIC DATA</p>
          <h1>Faker Atlas</h1>
        </div>
      </div>
      <button class="icon-button" id="themeToggle" type="button" aria-label="切换主题">☾</button>
    </header>

    <main class="main-content">
      <section class="hero">
        <div>
          <p class="eyebrow accent">ALL LOCALES · ZERO BACKEND</p>
          <h2>随手捏一组<br /><span>像真的测试资料。</span></h2>
          <p class="hero-copy">选择 Faker 的任意语言或地区，数据在浏览器本地生成，不上传、不存储。</p>
        </div>
        <div class="hero-orbit" aria-hidden="true"><span>JP</span><span>US</span><span>DE</span><span>BR</span></div>
      </section>

      <section class="control-panel" aria-label="生成设置">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">01 / CONFIGURE</p>
            <h3>选择语言与地区</h3>
          </div>
          <span class="locale-count">${localeOptions.length} locales</span>
        </div>
        <div class="controls-grid">
          <label class="field locale-field">
            <span>搜索 locale</span>
            <input id="localeFilter" type="search" placeholder="例如 Japan / ja / Deutsch" autocomplete="off" />
          </label>
          <label class="field">
            <span>Faker locale</span>
            <select id="localeSelect" aria-label="选择 Faker locale"></select>
          </label>
          <label class="field count-field">
            <span>生成数量</span>
            <input id="countInput" type="number" min="1" max="50" value="1" inputmode="numeric" />
          </label>
          <button class="primary-button" id="generateButton" type="button"><span>生成资料</span><b>↗</b></button>
        </div>
        <div class="selected-meta" id="selectedMeta"></div>
      </section>

      <section class="results-section" aria-live="polite">
        <div class="results-heading">
          <div>
            <p class="eyebrow">02 / RESULTS</p>
            <h3>生成结果</h3>
          </div>
          <div class="result-actions">
            <button class="secondary-button" id="copyJson" type="button" disabled>复制 JSON</button>
            <button class="secondary-button" id="downloadJson" type="button" disabled>下载 JSON</button>
          </div>
        </div>
        <div id="results" class="results-grid empty-state">
          <div class="empty-icon">◎</div>
          <p>点击「生成资料」，在浏览器本地生成一组测试数据。</p>
        </div>
      </section>

      <aside class="notice">
        <span class="notice-icon">i</span>
        <p><strong>仅用于开发与测试。</strong> Faker 生成的是合成数据，不保证真实存在；不要用于付款、账单、实名验证或真实邮寄。</p>
      </aside>
    </main>

    <footer><span>Faker Atlas</span><span>Powered by <a href="https://github.com/faker-js/faker" target="_blank" rel="noreferrer">@faker-js/faker</a></span></footer>
  </div>
`;

const localeSelect = document.querySelector<HTMLSelectElement>('#localeSelect')!;
const localeFilterInput = document.querySelector<HTMLInputElement>('#localeFilter')!;
const countInput = document.querySelector<HTMLInputElement>('#countInput')!;
const selectedMeta = document.querySelector<HTMLDivElement>('#selectedMeta')!;
const resultsContainer = document.querySelector<HTMLDivElement>('#results')!;
const generateButton = document.querySelector<HTMLButtonElement>('#generateButton')!;
const copyJsonButton = document.querySelector<HTMLButtonElement>('#copyJson')!;
const downloadJsonButton = document.querySelector<HTMLButtonElement>('#downloadJson')!;

function renderLocaleOptions(): void {
  const filtered = localeOptions.filter((item) => item.searchText.includes(localeFilter.toLowerCase()));
  localeSelect.innerHTML = filtered.length
    ? filtered.map((item) => `<option value="${escapeHtml(item.code)}">${escapeHtml(item.label)} · ${escapeHtml(item.code)}</option>`).join('')
    : '<option value="">没有匹配的 locale</option>';
  if (filtered.some((item) => item.code === selectedLocale)) {
    localeSelect.value = selectedLocale;
  } else if (filtered[0]) {
    selectedLocale = filtered[0].code;
    localeSelect.value = selectedLocale;
  }
  const current = localeOptions.find((item) => item.code === selectedLocale);
  selectedMeta.innerHTML = current
    ? `<span class="dot"></span><strong>${escapeHtml(current.label)}</strong><code>${escapeHtml(current.code)}</code><span>动态加载，缺失字段自动 fallback 到 English</span>`
    : '<span>请选择一个 locale</span>';
}

function field(label: string, value: string): string {
  return `<div class="data-field"><span>${escapeHtml(label)}</span><div><strong>${escapeHtml(value || '—')}</strong><button class="copy-field" type="button" data-copy="${escapeHtml(value)}" aria-label="复制${escapeHtml(label)}">⧉</button></div></div>`;
}

function renderResults(): void {
  if (!results.length) {
    resultsContainer.className = 'results-grid empty-state';
    resultsContainer.innerHTML = '<div class="empty-icon">◎</div><p>点击「生成资料」，在浏览器本地生成一组测试数据。</p>';
    copyJsonButton.disabled = true;
    downloadJsonButton.disabled = true;
    return;
  }
  resultsContainer.className = 'results-grid';
  resultsContainer.innerHTML = results.map((profile, index) => `
    <article class="result-card">
      <div class="card-top"><span class="card-index">${String(index + 1).padStart(2, '0')}</span><span class="card-locale">${escapeHtml(profile.locale)} · ${escapeHtml(profile.localeLabel)}</span></div>
      <div class="identity"><div class="avatar">${escapeHtml(profile.name.slice(0, 1).toUpperCase())}</div><div><h4>${escapeHtml(profile.name)}</h4><p>${escapeHtml(profile.company)}</p></div></div>
      <div class="data-fields">
        ${field('地址', profile.address)}
        ${field('城市 / 州省', [profile.city, profile.state].filter(Boolean).join(' · '))}
        ${field('邮编', profile.postcode)}
        ${field('电话', profile.phone)}
        ${field('邮箱', profile.email)}
      </div>
      <div class="card-bottom"><span class="synthetic-tag">合成数据</span>${profile.fallbackFields.length ? `<span class="fallback-tag">${profile.fallbackFields.length} fields fallback</span>` : '<span class="complete-tag">locale data complete</span>'}</div>
    </article>
  `).join('');
  copyJsonButton.disabled = false;
  downloadJsonButton.disabled = false;
}

function setBusy(busy: boolean): void {
  generateButton.disabled = busy;
  generateButton.classList.toggle('busy', busy);
  generateButton.querySelector('span')!.textContent = busy ? '生成中…' : '生成资料';
}

localeFilterInput.addEventListener('input', () => {
  localeFilter = localeFilterInput.value.trim();
  renderLocaleOptions();
});
localeSelect.addEventListener('change', () => {
  selectedLocale = localeSelect.value;
  renderLocaleOptions();
});
countInput.addEventListener('change', () => {
  count = clampCount(countInput.value);
  countInput.value = String(count);
});
generateButton.addEventListener('click', async () => {
  if (!selectedLocale) return;
  setBusy(true);
  try {
    results = await generateProfiles(selectedLocale, count);
    renderResults();
  } catch (error) {
    resultsContainer.className = 'results-grid empty-state error-state';
    resultsContainer.innerHTML = `<div class="empty-icon">!</div><p>生成失败：${escapeHtml(error instanceof Error ? error.message : error)}</p>`;
  } finally {
    setBusy(false);
  }
});

resultsContainer.addEventListener('click', async (event) => {
  const target = event.target as HTMLElement;
  const button = target.closest<HTMLButtonElement>('[data-copy]');
  if (!button) return;
  const copied = await copyText(button.dataset.copy ?? '');
  button.textContent = copied ? '✓' : '×';
  window.setTimeout(() => { button.textContent = '⧉'; }, 1200);
});
copyJsonButton.addEventListener('click', async () => {
  const copied = await copyText(JSON.stringify(results, null, 2));
  copyJsonButton.textContent = copied ? '已复制 ✓' : '复制失败';
  window.setTimeout(() => { copyJsonButton.textContent = '复制 JSON'; }, 1200);
});
downloadJsonButton.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `faker-atlas-${selectedLocale}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
});

document.querySelector<HTMLButtonElement>('#themeToggle')!.addEventListener('click', (event) => {
  const button = event.currentTarget as HTMLButtonElement;
  const dark = document.documentElement.dataset.theme !== 'light';
  document.documentElement.dataset.theme = dark ? 'light' : 'dark';
  button.textContent = dark ? '☀' : '☾';
});

renderLocaleOptions();

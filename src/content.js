let distilleries = null;

const TITLE_SELECTORS = [
  '.c-product-body__title-name',
  '.p-productDetaiMain-head__title-name',
  '.c-productUser-body__title-name',
  '.m-userProductSect-itemDetail__title',
].join(', ');

function getDistilleryName(codeText) {
  const match = codeText.trim().match(/^([A-Z]*\d+)\./);
  if (!match) return null;
  const entry = distilleries[match[1]];
  return entry ? entry.distillery : null;
}

function processTitle(el) {
  if (el.dataset.smwsDone) return;
  el.dataset.smwsDone = '1';
  const name = getDistilleryName(el.textContent);
  if (!name) return;
  const badge = document.createElement('span');
  badge.className = 'smws-distillery-badge';
  badge.textContent = name;
  el.appendChild(badge);
}

function processOptions(container) {
  if (container.dataset.smwsDone) return;
  container.dataset.smwsDone = '1';
  const isSelect = container.tagName === 'SELECT';
  for (const opt of container.options ?? container.querySelectorAll('option')) {
    if (!opt.value) continue;
    const name = getDistilleryName(opt.value);
    if (!name) continue;
    // select: text プロパティが表示テキスト
    // datalist: label 属性で候補表示、value は入力値として保持
    if (isSelect) {
      opt.text = name;
    } else {
      opt.label = name;
    }
  }
}

function processTagCodeInput() {
  const input = document.getElementById('tag_code_input');
  if (!input || input.dataset.smwsClearDone) return;
  input.dataset.smwsClearDone = '1';

  const wrapper = document.createElement('div');
  wrapper.className = 'smws-input-wrapper';
  input.parentNode.insertBefore(wrapper, input);
  wrapper.appendChild(input);

  const btn = document.createElement('button');
  btn.className = 'smws-clear-btn';
  btn.textContent = '×';
  btn.type = 'button';
  btn.title = '蒸留所コードをクリア';
  btn.addEventListener('click', () => {
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.focus();
  });
  wrapper.appendChild(btn);
}

function processAll() {
  if (!distilleries) return;
  document.querySelectorAll(TITLE_SELECTORS).forEach(processTitle);
  document.querySelectorAll('datalist#tag_code_options, select[name="tagCode"]').forEach(processOptions);
  processTagCodeInput();
}

// SPA の大量 DOM 更新で processAll が連打されないよう debounce する
let debounceTimer;
function debouncedProcessAll() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(processAll, 200);
}

fetch(chrome.runtime.getURL('distilleries.json'))
  .then(r => r.json())
  .then(data => {
    distilleries = data;
    processAll();
    new MutationObserver(debouncedProcessAll).observe(document.body, { childList: true, subtree: true });
  })
  .catch(err => console.error('[SMWS Decoder] distilleries.json の読み込みに失敗しました:', err));

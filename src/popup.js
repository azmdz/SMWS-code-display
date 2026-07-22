const tbody = document.getElementById('smws-tbody');
const search = document.getElementById('smws-search');
const typeSelect = document.getElementById('smws-type');
const typeClear = document.getElementById('smws-type-clear');
const regionSelect = document.getElementById('smws-region');
const regionClear = document.getElementById('smws-region-clear');
const countEl = document.getElementById('smws-count');
const emptyEl = document.getElementById('smws-empty');

const TYPE_MAP = [
  [/^\d/, 'Single Malt'],
  [/^GN/, 'Grain'],
  [/^G/, 'Grain'],
  [/^RW/, 'Rye'],
  [/^R/, 'Rum'],
  [/^CW/, 'Corn Whisky'],
  [/^C/, 'Cognac'],
  [/^B/, 'Bourbon'],
  [/^A/, 'Armagnac'],
];

function getType(code) {
  for (const [re, type] of TYPE_MAP) {
    if (re.test(code)) return type;
  }
  return 'Other';
}

const SCOTLAND = new Set(['Speyside', 'Highland', 'Islay', 'Campbeltown', 'Lowland', 'Islands', 'Scotland', 'Edinburgh, Scotland']);
const IRELAND = new Set(['Ireland', 'Northern Ireland']);

const REGION_GROUPS = ['Scotland', 'Japan', 'Taiwan', 'Ireland', 'USA', 'Other'];

function getRegionGroup(region) {
  if (!region) return 'Other';
  if (SCOTLAND.has(region)) return 'Scotland';
  if (region === 'Japan') return 'Japan';
  if (region === 'Taiwan') return 'Taiwan';
  if (IRELAND.has(region)) return 'Ireland';
  if (region.includes('USA')) return 'USA';
  return 'Other';
}

let entries = [];

// コードを「アルファベット接頭辞 → 数値」の順で自然に並べる
function codeSortKey(code) {
  const m = code.match(/^([A-Z]*)(\d+)$/);
  if (!m) return [code, 0];
  return [m[1], Number(m[2])];
}

function compareCode(a, b) {
  const [pa, na] = codeSortKey(a);
  const [pb, nb] = codeSortKey(b);
  if (pa !== pb) return pa < pb ? -1 : 1;
  return na - nb;
}

function render(list) {
  tbody.replaceChildren();
  const frag = document.createDocumentFragment();
  for (const { code, distillery, region } of list) {
    const tr = document.createElement('tr');

    const tdCode = document.createElement('td');
    tdCode.className = 'smws-popup__col-code';
    tdCode.textContent = code;

    const tdName = document.createElement('td');
    tdName.className = 'smws-popup__col-name';
    tdName.textContent = distillery;
    tdName.title = distillery;

    const tdRegion = document.createElement('td');
    tdRegion.className = 'smws-popup__col-region';
    tdRegion.textContent = region ?? '';
    tdRegion.title = region ?? '';

    tr.append(tdCode, tdName, tdRegion);
    frag.appendChild(tr);
  }
  tbody.appendChild(frag);

  const n = list.length;
  countEl.textContent = `${n} 件`;
  emptyEl.hidden = n > 0;
}

function applyFilter() {
  const q = search.value.trim().toLowerCase();
  const type = typeSelect.value;
  const region = regionSelect.value;
  const filtered = entries.filter((e) => {
    if (type && e.type !== type) return false;
    if (region && e.regionGroup !== region) return false;
    if (q) {
      return (
        e.code.toLowerCase().includes(q) ||
        e.distillery.toLowerCase().includes(q) ||
        (e.region ?? '').toLowerCase().includes(q)
      );
    }
    return true;
  });
  render(filtered);
}

search.addEventListener('input', applyFilter);

typeSelect.addEventListener('change', () => {
  typeClear.disabled = !typeSelect.value;
  applyFilter();
});
typeClear.addEventListener('click', () => {
  typeSelect.value = '';
  typeClear.disabled = true;
  applyFilter();
});

regionSelect.addEventListener('change', () => {
  regionClear.disabled = !regionSelect.value;
  applyFilter();
});
regionClear.addEventListener('click', () => {
  regionSelect.value = '';
  regionClear.disabled = true;
  applyFilter();
});

fetch(chrome.runtime.getURL('distilleries.json'))
  .then((r) => r.json())
  .then((data) => {
    const typeOrder = [];
    entries = Object.entries(data)
      .map(([code, v]) => {
        const type = getType(code);
        if (!typeOrder.includes(type)) typeOrder.push(type);
        return { code, distillery: v.distillery, region: v.region, regionGroup: getRegionGroup(v.region), type };
      })
      .sort((a, b) => compareCode(a.code, b.code));

    for (const t of typeOrder) {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      typeSelect.appendChild(opt);
    }

    const usedGroups = new Set(entries.map((e) => e.regionGroup));
    for (const g of REGION_GROUPS) {
      if (!usedGroups.has(g)) continue;
      const opt = document.createElement('option');
      opt.value = g;
      opt.textContent = g;
      regionSelect.appendChild(opt);
    }

    render(entries);
    search.focus();
  })
  .catch((err) => {
    console.error('[SMWS Decoder] distilleries.json の読み込みに失敗しました:', err);
    emptyEl.textContent = 'データの読み込みに失敗しました';
    emptyEl.hidden = false;
  });

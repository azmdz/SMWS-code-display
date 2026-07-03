const tbody = document.getElementById('smws-tbody');
const search = document.getElementById('smws-search');
const countEl = document.getElementById('smws-count');
const emptyEl = document.getElementById('smws-empty');

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

    const tdRegion = document.createElement('td');
    tdRegion.className = 'smws-popup__col-region';
    tdRegion.textContent = region ?? '';

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
  if (!q) return render(entries);
  const filtered = entries.filter(
    (e) =>
      e.code.toLowerCase().includes(q) ||
      e.distillery.toLowerCase().includes(q) ||
      (e.region ?? '').toLowerCase().includes(q)
  );
  render(filtered);
}

search.addEventListener('input', applyFilter);

fetch(chrome.runtime.getURL('distilleries.json'))
  .then((r) => r.json())
  .then((data) => {
    entries = Object.entries(data)
      .map(([code, v]) => ({ code, distillery: v.distillery, region: v.region }))
      .sort((a, b) => compareCode(a.code, b.code));
    render(entries);
    search.focus();
  })
  .catch((err) => {
    console.error('[SMWS Decoder] distilleries.json の読み込みに失敗しました:', err);
    emptyEl.textContent = 'データの読み込みに失敗しました';
    emptyEl.hidden = false;
  });

let shown = 15, last = [];
const BG = { Pemasukan: 'pos', Pengeluaran: 'neg', Tabungan: 'sav', Investasi: 'inv' };
function render(d) {
  const fk = $('#fk'), cats = [...new Set(d.rows.map(r => r.kategori))].sort(), cur = fk.value;
  fk.innerHTML = `<option value="">${t('All categories')}</option>` + cats.map(c => `<option value="${esc(c)}"${c === cur ? ' selected' : ''}>${esc(cl(c))}</option>`).join('');
  const q = $('#q').value.trim().toLowerCase(), j = $('#fj').value, k = fk.value, s = $('#fs').value;
  let rows = Range.filter(d.rows).filter(r => (!j || r.jenis === j) && (!k || r.kategori === k) && (!q || (r.deskripsi + ' ' + r.kategori + ' ' + cl(r.kategori)).toLowerCase().includes(q)));
  rows.sort((a, b) => s === 'o' ? a.d - b.d : s === 'h' ? b.nominal - a.nominal : s === 'l' ? a.nominal - b.nominal : b.d - a.d); last = rows;
  $('#rows').innerHTML = rows.slice(0, shown).map((r, i) => `<div class="tr" data-i="${i}" tabindex="0"><span>${fdate(r.d)}</span><span>${esc(r.deskripsi)}</span><span><span class="badge">${esc(cl(r.kategori))}</span></span><span><span class="badge"><i style="background:${JC[r.jenis]}"></i>${jl(r.jenis)}</span></span><span class="n ${BG[r.jenis]}">${r.jenis === 'Pemasukan' ? '+' : '-'}${rp(r.nominal)}</span></div>`).join('') || `<div class="empty">${t('No transactions match these filters.')}</div>`;
  const T = totals(rows); $('#foot').innerHTML = `<span>${t('{n} transactions · {r}', { n: rows.length, r: Range.label() })}</span><span>${t('In')} <b class="pos">${rp(T.i)}</b> · ${t('Out')} <b class="neg">${rp(T.o)}</b> · ${t('Saved/invested')} <b>${rp(T.t + T.v)}</b></span>`;
  $('#more').hidden = rows.length <= shown;
}
const open = i => { const r = last[i]; if (!r) return; openModal(`<h3>${esc(r.deskripsi)}</h3><p style="color:var(--ink2)">${fdate(r.d)} · ${ftime(r.d)}</p><div class="dl"><div><span>${t('Amount')}</span><b class="${BG[r.jenis]}">${rp(r.nominal)}</b></div><div><span>${t('Type')}</span><b>${jl(r.jenis)}</b></div><div><span>${t('Category')}</span><b>${esc(cl(r.kategori))}</b></div>${r.pesan ? `<div><span>${t('Original message')}</span><b>${esc(r.pesan)}</b></div>` : ''}</div>`); };
$('#rows').addEventListener('click', e => { const x = e.target.closest('.tr'); if (x) open(+x.dataset.i); });
$('#rows').addEventListener('keydown', e => { if (e.key === 'Enter') { const x = e.target.closest('.tr'); if (x) open(+x.dataset.i); } });
['q', 'fj', 'fk', 'fs'].forEach(id => $('#' + id).addEventListener(id === 'q' ? 'input' : 'change', () => { shown = 15; render(STATE.d); }));
$('#more').onclick = () => { shown += 15; render(STATE.d); };
$('#csv').onclick = () => { const q = v => '"' + String(v ?? '').replace(/"/g, '""') + '"', body = [[t('Date'), t('Type'), t('Description'), t('Amount'), t('Category')].map(q).join(',')].concat(last.map(r => [dkey(r.d) + ' ' + ftime(r.d), jl(r.jenis), r.deskripsi, r.nominal, cl(r.kategori)].map(q).join(','))).join('\n'), a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff' + body], { type: 'text/csv' })); a.download = 'log4money-' + dkey(new Date()) + '.csv'; a.click(); };
boot({ page: 'transactions', title: 'Transactions', sub: 'Search, filter and export every entry.', render });

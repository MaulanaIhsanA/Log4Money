let shown = 15, last = [];
const BG = { Pemasukan: 'pos', Pengeluaran: 'neg', Tabungan: 'sav', Investasi: 'inv' };
function render(d) {
  const fk = $('#fk'), cats = [...new Set(d.rows.map(r => r.kategori))].sort(), cur = fk.value;
  fk.innerHTML = '<option value="">Semua kategori</option>' + cats.map(c => `<option${c === cur ? ' selected' : ''}>${esc(c)}</option>`).join('');
  const q = $('#q').value.trim().toLowerCase(), j = $('#fj').value, k = fk.value, s = $('#fs').value;
  let rows = Range.filter(d.rows).filter(r => (!j || r.jenis === j) && (!k || r.kategori === k) && (!q || (r.deskripsi + ' ' + r.kategori).toLowerCase().includes(q)));
  rows.sort((a, b) => s === 'o' ? a.d - b.d : s === 'h' ? b.nominal - a.nominal : s === 'l' ? a.nominal - b.nominal : b.d - a.d); last = rows;
  $('#rows').innerHTML = rows.slice(0, shown).map((r, i) => `<div class="tr" data-i="${i}" tabindex="0"><span>${fdate(r.d)}</span><span>${esc(r.deskripsi)}</span><span><span class="badge">${esc(r.kategori)}</span></span><span><span class="badge"><i style="background:${JC[r.jenis]}"></i>${r.jenis}</span></span><span class="n ${BG[r.jenis]}">${r.jenis === 'Pemasukan' ? '+' : '-'}${rp(r.nominal)}</span></div>`).join('') || '<div class="empty">Tidak ada transaksi yang cocok dengan filter ini.</div>';
  const T = totals(rows); $('#foot').innerHTML = `<span>${rows.length} transaksi · ${Range.label()}</span><span>Masuk <b class="pos">${rp(T.i)}</b> · Keluar <b class="neg">${rp(T.o)}</b> · Ditabung/diinvestasi <b>${rp(T.t + T.v)}</b></span>`;
  $('#more').hidden = rows.length <= shown;
}
const open = i => { const r = last[i]; if (!r) return; openModal(`<h3>${esc(r.deskripsi)}</h3><p style="color:var(--ink2)">${fdate(r.d)} · ${ftime(r.d)}</p><div class="dl"><div><span>Nominal</span><b class="${BG[r.jenis]}">${rp(r.nominal)}</b></div><div><span>Jenis</span><b>${r.jenis}</b></div><div><span>Kategori</span><b>${esc(r.kategori)}</b></div>${r.pesan ? `<div><span>Pesan asli</span><b>${esc(r.pesan)}</b></div>` : ''}</div>`); };
$('#rows').addEventListener('click', e => { const t = e.target.closest('.tr'); if (t) open(+t.dataset.i); });
$('#rows').addEventListener('keydown', e => { if (e.key === 'Enter') { const t = e.target.closest('.tr'); if (t) open(+t.dataset.i); } });
['q', 'fj', 'fk', 'fs'].forEach(id => $('#' + id).addEventListener(id === 'q' ? 'input' : 'change', () => { shown = 15; render(STATE.d); }));
$('#more').onclick = () => { shown += 15; render(STATE.d); };
$('#csv').onclick = () => { const q = v => '"' + String(v ?? '').replace(/"/g, '""') + '"', body = ['Tanggal,Jenis,Deskripsi,Nominal,Kategori'].concat(last.map(r => [dkey(r.d) + ' ' + ftime(r.d), r.jenis, r.deskripsi, r.nominal, r.kategori].map(q).join(','))).join('\n'), a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff' + body], { type: 'text/csv' })); a.download = 'log4money-' + dkey(new Date()) + '.csv'; a.click(); };
boot({ page: 'transactions', title: 'Transaksi', sub: 'Cari, saring, dan ekspor semua catatanmu.', render });

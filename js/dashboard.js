const greet = () => { const h = new Date().getHours(); return h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 19 ? 'Selamat sore' : 'Selamat malam'; };
function render(d) {
  const all = d.rows, rows = Range.filter(all), T = totals(rows), P = totals(Range.prev(all));
  $('#rl').textContent = Range.label();
  const ds = rows.map(r => r.d), span = ds.length ? Math.max(1, Math.round((sod(new Date(Math.max(...ds))) - sod(new Date(Math.min(...ds)))) / 864e5) + 1) : 1;
  const end0 = ds.length ? sod(new Date(Math.max(...ds))) : sod(new Date());
  const formRow = (rs, avg, e) => { const f = []; for (let i = 6; i >= 0; i--) { const k = dkey(new Date(e.getFullYear(), e.getMonth(), e.getDate() - i)), day = rs.filter(r => dkey(r.d) === k); f.push(!day.length ? 'D' : sum(by(day, 'Pengeluaran')) <= avg ? 'W' : 'L'); } const tt = { W: 'Hemat: pengeluaran di bawah rata-rata harian', L: 'Boros: pengeluaran di atas rata-rata harian', D: 'Tanpa transaksi' }; return `<div class="form"><span>Form 7 hari</span>${f.map(x => `<i class="f${x}" title="${tt[x]}">${x}</i>`).join('')}</div>`; };
  const pill = (c, l, v) => `<div class="pill"><i style="background:${c}"></i>${l} <b>${rp(v)}</b></div>`;
  $('#hero').innerHTML = `<div class="hero__main"><span class="chip">${greet()}</span><h1 id="bal" class="shine">${rp(0)}</h1><p>Saldo tersedia · ${Range.label().toLowerCase()}. Sudah dikurangi pengeluaran, tabungan, dan investasi.</p><div class="hero__row">${pill(JC.Pemasukan, 'Pemasukan', T.i)}${pill(JC.Pengeluaran, 'Pengeluaran', T.o)}${pill(JC.Tabungan, 'Tabungan', T.t)}${pill(JC.Investasi, 'Investasi', T.v)}</div>${formRow(rows, T.o / span, end0)}</div>` + pitchSVG();
  countTo($('#bal'), T.saldo); wirePitch();
  const k = (tone, ic, l, n, f, sub, dl = '') => `<div class="kpi"><div class="kpi__top"><span>${l}${dl}</span><span class="kpi__ic ${tone}">${svg(ic)}</span></div><b data-n="${n}" data-f="${f}">${FMT[f](n)}</b><small>${sub}</small></div>`;
  $('#kpis').innerHTML = k('t-green', 'up', 'Pemasukan', T.i, 'rp', by(rows, 'Pemasukan').length + ' transaksi', delta(T.i, P.i, true)) + k('t-red', 'down', 'Pengeluaran', T.o, 'rp', by(rows, 'Pengeluaran').length + ' transaksi', delta(T.o, P.o, false)) + k('t-gold', 'save', 'Tabungan', T.t, 'rp', by(rows, 'Tabungan').length + ' setoran') + k('t-blue', 'inv', 'Investasi', T.v, 'rp', by(rows, 'Investasi').length + ' transaksi') + k('t-indigo', 'pct', 'Rasio menabung', T.rate * 100, 'pct', 'dari total pemasukan') + k('t-gray', 'cal', 'Rata-rata harian', T.o / span, 'rp', 'pengeluaran per hari'); tick($('#kpis'));
  // arus kas
  const end = ds.length ? sod(new Date(Math.max(...ds))) : sod(new Date()), n = Math.min(span, 31), labs = [], inn = [], out = [];
  for (let i = n - 1; i >= 0; i--) { const x = new Date(end.getFullYear(), end.getMonth(), end.getDate() - i), key = dkey(x), day = rows.filter(r => dkey(r.d) === key); labs.push(fshort(x)); inn.push(sum(by(day, 'Pemasukan'))); out.push(sum(by(day, 'Pengeluaran'))); }
  chart('cf', { type: 'bar', data: { labels: labs, datasets: [{ label: 'Pemasukan', data: inn, backgroundColor: JC.Pemasukan, borderRadius: 5 }, { label: 'Pengeluaran', data: out, backgroundColor: JC.Pengeluaran, borderRadius: 5 }] }, options: { scales: { x: axisX, y: axisY }, plugins: { tooltip: tipRp, legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } } } } });
  const cs = catSpend(rows), tot = T.o, names = cs.map(c => c[0]);
  chart('dn', { type: 'doughnut', data: { labels: names, datasets: [{ data: cs.map(c => c[1]), backgroundColor: CATC, borderWidth: 2, borderColor: '#fff' }] }, options: { cutout: '68%', plugins: { legend: { display: false }, tooltip: tipRp } } });
  $('#lg').innerHTML = cs.length ? cs.slice(0, 6).map((c, i) => `<div><i style="background:${CATC[i % CATC.length]}"></i>${esc(c[0])}<b>${rps(c[1])}</b><span>${(c[1] / tot * 100).toFixed(0)}%</span></div>`).join('') : '<div class="empty">Belum ada pengeluaran di periode ini.</div>';
  // anggaran bulan ini
  const now = new Date(), cm = all.filter(r => r.d.getMonth() === now.getMonth() && r.d.getFullYear() === now.getFullYear()), B = Budget.get(), lim = Object.entries(B.limits).filter(e => e[1] > 0), spent = Object.fromEntries(catSpend(cm));
  $('#bud').innerHTML = lim.length ? lim.slice(0, 5).map(([c, l]) => { const s = spent[c] || 0, p = s / l * 100; return `<div class="bi"><div><span>${esc(c)}</span><span>${rps(s)} <small>/ ${rps(l)}</small></span></div><div class="bar ${p > 100 ? 'over' : p > 80 ? 'warn' : ''}"><i style="width:${Math.min(100, p)}%"></i></div></div>`; }).join('') : '<div class="empty">Belum ada batas yang diatur. <a class="link" href="budget.html">Atur anggaran</a></div>';
  // catatan cepat
  const ex = by(rows, 'Pengeluaran'), big = [...ex].sort((a, b) => b.nominal - a.nominal)[0], noSpend = (() => { if (!ds.length) return 0; let c = 0; for (let i = 0; i < span; i++) { const x = dkey(new Date(end.getFullYear(), end.getMonth(), end.getDate() - i)); if (!ex.some(r => dkey(r.d) === x)) c++; } return c; })();
  const dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(), mo = totals(cm), proj = cm.length ? mo.o / now.getDate() * dim : 0, tips = [];
  if (big) tips.push(`Pengeluaran terbesar: <b>${esc(big.deskripsi)}</b> sebesar <b>${rp(big.nominal)}</b> pada ${fshort(big.d)}.`);
  if (cs[0]) tips.push(`Kategori <b>${esc(cs[0][0])}</b> memakai <b>${(cs[0][1] / tot * 100).toFixed(0)}%</b> dari semua pengeluaran.`);
  if (proj) tips.push(`Dengan laju bulan ini, pengeluaran akhir bulan diperkirakan sekitar <b>${rp(proj)}</b>.`);
  if (ex.length) tips.push(`Ada <b>${noSpend}</b> hari tanpa pengeluaran dari ${span} hari di periode ini.`);
  if (T.i && T.rate < .1) tips.push('Rasio menabungmu di bawah 10%. Coba sisihkan di awal, bukan dari sisa.');
  $('#ins').innerHTML = tips.length ? tips.map(t => `<div>${svg('tip')}<span>${t}</span></div>`).join('') : '<div class="empty">Belum ada data untuk dianalisis.</div>';
  // terbaru
  const nm = { Pemasukan: '+', Pengeluaran: '−', Tabungan: 'T', Investasi: 'I' }, cl = { Pemasukan: 'pos', Pengeluaran: 'neg', Tabungan: 'sav', Investasi: 'inv' }, tn = { Pemasukan: 't-green', Pengeluaran: 't-red', Tabungan: 't-gold', Investasi: 't-blue' };
  $('#recent').innerHTML = rows.slice(0, 6).map(r => `<div class="li"><span class="ic ${tn[r.jenis]}">${nm[r.jenis]}</span><div><b>${esc(r.deskripsi)}</b><small>${esc(r.kategori)} · ${fshort(r.d)} ${ftime(r.d)}</small></div><div class="r ${cl[r.jenis]}">${r.jenis === 'Pemasukan' ? '+' : '-'}${rp(r.nominal)}</div></div>`).join('') || '<div class="empty">Belum ada transaksi. Catat lewat bot Telegram untuk memulai.</div>';
}
boot({ page: 'dashboard', title: 'Dashboard', sub: 'Ringkasan keuanganmu dalam satu layar.', render });

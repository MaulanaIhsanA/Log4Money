const greet = () => { const h = new Date().getHours(); return t(h < 11 ? 'greet.m' : h < 15 ? 'greet.a' : h < 19 ? 'greet.e' : 'greet.n'); };
const SIGN = { Pemasukan: '+', Pengeluaran: '−', Tabungan: 'S', Investasi: 'I' }, TXC = { Pemasukan: 'pos', Pengeluaran: 'neg', Tabungan: 'sav', Investasi: 'inv' }, TXT = { Pemasukan: 't-green', Pengeluaran: 't-red', Tabungan: 't-gold', Investasi: 't-blue' };
function render(d) {
  const all = d.rows, rows = Range.filter(all), T = totals(rows), P = totals(Range.prev(all)), ds = rows.map(r => r.d);
  const span = ds.length ? Math.max(1, Math.round((sod(new Date(Math.max(...ds))) - sod(new Date(Math.min(...ds)))) / 864e5) + 1) : 1;
  const end = ds.length ? sod(new Date(Math.max(...ds))) : sod(new Date());
  $('#rl').textContent = Range.label();
  // ticker
  const tk = all.slice(0, 10).map(r => `<span class="tk"><i style="background:${JC[r.jenis]}"></i>${esc(r.deskripsi)} <b class="${TXC[r.jenis]}">${r.jenis === 'Pemasukan' ? '+' : '-'}${rps(r.nominal)}</b></span>`).join('');
  $('#ticker').innerHTML = tk ? `<span class="tk-l">${t('LATEST')}</span><div class="tk-w"><div class="tk-t">${tk}${tk}</div></div>` : ''; $('#ticker').hidden = !tk;
  // hero
  const avg = T.o / span, form = [];
  for (let i = 6; i >= 0; i--) { const k = dkey(new Date(end.getFullYear(), end.getMonth(), end.getDate() - i)), day = rows.filter(r => dkey(r.d) === k); form.push(!day.length ? 'D' : sum(by(day, 'Pengeluaran')) <= avg ? 'W' : 'L'); }
  const tt = { W: t('Frugal: spending at or below the daily average'), L: t('Overspent: spending above the daily average'), D: t('No activity') };
  const pill = (j, v) => `<div class="pill"><span><i style="background:${JC[j]}"></i>${jl(j)}</span><b>${rp(v)}</b></div>`;
  $('#hero').innerHTML = `<div class="hero__main"><span class="chip">${greet()}</span><h1 id="bal" class="shine" data-n="${T.saldo}" data-f="rp">${rp(0)}</h1><p>${t('Available balance · {r}. Net of expenses, savings and investments.', { r: Range.label().toLowerCase() })}</p><div class="hero__row">${pill('Pemasukan', T.i)}${pill('Pengeluaran', T.o)}${pill('Tabungan', T.t)}${pill('Investasi', T.v)}</div><div class="form"><span>${t('Form · last 7 days')}</span>${form.map(x => `<i class="f${x}" title="${tt[x]}">${x}</i>`).join('')}</div></div>` + pitchSVG();
  tick($('#hero')); wirePitch();
  // kpi + sparkline
  const keys = []; for (let i = 13; i >= 0; i--) keys.push(dkey(new Date(end.getFullYear(), end.getMonth(), end.getDate() - i)));
  const ser = j => keys.map(k => sum(by(rows.filter(r => dkey(r.d) === k), j)));
  const k = (tone, ic, l, n, f, sub, col, sr, dl = '') => `<div class="kpi"><div class="kpi__top"><span>${l}${dl}</span><span class="kpi__ic ${tone}">${svg(ic)}</span></div><b data-n="${n}" data-f="${f}">${FMT[f](n)}</b><small>${sub}</small>${spark(sr, col)}</div>`;
  $('#kpis').innerHTML = k('t-green', 'up', t('Income'), T.i, 'rp', t('{n} transactions', { n: by(rows, 'Pemasukan').length }), JC.Pemasukan, ser('Pemasukan'), delta(T.i, P.i, true)) + k('t-red', 'down', t('Expenses'), T.o, 'rp', t('{n} transactions', { n: by(rows, 'Pengeluaran').length }), JC.Pengeluaran, ser('Pengeluaran'), delta(T.o, P.o, false)) + k('t-gold', 'save', t('Savings'), T.t, 'rp', t('{n} deposits', { n: by(rows, 'Tabungan').length }), JC.Tabungan, ser('Tabungan')) + k('t-blue', 'inv', t('Investments'), T.v, 'rp', t('{n} transactions', { n: by(rows, 'Investasi').length }), JC.Investasi, ser('Investasi')) + k('t-indigo', 'pct', t('Savings rate'), T.rate * 100, 'pct', t('of total income'), '#5b5bd6', ser('Tabungan').map((v, i) => v + ser('Investasi')[i])) + k('t-gray', 'cal', t('Daily average'), avg, 'rp', t('spent per day'), '#6b7f75', ser('Pengeluaran'));
  tick($('#kpis'));
  // cash flow
  const n = Math.min(span, 31), labs = [], inn = [], out = [];
  for (let i = n - 1; i >= 0; i--) { const x = new Date(end.getFullYear(), end.getMonth(), end.getDate() - i), key = dkey(x), day = rows.filter(r => dkey(r.d) === key); labs.push(fshort(x)); inn.push(sum(by(day, 'Pemasukan'))); out.push(sum(by(day, 'Pengeluaran'))); }
  chart('cf', { type: 'bar', data: { labels: labs, datasets: [{ label: t('Income'), data: inn, backgroundColor: JC.Pemasukan, borderRadius: 5 }, { label: t('Expenses'), data: out, backgroundColor: JC.Pengeluaran, borderRadius: 5 }] }, options: { scales: { x: axisX, y: axisY }, plugins: { tooltip: tipRp, legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } } } } });
  const cs = catSpend(rows), tot = T.o;
  chart('dn', { type: 'doughnut', data: { labels: cs.map(c => cl(c[0])), datasets: [{ data: cs.map(c => c[1]), backgroundColor: CATC, borderWidth: 2, borderColor: '#fff' }] }, options: { cutout: '68%', plugins: { legend: { display: false }, tooltip: tipRp } } });
  $('#lg').innerHTML = cs.length ? cs.slice(0, 6).map((c, i) => `<div><i style="background:${CATC[i % CATC.length]}"></i>${esc(cl(c[0]))}<b>${rps(c[1])}</b><span>${(c[1] / tot * 100).toFixed(0)}%</span></div>`).join('') : `<div class="empty">${t('No expenses in this period.')}</div>`;
  // budget
  const now = new Date(), cm = all.filter(r => r.d.getMonth() === now.getMonth() && r.d.getFullYear() === now.getFullYear()), B = Budget.get(), lim = Object.entries(B.limits).filter(e => e[1] > 0), spent = Object.fromEntries(catSpend(cm));
  $('#bud').innerHTML = lim.length ? lim.slice(0, 5).map(([c, l]) => { const s = spent[c] || 0, p = s / l * 100; return `<div class="bi"><div><span>${esc(cl(c))}</span><span>${rps(s)} <small>/ ${rps(l)}</small></span></div><div class="bar ${p > 100 ? 'over' : p > 80 ? 'warn' : ''}"><i style="width:${Math.min(100, p)}%"></i></div></div>`; }).join('') : `<div class="empty">${t('No limits set yet. <a class="link" href="budget.html">Set up budgets</a>')}</div>`;
  // notes
  const ex = by(rows, 'Pengeluaran'), big = [...ex].sort((a, b) => b.nominal - a.nominal)[0], dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(), mo = totals(cm), proj = cm.length ? mo.o / now.getDate() * dim : 0, tips = [];
  const idle = (() => { let c = 0; if (!ds.length) return 0; for (let i = 0; i < span; i++) { const x = dkey(new Date(end.getFullYear(), end.getMonth(), end.getDate() - i)); if (!ex.some(r => dkey(r.d) === x)) c++; } return c; })();
  if (big) tips.push(t('Largest expense: <b>{d}</b> at <b>{v}</b> on {date}.', { d: esc(big.deskripsi), v: rp(big.nominal), date: fshort(big.d) }));
  if (cs[0]) tips.push(t('<b>{c}</b> accounts for <b>{p}%</b> of all spending.', { c: esc(cl(cs[0][0])), p: (cs[0][1] / tot * 100).toFixed(0) }));
  if (proj) tips.push(t('At the current pace, this month’s spending will reach about <b>{v}</b>.', { v: rp(proj) }));
  if (ex.length) tips.push(t('<b>{n}</b> of {m} days had no spending in this period.', { n: idle, m: span }));
  if (T.i && T.rate < .1) tips.push(t('Your savings rate is below 10%. Try setting money aside first, not from what’s left.'));
  $('#ins').innerHTML = tips.length ? tips.map(x => `<div>${svg('tip')}<span>${x}</span></div>`).join('') : `<div class="empty">${t('Nothing to analyse yet.')}</div>`;
  // recent
  $('#recent').innerHTML = rows.slice(0, 6).map(r => `<div class="li"><span class="ic ${TXT[r.jenis]}">${SIGN[r.jenis]}</span><div><b>${esc(r.deskripsi)}</b><small>${esc(cl(r.kategori))} · ${fshort(r.d)} ${ftime(r.d)}</small></div><div class="r ${TXC[r.jenis]}">${r.jenis === 'Pemasukan' ? '+' : '-'}${rp(r.nominal)}</div></div>`).join('') || `<div class="empty">${t('No transactions yet. Log one through your Telegram bot to get started.')}</div>`;
}
boot({ page: 'dashboard', title: 'Dashboard', sub: 'Your finances at a glance.', render });

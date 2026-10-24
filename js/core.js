/* Log4Money: data, helper, dan kerangka halaman (sidebar, menu bawah, filter periode) */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rp = n => (n < 0 ? '-' : '') + 'Rp ' + Math.round(Math.abs(n)).toLocaleString('id-ID');
const rps = n => { const a = Math.abs(n), s = n < 0 ? '-' : ''; return s + (a >= 1e6 ? (a / 1e6).toFixed(1).replace('.', ',') + ' jt' : a >= 1e3 ? Math.round(a / 1e3) + ' rb' : Math.round(a)); };
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pad = n => String(n).padStart(2, '0');
const dkey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, mkey = d => dkey(d).slice(0, 7);
const fdate = d => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
const fshort = d => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
const ftime = d => pad(d.getHours()) + '.' + pad(d.getMinutes());
const mname = k => new Date(k + '-01T00:00:00').toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
const JC = { Pemasukan: '#0b8f55', Pengeluaran: '#d6403f', Tabungan: '#b88a00', Investasi: '#2f6fdb' };
const CATC = ['#0b8f55', '#2f6fdb', '#f08a24', '#a35ce0', '#e0457b', '#12a5b5', '#b88a00', '#6b7f75', '#8a9a1c'];
const sum = a => a.reduce((s, r) => s + r.nominal, 0), by = (a, j) => a.filter(r => r.jenis === j);
const sod = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
function totals(rows) {
  const i = sum(by(rows, 'Pemasukan')), o = sum(by(rows, 'Pengeluaran')), t = sum(by(rows, 'Tabungan')), v = sum(by(rows, 'Investasi'));
  return { i, o, t, v, saldo: i - o - t - v, rate: i ? (t + v) / i : 0 };
}
function group(rows, fn) { const m = {}; rows.forEach(r => (m[fn(r)] = m[fn(r)] || []).push(r)); return m; }
function catSpend(rows) { const g = group(by(rows, 'Pengeluaran'), r => r.kategori); return Object.entries(g).map(([k, a]) => [k, sum(a)]).sort((a, b) => b[1] - a[1]); }
function delta(cur, prev, upGood) { if (!prev) return ''; const p = (cur - prev) / prev * 100, up = p >= 0; return `<span class="delta ${up === upGood ? 'good' : 'bad'}">${up ? '▲' : '▼'} ${Math.abs(p).toFixed(0)}%</span>`; }

const Lock = { get: () => localStorage.getItem('l4.pin') || sessionStorage.getItem('l4.pin') || '', set(p, keep) { (keep ? localStorage : sessionStorage).setItem('l4.pin', p); }, clear() { localStorage.removeItem('l4.pin'); sessionStorage.removeItem('l4.pin'); sessionStorage.removeItem('l4.cache'); } };
const Data = {
  async load(force) {
    try { const c = JSON.parse(sessionStorage.getItem('l4.cache') || 'null'); if (!force && c && Date.now() - c.t < 60000) return Data.wrap(c.rows, c.live); } catch (e) {}
    let rows = SAMPLE, live = false;
    try { const r = await fetch('/api/data', { cache: 'no-store', headers: { 'x-pin': Lock.get() } }); if (r.status === 401) { const had = !!Lock.get(); Lock.clear(); return { locked: true, wrong: had, rows: [], live: false }; } const j = await r.json(); if (r.ok && Array.isArray(j)) { rows = j; live = true; } } catch (e) {}
    try { sessionStorage.setItem('l4.cache', JSON.stringify({ t: Date.now(), rows, live })); } catch (e) {}
    return Data.wrap(rows, live);
  },
  wrap(rows, live) { return { live, rows: rows.map(r => ({ ...r, d: new Date(r.tanggal), nominal: Number(r.nominal) })).sort((a, b) => b.d - a.d) }; }
};
const Range = {
  opts: [['all', 'Semua waktu'], ['7', '7 hari terakhir'], ['30', '30 hari terakhir'], ['month', 'Bulan ini'], ['last', 'Bulan lalu']],
  get: () => sessionStorage.getItem('l4.range') || 'all', set: v => sessionStorage.setItem('l4.range', v),
  label: () => Range.opts.find(o => o[0] === Range.get())[1],
  pick(rows, v, off) {
    const n = new Date(), M = (o) => new Date(n.getFullYear(), n.getMonth() - o, 1);
    return rows.filter(r => {
      const d = r.d, age = (n - d) / 864e5;
      if (v === '7') return off ? age > 7 && age <= 14 : age <= 7;
      if (v === '30') return off ? age > 30 && age <= 60 : age <= 30;
      if (v === 'month' || v === 'last') { const m = M((v === 'last' ? 1 : 0) + (off ? 1 : 0)); return d.getMonth() === m.getMonth() && d.getFullYear() === m.getFullYear(); }
      return !off;
    });
  },
  filter: rows => Range.pick(rows, Range.get(), false),
  prev: rows => Range.get() === 'all' ? [] : Range.pick(rows, Range.get(), true)
};
const Budget = {
  get() { try { return JSON.parse(localStorage.getItem('l4.budget')) || { limits: {}, goal: 0 }; } catch (e) { return { limits: {}, goal: 0 }; } },
  set(b) { try { localStorage.setItem('l4.budget', JSON.stringify(b)); } catch (e) {} }
};
const ICO = {
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  transactions: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  analytics: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
  budget: '<circle cx="12" cy="12" r="9"/><path d="M12 12V3M12 12l6.5 6.5"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>', down: '<path d="M12 5v14M6 13l6 6 6-6"/>', save: '<path d="M4 10h16v10H4zM8 10V6a4 4 0 0 1 8 0v4"/>', inv: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>', pct: '<path d="M19 5L5 19M7 8a1 1 0 1 0 0-.01M17 18a1 1 0 1 0 0-.01"/>', cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 11h18"/>',
  tip: '<path d="M12 3v2M5.6 5.6l1.4 1.4M3 12h2M18.4 5.6L17 7M21 12h-2M9 18h6M10 21h4M8 14a5 5 0 1 1 8 0c-1 1-1 2-1 3H9c0-1 0-2-1-3z"/>'
};
const svg = k => `<svg viewBox="0 0 24 24">${ICO[k]}</svg>`;
const NAV = [['dashboard', 'Dashboard'], ['transactions', 'Transaksi'], ['analytics', 'Analitik'], ['budget', 'Anggaran']];
const STATE = { d: null };
function mount(c) {
  const links = cls => NAV.map(([k, t]) => `<a class="${cls}${c.page === k ? ' on' : ''}" href="${k}.html">${svg(k)}${t}</a>`).join('');
  const brand = `<a class="brand" href="index.html" aria-label="Kembali ke halaman sambutan"><img src="assets/logo.png" alt="Log4Money"><div class="brand__text">Log4Money<span>Kendali keuangan pribadi</span></div></a>`;
  $('#side').innerHTML = brand + `<nav class="nav">${links('nav__link')}</nav><div class="sp"></div>${Lock.get() ? '<button class="btn" id="lockbtn" type="button" style="margin-bottom:10px">Kunci</button>' : ''}<div class="sync" id="sync"><svg class="bs" viewBox="-12 -12 24 24">${BALL}</svg><span>Memuat…</span></div>`;
  const lb = $('#lockbtn'); if (lb) lb.onclick = () => { Lock.clear(); location.href = 'index.html'; };
  $('#top').innerHTML = brand; $('#bottom').innerHTML = links('');
  $('#phead').innerHTML = `<div><h1>${c.title}</h1><p>${c.sub}</p></div><div class="tools">${c.noRange ? '' : `<select class="select" id="range" aria-label="Periode">${Range.opts.map(o => `<option value="${o[0]}"${o[0] === Range.get() ? ' selected' : ''}>${o[1]}</option>`).join('')}</select>`}<button class="btn" id="refresh" type="button">Muat ulang</button></div>`;
}
function askPin(wrong) {
  return new Promise(res => {
    const o = document.createElement('div'); o.className = 'lock';
    o.innerHTML = `<form class="lockc"><img src="assets/logo.png" alt=""><h2>Log4Money terkunci</h2><p>Masukkan kodemu untuk membuka.</p><input class="input" id="pin" type="password" autocomplete="current-password" placeholder="Kode akses" aria-label="Kode akses" required><div class="lerr" role="alert">${wrong ? 'Kode salah, coba lagi.' : ''}</div><label class="keep"><input type="checkbox" id="keep"> Ingat di perangkat ini</label><button class="btn primary" style="width:100%">Buka</button></form>`;
    document.body.appendChild(o); $('#pin').focus();
    $('form', o).onsubmit = async e => { e.preventDefault(); const b = $('button', o); b.classList.add('busy'); Lock.set($('#pin').value, $('#keep').checked); const d = await Data.load(true); b.classList.remove('busy'); if (d.locked) { $('.lerr', o).textContent = 'Kode salah, coba lagi.'; $('#pin').value = ''; $('#pin').focus(); } else { o.remove(); res(d); } };
  });
}
function openModal(html) {
  const m = $('#modal'); m.innerHTML = `<div class="ov"><div class="modal" role="dialog" aria-modal="true">${html}<div style="display:flex;justify-content:flex-end"><button class="btn" id="mclose" type="button">Tutup</button></div></div></div>`;
  const close = () => m.innerHTML = ''; $('#mclose').focus(); $('#mclose').onclick = close; $('.ov', m).onclick = e => { if (e.target.classList.contains('ov')) close(); };
  document.onkeydown = e => { if (e.key === 'Escape') close(); };
}
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FMT = { rp, pct: v => Math.round(v) + '%' };
function tick(root = document) { $$('[data-n]', root).forEach(el => { const to = +el.dataset.n, f = FMT[el.dataset.f] || rp; if (RM) { el.textContent = f(to); return; } const t0 = performance.now(); (function s(t) { const p = Math.min(1, (t - t0) / 900); el.textContent = f(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(s); })(t0); }); }
const BALL = '<circle r="10" fill="#fff" stroke="#10201a" stroke-width="1.8"/><path d="M0-4.6l4.4 3.2-1.7 5.2H-2.7l-1.7-5.2z" fill="#10201a"/>';
function pitchSVG(cls) {
  const stripes = Array.from({ length: 9 }, (_, i) => `<rect x="${150 + i * 30}" y="0" width="30" height="220" fill="${i % 2 ? '#eaf6ef' : '#f4fbf7'}"/>`).join('');
  return `<svg class="pitch ${cls || ''}" viewBox="170 20 250 180" preserveAspectRatio="xMidYMid slice" fill="none" role="img" aria-label="Lapangan mini. Klik bolanya untuk menendang ke gawang"><defs><pattern id="net" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 0L5 5M5 0L0 5" stroke="#7fbf9d" stroke-width=".7"/></pattern></defs>${stripes}<g stroke="#bfe0cd" stroke-width="1.8"><rect x="2" y="2" width="396" height="216" rx="3"/><path d="M200 2v216"/><circle cx="200" cy="110" r="38"/><rect x="276" y="40" width="122" height="140"/><rect x="344" y="75" width="54" height="70"/><path d="M276 86a40 40 0 0 1 0 48"/></g><circle cx="200" cy="110" r="3" fill="#bfe0cd"/><circle cx="322" cy="110" r="2.6" fill="#bfe0cd"/><path class="trail" d="M182 190Q250 150 322 110" stroke="#7fbf9d" stroke-width="2" stroke-dasharray="2 6" stroke-linecap="round"/><rect class="gnet" x="398" y="84" width="20" height="52" fill="url(#net)" stroke="#5fae85" stroke-width="2"/><g class="ball"><g class="spin">${BALL}</g></g><text class="gol" x="350" y="84" text-anchor="middle">GOL!</text></svg>`;
}
function confetti(p) {
  if (RM) return; const ns = 'http://www.w3.org/2000/svg', cols = ['#0b8f55', '#f2b705', '#2f6fdb', '#e0457b', '#12a5b5'];
  for (let i = 0; i < 22; i++) { const r = document.createElementNS(ns, 'rect'); r.setAttribute('x', 402); r.setAttribute('y', 108); r.setAttribute('width', 5); r.setAttribute('height', 8); r.setAttribute('rx', 1.5); r.setAttribute('fill', cols[i % 5]); r.setAttribute('class', 'cf');
    r.style.setProperty('--dx', -(10 + Math.random() * 110) + 'px'); r.style.setProperty('--dy', (Math.random() * 84 - 42) + 'px'); r.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg'); r.style.animationDelay = Math.random() * .15 + 's'; p.appendChild(r); setTimeout(() => r.remove(), 1500); }
}
function wirePitch() {
  const p = $('.pitch'); if (!p) return; p.classList.add('play'); const re = c => { p.classList.remove('play', 'shoot'); void p.getBoundingClientRect(); p.classList.add(c); };
  $('.ball', p).onclick = () => { re('shoot'); setTimeout(() => confetti(p), 800); setTimeout(() => re('play'), 2800); };
}
const shirt = (n, c) => `<svg class="shirt" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3L2.5 6l2.2 4.4L7 9.3V21h10V9.3l2.3 1.1L21.5 6 16 3a4 4 0 0 1-8 0z" fill="${c}"/><text x="12" y="17" text-anchor="middle" fill="#fff" font-size="9" font-weight="800" font-family="Plus Jakarta Sans,sans-serif">${n}</text></svg>`;
const CH = {};
function chart(id, cfg) {
  if (!window.Chart) return; CH[id] && CH[id].destroy();
  Chart.defaults.animation = { duration: 900, easing: 'easeOutQuart', delay: c => c.type === 'data' && c.mode === 'default' ? c.dataIndex * 55 : 0 }; Chart.defaults.font.family = 'Inter, sans-serif'; Chart.defaults.color = '#566a60';
  cfg.options = Object.assign({ responsive: true, maintainAspectRatio: false }, cfg.options); CH[id] = new Chart($('#' + id), cfg);
}
const axisY = { beginAtZero: true, grid: { color: '#eef1ef' }, border: { display: false }, ticks: { callback: v => rps(v) } };
const axisX = { grid: { display: false }, border: { display: false } };
const tipRp = { callbacks: { label: c => ` ${c.dataset.label || c.label}: ${rp(c.parsed.y ?? c.parsed.x ?? c.parsed)}` } };
function countTo(el, to) { const t0 = performance.now(); (function f(t) { const p = Math.min(1, (t - t0) / 900); el.textContent = rp(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(t0); }
async function boot(c) {
  mount(c);
  $$('.kpi-grid').forEach(e => e.innerHTML = '<div class="skel"></div>'.repeat(6)); const h = $('#hero'); if (h) h.innerHTML = '<div class="skel" style="min-height:200px;grid-column:1/-1"></div>';
  const go = async f => { let d = await Data.load(f); if (d.locked) d = await askPin(d.wrong); if (Lock.get() && !$('#lockbtn') && $('.sp')) { $('.sp').insertAdjacentHTML('afterend', '<button class="btn" id="lockbtn" type="button" style="margin-bottom:10px">Kunci</button>'); $('#lockbtn').onclick = () => { Lock.clear(); location.href = 'index.html'; }; } STATE.d = d; const s = $('#sync'); s.className = 'sync' + (d.live ? ' live' : ''); s.innerHTML = '<i></i><span>' + (d.live ? 'Terhubung ke spreadsheet' : 'Memakai data contoh') + '</span>'; c.render(d); };
  const r = $('#range'); if (r) r.onchange = e => { Range.set(e.target.value); c.render(STATE.d); };
  $('#refresh').onclick = async e => { const b = e.currentTarget; b.classList.add('busy'); await go(true); b.classList.remove('busy'); };
  await go(false);
}

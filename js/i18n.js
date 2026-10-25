/* Bahasa / Language: English (default) dan Indonesia. Kunci = teks Inggris; kamus ID di bawah. */
const LANG = (() => { try { return localStorage.getItem('l4.lang') || 'en'; } catch (e) { return 'en'; } })();
const LOC = LANG === 'id' ? 'id-ID' : 'en-GB', NUM = LANG === 'id' ? 'id-ID' : 'en-US';
const EN = { 'greet.m': 'Good morning', 'greet.a': 'Good afternoon', 'greet.e': 'Good evening', 'greet.n': 'Good evening' };
const ID = {
  'greet.m': 'Selamat pagi', 'greet.a': 'Selamat siang', 'greet.e': 'Selamat sore', 'greet.n': 'Selamat malam',
  'Dashboard': 'Dashboard', 'Transactions': 'Transaksi', 'Analytics': 'Analitik', 'Budget': 'Anggaran', 'Personal finance control': 'Kendali keuangan pribadi',
  'Refresh': 'Muat ulang', 'Lock': 'Kunci', 'Loading…': 'Memuat…', 'Connected to spreadsheet': 'Terhubung ke spreadsheet', 'Using sample data': 'Memakai data contoh', 'Close': 'Tutup', 'Period': 'Periode',
  'All time': 'Semua waktu', 'Last 7 days': '7 hari terakhir', 'Last 30 days': '30 hari terakhir', 'This month': 'Bulan ini', 'Last month': 'Bulan lalu',
  'Income': 'Pemasukan', 'Expenses': 'Pengeluaran', 'Savings': 'Tabungan', 'Investments': 'Investasi',
  'Your finances at a glance.': 'Ringkasan keuanganmu dalam satu layar.', 'Search, filter and export every entry.': 'Cari, saring, dan ekspor semua catatanmu.', 'Spending patterns, monthly trends and comparisons.': 'Pola belanja, tren bulanan, dan perbandingan.', 'Set category limits and track your savings goal.': 'Atur batas belanja dan pantau target tabunganmu.',
  'Available balance · {r}. Net of expenses, savings and investments.': 'Saldo tersedia · {r}. Sudah dikurangi pengeluaran, tabungan, dan investasi.',
  'Savings rate': 'Rasio menabung', 'Daily average': 'Rata-rata harian', '{n} transactions': '{n} transaksi', '{n} deposits': '{n} setoran', 'of total income': 'dari total pemasukan', 'spent per day': 'pengeluaran per hari',
  'Daily cash flow': 'Arus kas harian', 'Spending by category': 'Pengeluaran per kategori', 'Budget this month': 'Anggaran bulan ini', 'Manage': 'Atur', "Coach's notes": 'Kata pelatih', 'Recent transactions': 'Transaksi terbaru', 'View all': 'Lihat semua',
  'No expenses in this period.': 'Belum ada pengeluaran di periode ini.', 'No limits set yet. <a class="link" href="budget.html">Set up budgets</a>': 'Belum ada batas yang diatur. <a class="link" href="budget.html">Atur anggaran</a>',
  'Largest expense: <b>{d}</b> at <b>{v}</b> on {date}.': 'Pengeluaran terbesar: <b>{d}</b> sebesar <b>{v}</b> pada {date}.', '<b>{c}</b> accounts for <b>{p}%</b> of all spending.': 'Kategori <b>{c}</b> memakai <b>{p}%</b> dari semua pengeluaran.',
  'At the current pace, this month’s spending will reach about <b>{v}</b>.': 'Dengan laju bulan ini, pengeluaran akhir bulan diperkirakan sekitar <b>{v}</b>.', '<b>{n}</b> of {m} days had no spending in this period.': '<b>{n}</b> dari {m} hari di periode ini tanpa pengeluaran.',
  'Your savings rate is below 10%. Try setting money aside first, not from what’s left.': 'Rasio menabungmu di bawah 10%. Coba sisihkan di awal, bukan dari sisa.', 'Nothing to analyse yet.': 'Belum ada data untuk dianalisis.',
  'No transactions yet. Log one through your Telegram bot to get started.': 'Belum ada transaksi. Catat lewat bot Telegram untuk memulai.',
  'Form · last 7 days': 'Form 7 hari', 'Frugal: spending at or below the daily average': 'Hemat: pengeluaran di bawah rata-rata harian', 'Overspent: spending above the daily average': 'Boros: pengeluaran di atas rata-rata harian', 'No activity': 'Tanpa transaksi', 'LATEST': 'TERBARU',
  'Click the ball to take a shot': 'Klik bolanya untuk menendang',
  'Search description or category': 'Cari deskripsi atau kategori', 'All types': 'Semua jenis', 'All categories': 'Semua kategori', 'Newest first': 'Terbaru', 'Oldest first': 'Terlama', 'Highest amount': 'Nominal tertinggi', 'Lowest amount': 'Nominal terendah', 'Export CSV': 'Ekspor CSV',
  'Date': 'Tanggal', 'Description': 'Deskripsi', 'Category': 'Kategori', 'Type': 'Jenis', 'Amount': 'Nominal', 'No transactions match these filters.': 'Tidak ada transaksi yang cocok dengan filter ini.', 'Show more': 'Tampilkan lebih banyak',
  '{n} transactions · {r}': '{n} transaksi · {r}', 'In': 'Masuk', 'Out': 'Keluar', 'Saved/invested': 'Ditabung/diinvestasi', 'Original message': 'Pesan asli', 'Search': 'Cari',
  'Income vs expenses by month': 'Pemasukan vs pengeluaran per bulan', 'All data': 'Semua data', 'When you spend': 'Kapan kamu berbelanja', 'Cumulative balance': 'Saldo kumulatif', 'Average spend by weekday': 'Rata-rata pengeluaran per hari', 'Top categories': 'Kategori teratas', 'Largest expenses': 'Pengeluaran terbesar', 'This month vs last month': 'Bulan ini dibanding bulan lalu', 'By category': 'Per kategori',
  'Late night': 'Dini hari', 'Morning': 'Pagi', 'Midday': 'Siang', 'Afternoon': 'Sore', 'Evening': 'Malam', 'Balance': 'Saldo', 'Average': 'Rata-rata', 'No expenses yet.': 'Belum ada pengeluaran.', 'This month ': 'Bulan ini', 'Change': 'Selisih', 'No data for this month or last month.': 'Belum ada data di bulan ini maupun bulan lalu.',
  'Starting XI: category limits': 'Susunan pemain: batas per kategori', 'Goal: savings and investment target': 'Gawang: target tabungan dan investasi', 'Target amount (Rp)': 'Target total (Rp)', 'e.g. 5,000,000': 'contoh: 5000000', 'Limit (Rp)': 'Batas (Rp)',
  'Over the limit by {v}': 'Melewati batas {v}', '{v} left': 'Sisa {v}', 'Yellow card: nearing the limit': 'Kartu kuning: hampir mencapai batas', 'Red card: limit exceeded': 'Kartu merah: melewati batas', 'GOAL! Target reached.': 'GOL! Target tercapai.', '{v} to go.': 'Kurang {v} lagi ke gawang.',
  'of {v}': 'dari {v}', 'Set a target to track progress. Savings plus investments are counted.': 'Isi target untuk melihat progresnya. Yang dihitung: total Tabungan ditambah Investasi.', 'Limits and targets are stored in this browser only, so set them again on other devices.': 'Batas dan target disimpan di browser ini, jadi di perangkat lain perlu diisi ulang.',
  'Log4Money is locked': 'Log4Money terkunci', 'Enter your code to open it.': 'Masukkan kodemu untuk membuka.', 'Access code': 'Kode akses', 'Wrong code, try again.': 'Kode salah, coba lagi.', 'Remember on this device': 'Ingat di perangkat ini', 'Unlock': 'Buka',
  'Personal finance, under control': 'Keuangan pribadi, terkendali', 'Every rupiah, accounted for.': 'Setiap rupiah, tercatat rapi.',
  'Log4Money turns the entries you send to your Telegram bot into a live dashboard: balance, cash flow, budgets and savings goals in one private workspace.': 'Log4Money mengubah catatan yang kamu kirim ke bot Telegram menjadi dasbor langsung: saldo, arus kas, anggaran, dan target tabungan dalam satu ruang kerja pribadi.',
  'Open dashboard': 'Buka dashboard', 'Live balance': 'Saldo langsung', 'Transaction ledger': 'Buku transaksi', 'Every entry searchable, filterable and exportable to CSV.': 'Setiap catatan bisa dicari, disaring, dan diekspor ke CSV.',
  'Spending analytics': 'Analitik pengeluaran', 'Monthly trends, time-of-day patterns and month-over-month comparisons.': 'Tren bulanan, pola waktu belanja, dan perbandingan antar bulan.', 'Budgets and goals': 'Anggaran dan target', 'Per-category limits with card warnings, plus a savings target to chase.': 'Batas per kategori dengan peringatan kartu, plus target tabungan yang dikejar.',
  'Locked. You will be asked for your code when you open the dashboard.': 'Terkunci. Kamu akan diminta kode saat membuka dashboard.', 'Built for personal use. Your data stays in your own spreadsheet.': 'Dibuat untuk pemakaian pribadi. Datamu tetap ada di spreadsheet milikmu sendiri.', 'Language': 'Bahasa'
};
const t = (k, v) => { let s = (LANG === 'id' ? ID[k] : EN[k]) || k; if (v) for (const x in v) s = s.split('{' + x + '}').join(v[x]); return s; };
const JL = { Pemasukan: 'Income', Pengeluaran: 'Expenses', Tabungan: 'Savings', Investasi: 'Investments' };
const CLN = { Makanan: 'Food', Transport: 'Transport', Belanja: 'Shopping', Tagihan: 'Bills', Hiburan: 'Entertainment', Kesehatan: 'Health', Lainnya: 'Other', 'Uang Saku': 'Allowance', Gaji: 'Salary', Bonus: 'Bonus', Simpanan: 'Savings', Investasi: 'Investments' };
const jl = j => LANG === 'id' ? j : (JL[j] || j), cl = c => LANG === 'id' ? c : (CLN[c] || c);
function setLang(l) { try { localStorage.setItem('l4.lang', l); } catch (e) {} location.reload(); }
function langSwitch() { return `<div class="lang" role="group" aria-label="${t('Language')}"><button type="button" class="${LANG === 'en' ? 'on' : ''}" onclick="setLang('en')">EN</button><button type="button" class="${LANG === 'id' ? 'on' : ''}" onclick="setLang('id')">ID</button></div>`; }
function applyI18n() {
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-t]').forEach(e => e.textContent = t(e.dataset.t));
  document.querySelectorAll('[data-t-ph]').forEach(e => e.placeholder = t(e.dataset.tPh));
  document.querySelectorAll('[data-t-al]').forEach(e => e.setAttribute('aria-label', t(e.dataset.tAl)));
  const ti = document.body.dataset.title; if (ti) document.title = 'Log4Money · ' + t(ti);
}

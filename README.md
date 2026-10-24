# Log4Money

Website keuangan pribadi (terang, multi-halaman): Sambutan, Dashboard, Transaksi, Analitik, Anggaran. Statis + satu fungsi Vercel (`api/data.js`). Data dari Google Sheets lewat Apps Script; pencatatan lewat bot Telegram.

## Pasang
1. Di Apps Script (satu script dengan bot), ganti fungsi `doGet` dengan isi `apps-script/doGet-dashboard.gs`. Deploy > Kelola deployment > Edit > Versi baru (URL tetap).
2. Push folder ke GitHub, Import di Vercel (Framework: Other, tanpa build command).
3. Vercel > Environment Variables: `APPS_SCRIPT_URL` (URL /exec) dan `DASH_KEY` (opsional, samakan dengan Properti skrip). Redeploy.

Opsional: tambah `DASH_PIN` di Environment Variables untuk mengunci website dengan kode (data baru keluar kalau kode benar). Tanpa `DASH_PIN`, website terbuka untuk siapa pun yang tahu linknya.

Tanpa langkah 3, situs memakai data contoh. Klik logo di mana pun untuk kembali ke halaman sambutan.

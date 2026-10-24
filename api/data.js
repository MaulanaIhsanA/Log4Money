// Perantara aman: browser memanggil /api/data, fungsi ini yang memanggil Apps Script.
// Environment Variables di Vercel: APPS_SCRIPT_URL (wajib), DASH_KEY (opsional, samakan dengan Apps Script),
// DASH_PIN (opsional: kode akses website; kalau diisi, data hanya keluar untuk yang tahu kodenya).
const crypto = require('crypto');
const same = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
module.exports = async (req, res) => {
  const { APPS_SCRIPT_URL, DASH_KEY, DASH_PIN } = process.env;
  res.setHeader('Cache-Control', 'no-store');
  if (DASH_PIN && !same(req.headers['x-pin'] || '', DASH_PIN)) {
    await new Promise(r => setTimeout(r, 700)); // memperlambat tebak-tebakan kode
    return res.status(401).json({ error: 'terkunci' });
  }
  if (!APPS_SCRIPT_URL) return res.status(500).json({ error: 'APPS_SCRIPT_URL belum diisi' });
  try {
    const u = new URL(APPS_SCRIPT_URL);
    u.searchParams.set('action', 'data');
    if (DASH_KEY) u.searchParams.set('key', DASH_KEY);
    const j = await (await fetch(u, { redirect: 'follow' })).json();
    return res.status(200).json(j);
  } catch (e) { return res.status(502).json({ error: 'gagal mengambil data' }); }
};

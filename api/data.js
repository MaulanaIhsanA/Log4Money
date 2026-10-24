// Perantara aman: browser memanggil /api/data, fungsi ini yang memanggil Apps Script.
// Vercel > Settings > Environment Variables: APPS_SCRIPT_URL (URL /exec) dan DASH_KEY (opsional).
module.exports = async (req, res) => {
  const { APPS_SCRIPT_URL, DASH_KEY } = process.env;
  if (!APPS_SCRIPT_URL) return res.status(500).json({ error: 'APPS_SCRIPT_URL belum diisi' });
  try {
    const u = new URL(APPS_SCRIPT_URL);
    u.searchParams.set('action', 'data');
    if (DASH_KEY) u.searchParams.set('key', DASH_KEY);
    const j = await (await fetch(u, { redirect: 'follow' })).json();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(j);
  } catch (e) { return res.status(502).json({ error: 'gagal mengambil data' }); }
};

// GANTI fungsi doGet lama di script bot-mu (yang hanya membalas 'Bot aktif') dengan kode ini.
// Opsional: Setelan project > Properti skrip > DASH_KEY (samakan dengan Vercel).
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action !== 'data') return ContentService.createTextOutput('Bot aktif');
  const key = PropertiesService.getScriptProperties().getProperty('DASH_KEY');
  if (key && p.key !== key) return json_({ error: 'unauthorized' });
  const v = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].getDataRange().getValues();
  v.shift(); // Tanggal, Jenis, Deskripsi, Nominal, Kategori, Pesan Asli, Chat ID
  const tz = Session.getScriptTimeZone();
  return json_(v.filter(r => r[0]).map(r => ({
    tanggal: Utilities.formatDate(new Date(r[0]), tz, "yyyy-MM-dd'T'HH:mm:ss"),
    jenis: r[1], deskripsi: r[2], nominal: Number(r[3]), kategori: r[4], pesan: r[5] || ''
  })));
}
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// يبني index.html من ../web/index.html ويضيف سياسة الأمان، ويزامن رقم الإصدار
const fs = require('fs');
const csp = "default-src 'self' 'unsafe-inline' blob: data: https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://api.github.com; img-src * blob: data:; media-src * blob: data:; worker-src blob: https:; font-src * data:";
let h = fs.readFileSync(__dirname + '/../web/index.html', 'utf8');
h = h.replace('<head>', '<head><meta http-equiv="Content-Security-Policy" content="' + csp + '">');
fs.writeFileSync(__dirname + '/index.html', h);
const m = h.match(/const VERSION='([\d.]+)'/);
if (m) {
  const p = JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8'));
  if (p.version !== m[1]) { p.version = m[1]; fs.writeFileSync(__dirname + '/package.json', JSON.stringify(p, null, 2)); }
  console.log('version', m[1]);
}

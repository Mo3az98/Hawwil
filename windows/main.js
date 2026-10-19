const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const path = require('path');
const https = require('https');
const fs = require('fs');
const os = require('os');
let win;
function create() {
  Menu.setApplicationMenu(null);
  win = new BrowserWindow({
    icon: require('path').join(__dirname,'build','icon.png'),
    width: 1100, height: 780, minWidth: 420, minHeight: 560,
    frame: false, backgroundColor: '#211a13', title: 'حوّل',
    webPreferences: {
      devTools: false, preload: path.join(__dirname, 'preload.js'), contextIsolation: true }
  });
  win.loadFile('index.html');
}
ipcMain.handle('toggle-top', () => {
  const on = !win.isAlwaysOnTop();
  win.setAlwaysOnTop(on, 'floating');
  return on;
});
ipcMain.on('win', (_e, action) => {
  if (action === 'min') win.minimize();
  else if (action === 'max') win.isMaximized() ? win.unmaximize() : win.maximize();
  else if (action === 'close') win.close();
});

// تحديث: ينزّل المثبّت من GitHub ويشغّله ثم يغلق التطبيق
function download(url, dest, cb, hops = 0) {
  https.get(url, { headers: { 'User-Agent': 'Hawwil' } }, (res) => {
    if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && hops < 6) {
      res.resume();
      return download(res.headers.location, dest, cb, hops + 1);
    }
    if (res.statusCode !== 200) { res.resume(); return cb(new Error('HTTP ' + res.statusCode)); }
    const f = fs.createWriteStream(dest);
    res.pipe(f);
    f.on('finish', () => f.close(() => cb(null)));
    f.on('error', cb);
  }).on('error', cb);
}
ipcMain.handle('update-install', (_e, url) => new Promise((resolve) => {
  let u;
  try { u = new URL(url); } catch (e) { return resolve({ ok: false }); }
  if (u.protocol !== 'https:' || u.hostname !== 'github.com' || !u.pathname.startsWith('/Mo3az98/Hawwil/releases/download/')) return resolve({ ok: false });
  const dest = path.join(os.tmpdir(), 'Hawwil-Setup-update.exe');
  download(url, dest, async (err) => {
    if (err) return resolve({ ok: false, error: err.message });
    const r = await shell.openPath(dest);
    if (r) return resolve({ ok: false, error: r });
    resolve({ ok: true });
    setTimeout(() => app.quit(), 800);
  });
}));

app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());

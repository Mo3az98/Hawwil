const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('hawwilNative', {
  toggleTop: () => ipcRenderer.invoke('toggle-top'),
  win: (action) => ipcRenderer.send('win', action),
  update: (url) => ipcRenderer.invoke('update-install', url)
});

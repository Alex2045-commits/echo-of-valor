const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,  // aggiungi questa riga per usare Node.js nel renderer
      contextIsolation: false // utile per debug, ma da togliere in produzione
    }
  });

  win.loadFile('index.html');

  // Apre la console di sviluppo automaticamente
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
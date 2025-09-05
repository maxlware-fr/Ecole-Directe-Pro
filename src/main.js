const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let splash;

function createWindow() {
  splash = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    center: true,
    show: false,
  });

  splash.loadFile('splash.html');
  splash.once('ready-to-show', () => splash.show());

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    frame: false,
    resizable: false,
    show: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: false,
      sandbox: false,
    }
  });

  mainWindow.loadURL('https://www.ecoledirecte.com/');

  mainWindow.webContents.on('did-finish-load', () => {
    const css = fs.readFileSync(path.join(__dirname, 'style-pro.css'), 'utf8');
    mainWindow.webContents.insertCSS(css).then(() => {
      console.log('[OK] CSS injected.');

      mainWindow.webContents.executeJavaScript(`
        const titre = document.querySelector('img[alt="EcoleDirecte"]')?.nextElementSibling;
        if (titre && titre.textContent.includes("EcoleDirecte")) {
          titre.textContent = titre.textContent.replace("EcoleDirecte", "Ecole Directe Pro");
        }
        if (document.title.includes("EcoleDirecte")) {
          document.title = document.title.replace("EcoleDirecte", "Ecole Directe Pro");
        }
        console.log("[OK] JS injected.");
      `);
    });

    setTimeout(() => {
      if (splash) splash.destroy();
      mainWindow.show();
    }, 3000);
  });
}

app.whenReady().then(() => {
  createWindow();
});

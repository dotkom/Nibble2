const electron = require('electron');
const { app } = electron;


const { BrowserWindow } = electron;

app.on('ready', () => {
  let mainWindow = new BrowserWindow({
    frame: false,
    autoHideMenuBar: true,
    kiosk: true,
  });
  mainWindow.loadURL('http://localhost:8080/');
  mainWindow.on('closed', () => {
    // Deref mainWindow
    mainWindow = null;
    app.quit();
  });
});


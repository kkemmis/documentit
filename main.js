const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

// init win
let win;

function createWindow() {
    // Create browser window
    win = new BrowserWindow({ width: 800, height: 600, icon: });

    // Load index.html
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open devtools
    win.webContents().openDevTools();

    win.on('closed', () => {
        win = null;
    });
}

// Run create window function
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {

    // Check if user is on a Mac
    if (process.platform !== 'darwin') {
        app.quit();

    }

});
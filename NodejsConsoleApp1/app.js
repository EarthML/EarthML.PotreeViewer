'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const url = require("url");
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let datafile = null;
function createWindow() {
    electron_1.protocol.interceptFileProtocol('file', (request, callback) => {
        const url = request.url.substr(8); /* all urls start with 'file://' */
        if (url.startsWith('raw-data')) {
            let dataurl = url.replace("raw-data", path.dirname(datafile));
            callback(dataurl);
        }
        else {
            let b = path.normalize(`${__dirname}/${url}`);
            callback(b);
        }
    }, (err) => {
        if (err)
            console.error('Failed to register protocol');
    });
    // Create the browser window.
    win = new electron_1.BrowserWindow({ width: 800, height: 600 });
    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on('ready', createWindow);
// Quit when all windows are closed.
electron_1.app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});
var showOpen = function () {
    electron_1.dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'JS', extensions: ['js'] }] }, (fileNames) => {
        var fileName = fileNames[0];
        datafile = fileName;
        // and load the index.html of the app.
        win.loadURL(url.format({
            pathname: 'viewer.html',
            protocol: 'file:',
            slashes: true
        }));
        // Open the DevTools.
        win.webContents.openDevTools();
    });
};
var template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open',
                click: function () { showOpen(); }
            }
        ]
    }
];
let menu = electron_1.Menu.buildFromTemplate(template);
electron_1.Menu.setApplicationMenu(menu);
//# sourceMappingURL=app.js.map
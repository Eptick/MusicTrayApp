// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, Tray, Menu, BrowserWindow, ipcMain } from 'electron';
import devHelper from './helpers/dev';
import createWindow from './helpers/window';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

var mainWindow;
var trayWindow;
global.trayWindow = trayWindow;
global.tray = null;
global.firstStart = true;
app.on('ready', function () {

    var mainWindow = createWindow('main', {
        width: 1000,
        height: 600
    });

    mainWindow.loadURL('file://' + __dirname + '/app.html');

    if (env.name !== 'production') {
        devHelper.setDevMenu();
        mainWindow.openDevTools();
    }
    global.tray = new Tray(__dirname + "/IconTemplate.png");
    var contextMenu = Menu.buildFromTemplate([{
        label: 'Quit the App',
        accelerator: 'CmdOrCtrl+S',
        click: function () {
            global.tray.emit("shutdown");
            global.tray.destroy();
        }
    }]);
    global.tray.setToolTip('This is my music tray app.');
    global.tray.setContextMenu(contextMenu);
    global.tray.on('shutdown', function () {
        app.quit();
    });
    var trayWindow = new BrowserWindow({
        width: 400, height: 400,
        show: false, resizable: false, frame: false,
        movable: false
    });
    trayWindow.loadURL(app.getAppPath() + "/tray.html");
    trayWindow.openDevTools();
    global.tray.on("click", function (event, bounds) {
        console.log(typeof (bounds));
        //trayWindow.setBounds({x : parseInt(parseInt(bounds.x) - 200), y: parseInt(parseInt(bounds.y) - 400)});
        if (trayWindow.isVisible()) {
            trayWindow.hide();
        } else {

            trayWindow.webContents.send('showTrayWindow', trayWindow.id, bounds);
        }

    });
    global.trayWindow = trayWindow;


});

app.on('window-all-closed', function () {
    app.quit();
});

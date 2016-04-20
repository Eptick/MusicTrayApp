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
app.on('ready', function () {

    global.tray = new Tray(__dirname + "/IconTemplate.png");
    var contextMenu = Menu.buildFromTemplate([{
        label: 'Exit',
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
        width: 310, height: 480,
        show: false, resizable: false, frame: false,
        movable: false
    });
    devHelper.setDevMenu();
    trayWindow.loadURL(app.getAppPath() + "/app.html");
   
    trayWindow.on("blur",function(){
        if(env.name === 'production')
                trayWindow.hide();
    });
   
     if (env.name !== 'production') {
        devHelper.setDevMenu();
        trayWindow.openDevTools();
    }
    
    
    global.tray.on( 'double-click' , function (event, bounds) {
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

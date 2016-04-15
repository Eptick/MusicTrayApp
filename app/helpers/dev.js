import { app, Menu, BrowserWindow,Tray } from 'electron';



var setDevMenu = function () {
    var devMenu = Menu.buildFromTemplate([{
        label: 'Development',
        submenu: [{
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: function () {
                //global.tray.removeAllListeners();
                BrowserWindow.fromId(1).webContents.reloadIgnoringCache();
                BrowserWindow.fromId(2).webContents.reloadIgnoringCache();
                //global.tray = new Tray(__dirname + "/IconTemplate.png");
            }
        },{
            label: 'Toggle DevTools',
            accelerator: 'Alt+CmdOrCtrl+I',
            click: function () {
                BrowserWindow.getFocusedWindow().toggleDevTools();
            }
        },{
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click: function () {
                app.quit();
            }
        }]
    }]);
    Menu.setApplicationMenu(devMenu);
};

export default {
    setDevMenu: setDevMenu,
}

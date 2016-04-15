// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
import os from 'os'; // native node.js module
import { remote, ipcRenderer } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import env from './env';


console.log('Loaded environment variables:', env);

var BrowserWindow = remote.BrowserWindow;
var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());

var tray = remote.getGlobal("tray");
var tWindow = BrowserWindow.fromId(2);

document.addEventListener('DOMContentLoaded', function () {

});

ipcRenderer.on("showTrayWindow", function (event, m1, m2) {
    var win = remote.getCurrentWindow();
    win.show();
    win.setPosition(m2.x - 200, m2.y - 400);

});
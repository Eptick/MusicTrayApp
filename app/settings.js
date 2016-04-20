import { remote } from 'electron';
import env from './env';
import  fs  from 'fs';


var app = remote.app;

var appPath;
var songsPath;
 if (env.name !== 'production') {
    appPath = app.getAppPath();
    songsPath = appPath + "/../songs";
 } else {
    appPath = app.getAppPath().slice(0,app.getAppPath().length - 8);
    songsPath = appPath + "songs";
}
function getAllSongs(){
    return fs.readdirSync(songsPath);
}
function getSongsPath(){
    return songsPath;
}

export default {
    appPath: appPath,
    getAllSongs: getAllSongs,
    getSongsPath: getSongsPath
};

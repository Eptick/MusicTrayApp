import { remote } from 'electron';
import env from './env';
import  fs  from 'fs';


var app = remote.app;

var appPath;
var songsPath;
 if(localStorage.getItem("songsPath") === null){

        if (env.name !== 'production') {
        appPath = app.getAppPath();
        songsPath = appPath + "/../songs";
        } else {
        appPath = app.getAppPath().slice(0,app.getAppPath().length - 8);
        songsPath = appPath + "songs";
        }
        localStorage.setItem("songsPath",songsPath);
 } else {
     songsPath = localStorage.getItem("songsPath");
 }
function getAllSongs(){
    var songs = fs.readdirSync(songsPath);
    songs = songs.filter(function(x) {
       return x.endsWith(".mp3");
    });
    console.log(songs.length === 0 );
    if(songs.length === 0){
      songs = null;
      window.hasSongs = false;
      return songs;
    }
    window.hasSongs = true;
    return songs;
}
function getSongsPath(){
    return songsPath;
}
function setSongsPath(path){
    songsPath = path;
    return songsPath;
}

export default {
    appPath: appPath,
    getAllSongs: getAllSongs,
    getSongsPath: getSongsPath,
    setSongsPath: setSongsPath
};

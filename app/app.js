// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
import os from 'os'; // native node.js module
import { remote, ipcRenderer } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import env from './env';
import settings from './settings';
import setDevMenu from './helpers/dev';
import YoutubeMp3Downloader from 'youtube-mp3-downloader';
import Youtube from 'youtube-node'; 


console.log('Loaded environment variables:', env);

var BrowserWindow = remote.BrowserWindow;
var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());

var tray = remote.getGlobal("tray");
var tWindow = BrowserWindow.fromId(2);

//Configure YoutubeMp3Downloader with your settings 
 if (env.name !== 'production') {
    
        var YD = new YoutubeMp3Downloader({
    "ffmpegPath": app.getAppPath() + '/../ffmpeg/bin/ffmpeg.exe',        // Where is the FFmpeg binary located? 
    "outputPath": app.getAppPath() + '/../songs',    // Where should the downloaded and encoded files be stored? 
    "youtubeVideoQuality": "lowest",       // What video quality should be used? 
    "queueParallelism": 4,                  // How many parallel downloads/encodes should be started? 
    "progressTimeout": 2000                 // How long should be the interval of the progress reports 
});
 } else {
    var tPath = app.getAppPath().slice(0,app.getAppPath().length - 8);

     var YD = new YoutubeMp3Downloader({
    "ffmpegPath": app.getAppPath() + '/../ffmpeg/bin/ffmpeg.exe',        // Where is the FFmpeg binary located? 
    "outputPath": tPath + 'songs',    // Where should the downloaded and encoded files be stored? 
    "youtubeVideoQuality": "lowest",       // What video quality should be used? 
    "queueParallelism": 4,                  // How many parallel downloads/encodes should be started? 
    "progressTimeout": 2000                 // How long should be the interval of the progress reports 
});
}
    

 
//Download video and save as MP3 file 

 
YD.on("finished", function(data) {
    console.log(data);
    //player.src = data.file;
	$(".download-slider").hide();
	localSongs.push(data.videoTitle);	
});
 
YD.on("error", function(error) {
    console.log(error);
});
 
YD.on("progress", function(progress) {
    console.log(progress.progress.percentage);
	var percent = Math.round(progress.progress.percentage);
	$("#download-slider").css('background', '-webkit-linear-gradient(left, #5cffbd 0%, #5cffbd ' + percent + '%, #333 ' + percent + '%)');
});

var localSongs = settings.getAllSongs();
var audio;
var yt = new Youtube();
yt.setKey(env.apiKey);


$(document).ready(function(){
    audio =  $("#audio")[0];
    var list = document.getElementById("songsList");
    var overlays = document.getElementById("overlays");
        
    for(var i = 0; i < localSongs.length; i++){
        var li = document.createElement("li");
        var img = document.createElement("IMG");
        img.alt = "";
        img.src = "http://wallup.net/wp-content/uploads/2015/12/163894-record_players-music-simple_background-minimalism-vintage-artwork-digital_art-736x459.png";
        li.appendChild(img);
        li.setAttribute("localIndex",i);
        list.appendChild(li);
        
        var oDiv = document.createElement("DIV");
        oDiv.className ="overlay-image localIndex_"+i;
        //oDiv.style.background = "url(http://placehold.it/180x180)";
        overlays.appendChild(oDiv);
    }
	
	$('.jcarousel').jcarousel({
		wrap: 'circular'
	});

	$('.jcarousel-pagination').jcarouselPagination({
		item: function(page) {
			return '<li class="song" localIndex="' + (page - 1) + '" id="jcarousel-item' + page + '"><a href="#' + page + '">' + page + '</a></li>';
		}
	});

	$('#jcarousel-item1').addClass('active playing');
	
	$(".song").html(localSongs[0]);
	$(".artist").html(" ");
	changeSong();
	
	
	$('.jcarousel-pagination')
		.on('jcarouselpagination:active', 'li', function() {
			$(this).addClass('active').addClass('playing');
		})
		.on('jcarouselpagination:inactive', 'li', function() {
			$(this).removeClass('active').removeClass('playing');
            var index = $(this).attr("localIndex");
            $(".localIndex_"+(index-3)).css("animation","initial")
                            .css("background","initial")
                            .css("background-size","initial");
		});


$('.jcarousel-prev').click(function() {
	$('.jcarousel').jcarousel('scroll', '-=1');
	
	changeSong();
});

$('.jcarousel-next').click(function() {
	$('.jcarousel').jcarousel('scroll', '+=1');

	changeSong();
});
function changeSong(){
	var audio = document.getElementById("audio");

	//$(".play i").removeClass("fa-pause").addClass("fa-play");
	//$(".play").removeClass("active");
    
    var index = $(".playing").attr("localIndex");
	var playingSong = localSongs[index];

	$(".overlay-image").removeClass("active").hide();
    $(".localIndex_"+index).css("animation","fadeIn 0.8s")
                            //.css("background-image","url('http://i.imgur.com/hhbHgZX.jpg')")
							.css("background-repeat", "no-repeat")
							.css("background-position", "45%")
							.css("background-repeat", "20%")
                            .css("background-size","200% auto").show();
    
	$(".song").html(playingSong.slice(0,playingSong.length-4));
	//$(".artist").html("Avicii");
	
	$("#setSong")[0].setAttribute("src", "file:///" + settings.getSongsPath() + "/" + playingSong);
	audio.load();
	if($(".play").hasClass("active")){
		audio.play();	
	}
	$("#fader")[0].value = 0;
}
$(".options a").click(function() {
	$(this).toggleClass("active");
});

$(".favorite").click(function() {
	if ($(".options .favorite i").hasClass("fa-heart")) {
		$(".options .favorite i").removeClass("fa-heart").addClass("fa-heart-o");
	} else {
		$(".options .favorite i").removeClass("fa-heart-o").addClass("fa-heart");
	}
});

$(".play").click(function() {
	$(".play").toggleClass("active");
	if ($(".play i").hasClass("fa-play")) {
		$(".play i").removeClass("fa-play").addClass("fa-pause");
	} else {
		$(".play i").removeClass("fa-pause").addClass("fa-play");
	}
	if(	$(".play").hasClass("active")	){
		$("#audio")[0].play();
	} else {
		$("#audio")[0].pause();
	}
});

$(".volume").click(function() {
	$(".volume").removeClass("active");
	$(".volume-slider").animate({
		marginTop: '-150px'
	}, 500);
});

$(".volume-slider .close").click(function() {
	$(".volume-slider").animate({
		marginTop: '0px'
	}, 500);
});

$(".side-menu-trigger").click(function() {
	$(".side-menu").animate({
		marginLeft: '0px'
	});
	$(".volume-slider").animate({
		marginTop: '0px'
	}, 500);
});

$(".side-menu .close").click(function() {
	$(".side-menu").animate({
		marginLeft: '-310px'
	});
});

$(".side-search").click(function() {
	$(".side-menu-search").animate({
		marginLeft: '0px'
	});
	
	$("#searchInput").keypress(function(event){
		if(event.keyCode === 13){
			yt.search(this.value, 13, function(error, result) {
			if (error) {
				console.log(error);
			}
			else {
				console.log(result);
				var res = document.getElementById("searchResults");
				res.innerHTML = " ";
				for(var i = 0; i < result.items.length;i++){
						var div = document.createElement("DIV");
						var item = result.items[i];
						div.innerHTML = '<i class="fa fa-arrow-circle-down"></i> ' + item.snippet.title;
						div.setAttribute("videoId",item.id.videoId);
						div.className ="search-result-item";
						res.appendChild(div);
				}
				$(".search-result-item").click(function(){
					var id = this.getAttribute("videoId");
					console.log(id);
					YD.download(id);
					$(".download-slider").show();
				});
				$(".search-result-item").hover(function(){
					$(this).addClass("active");
				}, function(){
					$(this).removeClass("active");
				});
				
			}
			});			
		}
	});
	
	
});


$(".side-settings").click(function() {
	$(".side-menu-settings").animate({
		marginLeft: '0px'
	});

});

$(".closePane").click(function(){
	$(this).parent().animate({
		marginLeft: '-310px'
	});
});

$(".homePane").click(function(){
	$(this).parent().animate({
		marginLeft: '-310px'
	},function(){
		$(this).parent().animate({
			marginLeft: '-310px'
		});	
	});
});

$(".side-menu-ul li").hover(function(){
	$(this).addClass("active");
}, function(){
	$(this).removeClass("active");
});

$('.volume-slider input[type="range"]').on('input', function() {
	var percent = Math.ceil(((this.value - this.min) / (this.max - this.min)) * 100);
	setVolume(percent/100);
	$(this).css('background', '-webkit-linear-gradient(left, #e74c3c 0%, #e74c3c ' + percent + '%, #999 ' + percent + '%)');
});

function setVolume(myVolume) {
	var audio = $("#audio")[0];
	audio.volume = myVolume;
}

$("#audio")[0].ondurationchange = function(){
	
	$("#fader")[0].max = Math.round(this.duration);
	var minutes = Math.round(this.duration/60);
	var seconds = Math.round(this.duration)%60;
	if(seconds < 10)
		seconds = "0"+seconds;
	$(".duration").html(minutes +":" + seconds);
};

$("#audio")[0].ontimeupdate  = function(){
	$("#fader").val(this.currentTime);
	var minutes = Math.round(this.currentTime/60);
	var seconds = Math.round(this.currentTime)%60;
	if(minutes < 10)
		minutes = "0"+minutes;
	if(seconds < 10)
		seconds = "0"+seconds;
	$("#duration-display").html(minutes+":"+seconds);
};

$("#audio")[0].onended = function(){
	$('.jcarousel').jcarousel('scroll', '+=1');
	changeSong();
};

$("#fader").on("input",function(){
	audio.currentTime = this.value;
});
$(".refresh-songs").click(refresh);

function refresh(){
	var lastIndex = $(".song.active.playing").attr("localindex");
	lastIndex = parseInt(lasIndex);
	//$(".jcarousel-pagination").html(" ");
	var parent  = $(".jcarousel").parent();
	$(".jcarousel").remove();
	var div = document.createElement("DIV");
	div.className = "jcarousel";
	var ul = document.createElement("ul");
	ul.id = "songsList";
	div.appendChild(ul);
	console.log(parent);
	$(parent).append(div);
	parent = $(".jcarousel-pagination").parent();
	$(".jcarousel-pagination").remove();
	var uv = document.createElement("UL");
	uv.className = "jcarousel-pagination";
	$(parent).append(uv);
	
	$("#overlays").html(" ");
	
	var list = document.getElementById("songsList");
    var overlays = document.getElementById("overlays");
    console.log(localSongs);
    for(var i = 0; i < localSongs.length; i++){
        var li = document.createElement("li");
        var img = document.createElement("IMG");
        img.alt = "";
        img.src = "http://wallup.net/wp-content/uploads/2015/12/163894-record_players-music-simple_background-minimalism-vintage-artwork-digital_art-736x459.png";
        li.appendChild(img);
        li.setAttribute("localIndex",i);
        list.appendChild(li);
        
        var oDiv = document.createElement("DIV");
        oDiv.className ="overlay-image localIndex_"+i;
        //oDiv.style.background = "url(http://placehold.it/180x180)";
        overlays.appendChild(oDiv);
    }
	
	$('.jcarousel').jcarousel({
		wrap: 'circular'
	});

	$('.jcarousel-pagination').jcarouselPagination({
		item: function(page) {
			return '<li class="song" localIndex="' + (page - 1) + '" id="jcarousel-item' + page + '"><a href="#' + page + '">' + page + '</a></li>';
		}
	});

	$('#jcarousel-item'+lastIndex).addClass('active playing');

	
	$('.jcarousel-pagination')
		.on('jcarouselpagination:active', 'li', function() {
			$(this).addClass('active').addClass('playing');
		})
		.on('jcarouselpagination:inactive', 'li', function() {
			$(this).removeClass('active').removeClass('playing');
            var index = $(this).attr("localIndex");
            $(".localIndex_"+(index-3)).css("animation","initial")
                            .css("background","initial")
                            .css("background-size","initial");
		});


	$('.jcarousel-prev').click(function() {
		$('.jcarousel').jcarousel('scroll', '-=1');
	
		changeSong();
	});

	$('.jcarousel-next').click(function() {
		$('.jcarousel').jcarousel('scroll', '+=1');

		changeSong();
	});
}

});

ipcRenderer.on("showTrayWindow", function (event, m1, m2) {
    var win = remote.getCurrentWindow();
    win.show();
    win.setPosition(m2.x - 160, m2.y - 480);
});
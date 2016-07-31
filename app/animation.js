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

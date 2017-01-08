oAudio = document.getElementById('player');
play = $("#play");
album = $("#album");
inn = $("#in");
music_name = $("#music_name");
artist = $("#artist");
neurl = $("#neurl");
cd = $("#cd");
lrc_row = $("#lrc");
bar = $("#bar");
$(document).ready(function () {
	cd_size();
	$.getScript("list.js", function() {
		$.each(musiclist,function(index,item){
			$("#musiclist").append('<a href="javascript:load_music('+item.id+');"><li><strong>'+item.title+'</strong>&nbsp;&nbsp;--&nbsp;&nbsp;<small>'+item.singer+'&nbsp;&nbsp;(♥'+item.like+')</small></li></a>');
		});
		var n = Math.floor(Math.random() * musiclist.length);
		id = musiclist[n].id;
		$.get("https://www.hiyouga.win/html/netease/bbsapi/player.php?type=play&id=" + id, function (data) {
			mp3_info = JSON.parse(data);
			$("#player").attr("src", mp3_info.mp3);
			$("#like_music").attr("href", "javascript:like_music("+id+");");
			$("#dl_music").attr("href", mp3_info.mp3);
			album.css("background-image", "url('" + mp3_info.cover + "?param=100y100')");
			music_name.html(mp3_info.music_name);
			artist.html(mp3_info.artists);
			neurl.attr("href", 'http://music.163.com/song?id='+id);
			if (mp3_info.lrc != "no") {
				lrc = mp3_info.lrc;
			} else {
				lrc = "no";
			}
		});
	});
	oAudio.volume = 0.5;
});
$(window).resize(function () {
    cd_size();
});
$("#player").bind("ended", function () {
    if (lrc != "no") {
        clearInterval(lrc_interval);
    }
    next_music();
});
function m_play() {
    if (oAudio.paused) {
        oAudio.play();
		play.removeClass("ico_play");
		play.addClass("ico_pause");
		$("#miniplay").removeClass("ico_mini_play");
		$("#miniplay").addClass("ico_mini_pause");
        if (lrc != "no") {
            lrc_interval = setInterval("display_lrc()", 1000);
        }
    }
    else {
        oAudio.pause();
		play.removeClass("ico_pause");
		play.addClass("ico_play");
		$("#miniplay").addClass("ico_mini_play");
		$("#miniplay").removeClass("ico_mini_pause");
        if (lrc != "no") {
            clearInterval(lrc_interval);
        }
    }
}
function next_music() {
    oAudio.pause();
    if (!oAudio.paused && lrc != "no") {
        clearInterval(lrc_interval);
    }
	var n = Math.floor(Math.random() * musiclist.length);
	id = musiclist[n].id;
    load_music(id);
}
function load_music(id) {
    $.get("https://www.hiyouga.win/html/netease/bbsapi/player.php?type=play&id=" + id, function (data) {
        mp3_info = JSON.parse(data);
        $("#player").attr("src", mp3_info.mp3);
		$("#like_music").attr("href", "javascript:like_music("+id+");");
		$("#dl_music").attr("href", mp3_info.mp3);
        album.css("background-image", "url('" + mp3_info.cover + "?param=100y100')");
        music_name.html(mp3_info.music_name);
        artist.html(mp3_info.artists);
		play.addClass("ico_pause");
		play.removeClass("ico_play");
		$("#like_music").removeClass("ico_unlike");
		$("#like_music").addClass("ico_like");
		$("#miniplay").removeClass("ico_mini_play");
		$("#miniplay").addClass("ico_mini_pause");
		neurl.attr("href", 'http://music.163.com/song?id='+id);
        oAudio.play();
        lrc_row.html("");
        if (mp3_info.lrc != "no") {
            lrc = mp3_info.lrc;
            lrc_interval = setInterval("display_lrc()", 1000);
        } else {
            lrc = "no";
        }
    });
}
function volume(vol) {
    oAudio.volume = vol / 10;
}
function m_mute() {
	if(oAudio.volume != 0){
		$("#volume").addClass("ico_mute");
		oAudio.volume = 0;
	}else{
		$("#volume").removeClass("ico_mute");
		oAudio.volume = 0.5;
	}
	
}
function cd_size() {
    cd_height = cd.height();
    cd.css("width", cd_height);
}
function display_lrc() {
    play_time = Math.floor(oAudio.currentTime).toString();
    lrc_row.html(lrc[play_time]);
}
oAudio.addEventListener('timeupdate',function(){
	if (!isNaN(oAudio.duration)) {
		var progressValue = (oAudio.currentTime/oAudio.duration)*100;
		if(progressValue == 1){
			progressValue = 0;
		}
		bar.css("width",progressValue+'%');
	};
},false);
function toggle(){
	$("#lrcwarp").fadeOut(100);
	$("#listwarp").fadeOut(100);
	$("#panel").delay(100).animate({width:'hide'},500);
	$("#mini_panel").delay(620).animate({width:'toggle'},200);
	$("#hiyougaplayer").css({
		"height":"50px",
		"width":"65px"
	});
}
function mini_toggle(){
	$("#mini_panel").animate({width:'hide'},200);
	$("#panel").delay(220).animate({width:'toggle'},500);
	$("#hiyougaplayer").css({
		"height":"380px",
		"width":"850px"
	});
}
function showlrc(){
	$("#lrcwarp").fadeToggle(300);
}
function showlist(){
	$("#listwarp").fadeToggle(300);
}
function close_panel(){
	oAudio.pause();
	$("#hiyougaplayer").fadeOut();
}
function add_music(){
	newid = $("#add_music").val();
	$.get("https://www.hiyouga.win/html/netease/bbsapi/player.php?type=upload&id=" + newid, function (data) {
		alert(data);
    });
	$("#add_music").val("");
}
function like_music(id){
	$.get("https://www.hiyouga.win/html/netease/bbsapi/player.php?type=dolike&id=" + id, function (data) {
		if (data = "success") {
			$("#like_music").removeClass("ico_like");
			$("#like_music").addClass("ico_unlike");
		}
    });
}

var txt = '<div class="mini_panel" id="mini_panel"><a href="javascript:m_play();" title="播放/暂停"><i class="ico_ctrl ico_mini_play" id="miniplay"></i><span class="mask"></span><img class="pic" src="default_cover.jpg"/></a><div class="mini_unfold"><a href="javascript:mini_toggle();" class="ico_ctrl ico_unfold" title="展开"></a></div><a href="javascript:close_panel();" class="ico_ctrl ico_close mini_close" title="关闭"></a></div><div class="panel" id="panel"><div class="s-progress"><div id="bar" class="s-bar" style="width:0%;"></div></div><div id="album" class="album"></div><div class="s-info"><div><span id="music_name"></span><br /><span id="artist"></span><br /><span class="neurl">来自：<a id="neurl" rel="nofollow" target="_black" href="">网易云</a></span></div></div><div class="s-action"><div><a href="javascript:prev_music();" id="pre" class="ico_ctrl ico_prev" title="上一首"></a><a style="float:;padding: ;height:;" href="javascript:m_play();" id="play" class="ico_ctrl ico_play" title="播放/暂停"></a><a href="javascript:next_music();" id="next" class="ico_ctrl ico_next" title="下一首"></a><a href="javascript:m_mute();" id="volume" class="ico_ctrl ico_vol" title="音量"></a><a><input id="range" type="range" min="0" max="10" value="5" onchange="volume(this.value);"></a><a href="javascript:like_music();" id="like_music" class="ico_ctrl ico_like" title="赞"></a><a download href="" id="dl_music" class="ico_ctrl ico_share" title="下载" onClick="showtip();"></a><a href="javascript:showlist();" class="ico_ctrl ico_list" title="展开列表"></a><a href="javascript:showlrc();" class="ico_lyric ico_lyric_open" title="显示歌词">词</a></div></div><div class="s-toggle"><a href="javascript:toggle();" class="ico_ctrl ico_fold" title="折叠"></a></div></div><div id="lrcwarp" class="lrcwarp"><span id="lrc" class="s-lrc"></span></div><div id="listwarp" class="listwarp"><div class="upload"><div class="titlebox"><span class="ptitle">播放列表</span><span class="ani_border"></span></div><div class="addbox"><input id="add_music" type="text" placeholder="网易云id" /><a href="javascript:add_music();">+</a></div></div><div id="musiclist" class="musiclist"></div></div><audio id="player"></audio>';
$("#hiyougaplayer").html(txt);
var oAudio = $("#player")[0];
oAudio.volume = 0.5;
play = $("#play");
album = $("#album");
inn = $("#in");
music_name = $("#music_name");
artist = $("#artist");
neurl = $("#neurl");
cd = $("#cd");
lrc_row = $("#lrc");
bar = $("#bar");
cd_size();
$.getScript("list.js", function() {
	$.each(musiclist,function(index,item){
		$("#musiclist").prepend('<a href="javascript:load_music('+item.id+');"><li><span>'+item.title+'</span>&nbsp;&nbsp;--&nbsp;&nbsp;<small>'+item.singer+'</small><small style="right:0;position:absolute;">(♥'+item.like+')</small></li></a>');
	});
	var n = Math.floor(Math.random() * musiclist.length);
	id = musiclist[n].id;
	$.get("player.php?type=play&id=" + id, function (data) {
        mp3_info = JSON.parse(data);
        $("#player").attr("src",mp3_info.mp3);
		$("#like_music").attr("href","javascript:like_music("+id+");");
		$("#dl_music").attr("href",mp3_info.mp3);
        album.css("background-image","url('" + mp3_info.cover + "?param=100y100')");
        music_name.html(mp3_info.music_name);
        artist.html(mp3_info.artists);
		neurl.attr("href",'http://music.163.com/song?id='+id);
        lrc_row.html("");
        if(mp3_info.lrc != 'no'){
            lrc = mp3_info.lrc;
            lrc_interval = setInterval("display_lrc()", 1000);
        }else{
            lrc = "no";
			lrc_row.html('抱歉，暂无歌词');
        }
    });
});
$(window).resize(function () {
    cd_size();
});
$("#player").bind("ended", function () {
    if (lrc != 'no') {
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
        if (lrc != 'no') {
            lrc_interval = setInterval("display_lrc()", 1000);
        }
    }
    else {
        oAudio.pause();
		play.removeClass("ico_pause");
		play.addClass("ico_play");
		$("#miniplay").addClass("ico_mini_play");
		$("#miniplay").removeClass("ico_mini_pause");
        if (lrc != 'no') {
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
    $.get("player.php?type=play&id=" + id, function (data) {
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
        if(mp3_info.lrc != 'no'){
            lrc = mp3_info.lrc;
            lrc_interval = setInterval("display_lrc()", 1000);
        }else{
            lrc = "no";
			lrc_row.html('抱歉，暂无歌词');
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
	$("#panel").delay(220).animate({width:'hide'},500,function (){
		$("#hiyougaplayer").css({
			"height":"50px",
			"width":"65px"
		});
	});
	$("#mini_panel").delay(740).animate({width:'toggle'},200);
	
}
function mini_toggle(){
	$("#mini_panel").animate({width:'hide'},200);
	$("#hiyougaplayer").css({
		"height":"380px",
		"width":"850px"
	});
	$("#panel").delay(220).animate({width:'toggle'},500);
}
function showtip(){
	alert('\u8bf7\u624b\u52a8\u91cd\u547d\u540d\u4e3a.mp3\u6587\u4ef6');
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
	$.get("player.php?type=upload&id=" + newid, function (data) {
		alert(data);
		$("#add_music").val("");
    });
}
function like_music(id){
	$.get("player.php?type=dolike&id=" + id, function (data) {
		if (data = "success"){
			$("#like_music").removeClass("ico_like");
			$("#like_music").addClass("ico_unlike");
			$("#like_music").attr("href", "javascript:like_music();");
		}
    });
}
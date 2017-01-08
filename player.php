<?php
if($_GET['type']=='play'){
	//获取数据
	$id = $_GET['id'];
	$music_info = json_decode(get_music_info($id), true);
	$lrc_info = json_decode(get_music_lyric($id), true);
	//处理音乐信息
	$play_info["cover"] = $music_info["songs"][0]["album"]["picUrl"];
	$play_info["mp3"] = $music_info["songs"][0]["mp3Url"];
	$play_info["mp3"] = str_replace("http://m", "http://p", $play_info["mp3"]);
	$play_info["music_name"] = $music_info["songs"][0]["name"];
	foreach ($music_info["songs"][0]["artists"] as $key) {
		if (!isset($play_info["artists"])) {
			$play_info["artists"] = $key["name"];
		} else {
			$play_info["artists"] .= "," . $key["name"];
		}
	}
	//处理歌词
	if (isset($lrc_info["lrc"]["lyric"])) {
		$lrc = explode("\n", $lrc_info["lrc"]["lyric"]);
		array_pop($lrc);
		foreach ($lrc as $rows) {
			$row = explode("]", $rows);
			if (count($row) == 1) {
				$play_info["lrc"] = "no";
				break;
			} else {
				$lyric = array();
				$col_text = end($row);
				array_pop($row);
				foreach ($row as $key) {
					$time = explode(":", substr($key, 1));
					$time = $time[0] * 60 + $time[1];
					$play_info["lrc"][$time] = $col_text;
				}
			}
		}
	} else {
		$play_info["lrc"] = "no";
	}
	echo json_encode($play_info);
}
if($_GET['type']=='upload'){
	$id = $_GET['id'];
	$music_info = json_decode(get_music_info($id), true);
	$title = $music_info["songs"][0]["name"];
	foreach ($music_info["songs"][0]["artists"] as $key) {
		if (!isset($play_info["artists"])) {
			$artists = $key["name"];
		} else {
			$artists .= "," . $key["name"];
		}
	}
	//检查错误
	if(empty($title)){
		echo '网易云音乐链接错误，请重新提交！';
		exit;
	}
	$play_info["mp3"] = $music_info["songs"][0]["mp3Url"];
	$mp3 = str_replace("http://m", "http://p", $play_info["mp3"]);
	if(get_headers($mp3)[4]=='Content-Length: 168'){
		echo '该歌曲不属于支持范围内，请重新选曲！';
		exit;
	}
	$contents = file_get_contents('list.js');
	if(!!strpos($contents,$title)){
		echo '歌曲已存在，请不要重复提交！';
		exit;
	}
	$contents = str_replace('var musiclist = [','',$contents);
	$contents = str_replace('];','',$contents);
	preg_match_all("#\{(.+?)\}#is",$contents,$arr);
	$newarr = array(); 
	foreach ($arr[0] as $k=>$v) {
		$newarr[$k] = json_decode($v,true);
	}
	$add = array("title"=>$title,"singer"=>$artists,"like"=>"0","id"=>$id);
	$newarr[] = $add;
	foreach ($newarr as $k=>$v) {
		$recontents .= json_encode($v).',';
	}
	$recontents = 'var musiclist = ['.$recontents.'];';
	$num = file_put_contents('list.js',$recontents);
	echo '提交成功';
}
if($_GET['type']=='dolike'){
	$id = $_GET['id'];
	$contents = file_get_contents('list.js');
	$contents = str_replace('var musiclist = [','',$contents);
	$contents = str_replace('];','',$contents);
	preg_match_all("#\{(.+?)\}#is",$contents,$arr);
	$newarr = array();
	foreach ($arr[0] as $k=>$v) {
		$p = json_decode($v,true);
		if(in_array($id,$p)){
			$p['like'] = $p['like']+1;
		}
		$newarr[$k] = $p;
	}
	foreach ($newarr as $k=>$v) {
		$recontents .= json_encode($v).',';
	}
	$recontents = 'var musiclist = ['.$recontents.'];';
	$num = file_put_contents('list.js',$recontents);
	echo 'success';
}
if($_GET['type']=='delect'){
	
}
function curl_get($url)
{
    $header[] = "Cookie: " . "appver=1.5.0.75771;";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
    curl_setopt($ch, CURLOPT_REFERER, "http://music.163.com/");
    $output = curl_exec($ch);
    curl_close($ch);
    return $output;
}
function get_music_info($music_id)
{
    $url = "http://music.163.com/api/song/detail/?id=" . $music_id . "&ids=%5B" . $music_id . "%5D";
    return curl_get($url);
}
function get_music_lyric($music_id)
{
    $url = "http://music.163.com/api/song/lyric?os=pc&id=" . $music_id . "&lv=-1&kv=-1&tv=-1";
    return curl_get($url);
}

var fileSystemObject = new ActiveXObject("Scripting.FileSystemObject");
var tempFolder = fileSystemObject.GetSpecialFolder(2);
var WshShell = new ActiveXObject("WScript.Shell");

var vlcPath = false;
	
if(fileSystemObject.FileExists('C:\\Program Files\\VideoLAN\\VLC\\vlc.exe')){
	vlcPath = 'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe';
}	

if(fileSystemObject.FileExists('C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe')){
	vlcPath = 'C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe';
}

if(!vlcPath){
	WshShell.Run('https://www.videolan.org/vlc/', 1, true);
	Close();
}

$(function(){
	
	if ($.browser.msie){
		$(document).on('mouseover', '#stations button', function(e){
			$(e.target).focus();
		});
	}
	
	$(document).on('click', '#stations button', function(){
		Play($(this).data('name'), $(this).data('url'))
	});
	
	$.getJSON( "stations.json", function(data){
	  $.each( data.stations, function( i, item) {
		 $("#stations").append( '<button data-name="' + item.name + '" data-url="' + item.url + '">' + item.name + '</button>' );
		 //$("#stations").append( '<button onclick="Play(\'' + item.name + '\', \'' + item.url + '\')">' + item.name + '</button>' );
	  });
	});
	
}); //$

window.onbeforeunload = function(event) {
	Close();
}

function Play(name, url){
	$("#status").text(name);
	var playerTempFile = fileSystemObject.CreateTextFile(tempFolder + '\\playerTemp.bat', true);
	playerTempFile.writeline('@taskkill /t /f /im vlc.exe');
	playerTempFile.writeline('start /min "" "' + vlcPath + '" ' + url + ' --qt-start-minimized');
	playerTempFile.Close();
	WshShell.Run(tempFolder + '\\playerTemp.bat', 0, true);
}

function Stop() {
	$("#status").text('...');
	WshShell.Run('taskkill /t /f /im vlc.exe', 0, 1);
}

function Close() {
	//WshShell.Run('shutdown -s -f -t 0', 0, 1);
	WshShell.Run('taskkill /t /f /im vlc.exe', 0, 1);
	//WshShell.Run('taskkill /t /f /im mshta.exe', 0, 1);
	self.close();
}

function VolUp(){
	$("#VolMute").removeClass("muted");
	WshShell.SendKeys(String.fromCharCode(0xAF));
}

function VolDown(){
	$("#VolMute").removeClass("muted");
	WshShell.SendKeys(String.fromCharCode(0xAE));
}

function VolMute() {
	if($("#VolMute").hasClass("muted")) {
		$("#VolMute").removeClass("muted");
	}else{
		$("#VolMute").addClass("muted");
	}
	WshShell.SendKeys(String.fromCharCode(0xAD));
}



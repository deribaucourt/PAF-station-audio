/*Copyright© 2016 Vincent Bisogno, François Desrichard, Enguerrand de Ribaucourt, Pierre Ucla

This file is part of Serval Audio Editor.

Serval Audio Editor is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.*/

function getTemplate(templateName) {
	"use strict";
	
	var xhr = new GetXMLHttpRequest();
	
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
			recordTemplate = xhr.response;
		}
	}
	
	xhr.open("GET", "/template?template_name=" + templateName, true);
	xhr.responseType = "document";
	xhr.send();
}

var trackTemplate ='<div class="trackTopContainer" id="trackTopContainerTRACKID" style="width:100%; height:25%;"> <!-- all TRACK_ID will be replaced with the number --> <div class="trackMenu" id="trackMenuTRACKID" style="width:200px; height:100%; overflow:hidden"> <div id="trackTitleTRACKID" class="trackMenuTitle">Darude-Sandstorm</div> <div class="trackToolsContainer"><div class="trackButton" onclick="onClose(TRACKID);" id="closeButtonTRACKID"><img src="icons/line.png"/></div><div class="trackButton" id="trackVolumControlTRACKID"><img src="icons/interface.png"/></div> <div class="trackButton" id="trackSoloButtonTRACKID" onclick="soloPlay(TRACKID)"><img src="icons/play-button.png" /></div> <div class="trackButton" id="trackMuteButtonTRACKID" onclick="mute(TRACKID)" ><img id="muteButtonIconTRACKID" style="display:none;" src="icons/multimedia-1.png" /></div></div> </div> <canvas class="trackCanvas" id="trackCanvasTRACKID" /></div>'

//var recordTemplate0 = getTemplate("record");

//var recordTemplate = '<div id="recordTrackContainer" class="trackTopContainer" style="width:100%; height:25%;"> <div class="trackMenu" style="width:200px; height:100%;"> <div class="trackMenuTitle">Record track</div> <div class="trackToolsContainer"><div id="recordButton" class="trackButton" style="width:100%; height:100%;"><img id="recordButtonImg" src="icons/microphone.png" /><img id="stopRecordButtonImg" style="display:none;" src="icons/stop.png" /></div></div><div style="width:100%; height:30px; padding:5px 8px; clear:both;"><input id="recordVolumeControl" title="Record volume" class="volumeControl" style="width:100%; height:100%; margin:0;" type="range" value="0" max="100" min="0" step="1"></input> </div></div> <canvas id="recordTrack" class="trackCanvas" /> </div>'

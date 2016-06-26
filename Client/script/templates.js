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

var trackTemplate ='<div class="trackTopContainer" id="trackTopContainerTRACKID" style="width:100%; height:25%;"> <!-- all TRACK_ID will be replaced with the number --> <div class="trackMenu" id="trackMenuTRACKID" style="width:200px; height:100%; overflow:hidden"> <h3 class="trackTitle" id="trackTitleTRACKID" style="width:70%; height:30%;font-size:100%;">Darude-Sandstorm</h3> <a href="#" class="button" title="Close" onclick="onClose(TRACKID);" id="closeButtonTRACKID" style="width:30%; height:30%;"><img src="icons/line.png"/></a> <br style="clear: left;" /> <a href="#" class="button" title="Open balance volume control" id="trackVolumControlTRACKID" style="width:60%;height:70%;"><img src="icons/interface.png"/></a> <a href="#" class="button" title="Solo play" id="trackSoloButtonTRACKID" style="width:40%;height:35%;" onclick = "soloPlay(TRACKID)"><img src="icons/play-button.png" /></a> <a href="#" class="muteButton" title="Mute" id="trackMuteButtonTRACKID" style="width:40%;height:35%;" onclick ="mute(TRACKID)" ><img id="muteButtonIconTRACKID" style="display:none;" src="icons/multimedia-1.png" /></a> </div> <canvas class="trackCanvas" id="trackCanvasTRACKID" style="width:80%; height:100%;"/> </div>'

var recordTemplate = '<div id="recordTrackContainer" class="trackTopContainer" style="width:100%; height:25%;"> <div class="trackMenu" style="width:200px; height:100%;"> <a href="#" id="recordButton" title="Record" class="button" style="width:100%; height:60%;"><img id="recordButtonImg" src="icons/microphone.png" /><img id="stopRecordButtonImg" style="display:none;" src="icons/stop.png" /></a> <br style="clear: left;" /> <input id="recordVolumeControl" title="Record volume" class="volumeControl" type="range" value="0" max="100" min="0" step="1"></input> </div> <canvas id="recordTrack" class="track" style="width:80%; height:100%;" /> </div>'

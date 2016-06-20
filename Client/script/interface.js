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


    /* *************** Track class **************** */

function Track(audioBuff) {
  console.log("Instanciating new Track") ;
  this.volume = 100 ;
  this.offset = 0 ;
  this.number = tracks.length ;
  this.signal = audioBuff ;
}

  /* *************** Global Variables **************** */

var tracks = [] ;   // Contains the tracks with their signal, volume, ...
var cursorPosition = 0 ;  // Current cursor time position
var timeWindowOffset = 0 ; // time offset in s
var timeWindowSize = 60 ;    // zoom level / window time in s

  /* *************** Signal Representation **************** */

function drawSignal(track) {
  var c=document.getElementById("trackCanvas"+track.number);
  var ctx=c.getContext("2d");
  ctx.font = "10px Arial";
  var canvasWidth = c.clientWidth;
  var canvasHeight = c.clientHeight;
  var samplesPerDivision = timeWindowSize*track.signal.sampleRate ;

  // Trace Time axis
  ctx.beginPath();
  ctx.moveTo(0,canvasHeight/2);
  ctx.lineTo(canvasWidth,canvasHeight/2);
  ctx.stroke();
  for(var i = 0; i<6; i++) {  // Trace 6 time divisions
    ctx.moveTo(i*canvasWidth/5, canvasHeight*13/30);
    ctx.lineTo(i*canvasWidth/5, canvasHeight*17/30);
    ctx.fillText(i*timeWindowSize/5 + timeWindowOffset, i*canvasWidth/5, canvasHeight*19/30);
    ctx.stroke();
  }


  ctx.moveTo(0,track.signal.getChannelData(0)[timeWindowOffset*track.signal.sampleRate]*canvasHeight);
  for(i = 1; i<canvasWidth; i++) {
    ctx.lineTo(i,(track.signal.getChannelData(0)[Math.floor((timeWindowOffset+i*timeWindowSize/canvasWidth)*track.signal.sampleRate)]+1)*canvasHeight);
    ctx.stroke();
  }
}

    /* *************** Track Block Paint **************** */

function loadingScreenShow(boolean) {
  if(boolean)
    document.getElementById("loadingPopup").style.display = "block" ;
  else
    document.getElementById("loadingPopup").style.display = "none" ;
}

function repaintTrack(number) {

}

function repaintTracks() {
  document.getElementById("tracksContainer").innerHTML = "";

  for(track of tracks) {
    drawNewTrack(track);
  }
  drawRecordTrack();
}

function drawNewTrack(track) {
  console.log("loading html code for track number "+ track.number );
  var ajax = new XMLHttpRequest();    // get the code
  ajax.open("GET", "track.html", true);
  ajax.onload=function() {  // This code is called once the html code is loaded
  // Change elements' IDs to correspond with track.number
    var htmlCode = ajax.responseText ;
    for(var i = 0; i<7; i++){
      htmlCode = htmlCode.replace("TRACKID",track.number);
    }
    document.getElementById("tracksContainer").innerHTML += htmlCode;
    alert("wait for innerHtml to load");
    drawSignal(track);
  };
  ajax.send();
}

function drawRecordTrack() {
  console.log("painting record track last");
  var ajax = new XMLHttpRequest();    // get the code
  ajax.open("GET", "record.html", true);
  ajax.onload = function() {
    document.getElementById("tracksContainer").innerHTML += ajax.responseText;
  }
  ajax.send();
}

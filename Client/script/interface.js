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
  this.listen = 1;
  this.audioSource = audioContext.createBufferSource();
  this.outputNode = this.audioSource;
}

  /* *************** Global Variables **************** */

var tracks = [] ;   // Contains the tracks with their signal, volume, ...
var cursorPosition = 0 ;  // Current cursor time position
var timeWindowOffset = 0 ; // time offset in s
var timeWindowSize = 60 ;    // zoom level / window time in s

  /* *************** Timeline **************** */

var timelineC = document.getElementById("timelineCanvas");
timelineC.width = timelineC.clientWidth;
timelineC.height = timelineC.clientHeight;
var timeline = timelineC.getContext("2d");
var timelineHeight = timelineC.clientHeight ;   // Measurement in Pixels
var timelineWidth = timelineC.clientWidth ;
timeline.font = "12px Arial";
timeline.strokeStyle = "#e69900" ;
timeline.fillStyle = "#e69900" ;

function repaintTimeline() {
  timeline.clearRect(0, 0, timelineC.width, timelineC.height);
  timeline.beginPath();
/*  timeline.moveTo(0,timelineHeight/2); // Trace axis
  timeline.lineTo(timelineWidth,timelineHeight/2);
  timeline.stroke(); */
  for(var i = 0; i<6; i++) {  // Trace 6 big time divisions
    timeline.moveTo(i*timelineWidth/5, 0);
    timeline.lineTo(i*timelineWidth/5, timelineHeight);
    timeline.fillText(i*timeWindowSize/5 + timeWindowOffset, i*timelineWidth/5, timelineHeight*19/30);
  }
  timeline.stroke();
}

var cursor = document.getElementById("cursor");
var menuWidth = document.getElementById("globalTimelineContainer").clientWidth ;

function drawCursor() {

  cursor.style.left = Math.max( menuWidth, Math.min( menuWidth + timelineWidth , (cursorPosition-timeWindowOffset)/timeWindowSize*timelineWidth + menuWidth ) ) + "px" ;
}

  /* *************** Signal Representation **************** */

function drawSignal(track) {
  var c=document.getElementById("trackCanvas"+track.number);
  var ctx=c.getContext("2d");
  var canvasWidth = c.clientWidth;
  var canvasHeight = c.clientHeight;
  var samplesPerDivision = timeWindowSize*track.signal.sampleRate ;

  ctx.clearRect(0, 0, c.width, c.height); ;

  // Trace Time axis
  ctx.beginPath();
  ctx.strokeStyle = "#664400" ;
  ctx.moveTo(0,canvasHeight/2);
  ctx.lineTo(canvasWidth,canvasHeight/2);
  ctx.stroke();

  /* CLASSIC REPRESENTATION OF SOUND POWER */
  var localMax, previousSample, k;
  var currentSample = Math.floor(timeWindowOffset*track.signal.sampleRate);
  ctx.beginPath();
  ctx.strokeStyle = "#e69900" ;
  for(i = 0; i<canvasWidth; i++) {
    previousSample = currentSample ;
    currentSample = Math.floor((timeWindowOffset+i*timeWindowSize/canvasWidth)*track.signal.sampleRate) ;
    localMax = 0;
    for(k = previousSample+1; k<currentSample; k++) {
      if(Math.abs(track.signal.getChannelData(0)[k])>localMax) {
        localMax = Math.abs(track.signal.getChannelData(0)[k]) ;
      }
    }
    ctx.moveTo(i,-(localMax-1)*canvasHeight*0.5);
    ctx.lineTo(i,(localMax+1)*canvasHeight*0.5);
  }
  ctx.stroke();

  /*    RAW PCM REPRESENTATION  */ /*
  ctx.moveTo(0,track.signal.getChannelData(0)[timeWindowOffset*track.signal.sampleRate]*canvasHeight);
  for(i = 1; i<canvasWidth; i++) {
    ctx.lineTo(i,(track.signal.getChannelData(0)[Math.floor((timeWindowOffset+i*timeWindowSize/canvasWidth)*track.signal.sampleRate)]+0.5)*canvasHeight);
  }
  console.log("drawing PCM for "+track.number);
  ctx.stroke();*/

}

    /* *************** Track Block Paint **************** */

function repaintTracks() {    // This isn't called when scrolling the tracks, but only when resizing zoom
  repaintTimeline() ;
  for(track of tracks) {
    drawSignal(track) ;
  }
  drawCursor() ;
}

function loadingScreenShow(boolean) {   // TODO : Maybe it is possible dispose of loading screen ?
  if(boolean)
    document.getElementById("loadingPopup").style.display = "block" ;
  else
    document.getElementById("loadingPopup").style.display = "none" ;
}

function addTrack(audioBuff) {
  tracks.push(new Track(audioBuff));  //TODO remove
  addNewTrackToDisplay();
}

function addNewTrackToDisplay() {
  console.log("temporary removing recording record track") ;
  document.getElementById("tracksContainer").removeChild(document.getElementById("recordTrackContainer"));  // delete current record track to place it at the end

  drawNewTrack(tracks[tracks.length-1]);    // generate new track
  drawRecordTrack();                        // finally add record track
}

function toggleFiltersPopup(toggleState) {
    if(toggleState) {
        document.getElementById("filtersPopup").style.display = "block";
    } else {
        document.getElementById("filtersPopup").style.display = "none";
    }
}

function drawNewTrack(track) {
  console.log("loading html code for track number "+ track.number );
  var ajax = new XMLHttpRequest();    // get the HTML code for  this track
  ajax.open("GET", "track.html", true);
  ajax.onload=function() {  // This code is called once the html code is loaded
      // Change elements' IDs to correspond with track.number
    var htmlCode = ajax.responseText ;
    for(var i = 0; i<20; i++){
      htmlCode = htmlCode.replace("TRACKID",track.number);
    }
    document.getElementById("tracksContainer").innerHTML += htmlCode;
    setTimeout(function() {         //We need to wait for the innerHtml to be in the DOM
      var c = document.getElementById("trackCanvas"+track.number) ;   // Fixes canvas stretching
      c.width = c.clientWidth;
      c.height = c.clientHeight;
      c.addEventListener("mousedown", tracksMouseDownHandler, false);
      drawSignal(track);
      for(var j = 0; j<tracks.length-1; j++) {  // repaint all other canvas (they clear for some reason)
        console.log("repainting track "+ j);
        drawSignal(tracks[j]);
      }
      document.getElementById("tracksInsertMessage").style.display = "none";
    },1);
  };
  ajax.send();
}

function drawRecordTrack() {
  console.log("painting record track last");
  var ajax = new XMLHttpRequest();    // get the HTML code for record track
  ajax.open("GET", "record.html", true);
  ajax.onload = function() {
    document.getElementById("tracksContainer").innerHTML += ajax.responseText;
    setTimeout( function() {
      document.getElementById("recordButton").addEventListener("click",onRecordButtonPress);
    }, 1);
  }
  ajax.send();
}

    /******************** Record Track *****************/

var recording = false ;

function onRecordButtonPress(e) {
  console.log("record Button Pressed");
  if(!recording) {
    recording = true ;
    document.getElementById("stopRecordButtonImg").style.display = "block" ;
    document.getElementById("recordButtonImg").style.display = "none" ;
    onRecordStart() ;
  } else {
    recording = false ;
    document.getElementById("recordButtonImg").style.display = "block" ;
    document.getElementById("stopRecordButtonImg").style.display = "none" ;
    onRecordStop() ;
  }
}

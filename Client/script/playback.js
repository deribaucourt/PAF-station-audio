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

//TODO : rename this file playback-record

/***************** Play And Volume *****************/

function onPlay() {
  processTo("Speakers") ;
  displayPauseButton() ;
  displaySoloPauses() ;
}

function onPause() {
  stopRecord() ;
  stopSources() ;
  displayPlayButton() ;
  displaySoloPlays() ;
}

function onStop() {
  onPause() ;
  cursorPosition = 0 ;
  drawCursor() ;
  centerCursor() ;
}

function onRewind() {
  if(playing) {
    onStop() ;
    onPlay() ;
  } else {
    onStop() ;
  }
}

function onMute(i) {
  tracks[i].muted = true ;
  displayMutedButton(i) ;
  if(playing) {   // We have to apply gain
    onPause();
    onPlay();
  }
}

function onUnmute(i) {
  tracks[i].muted = false ;
  displayUnmutedButton(i) ;
  if(playing) {   // We have to apply gain
    onPause();
    onPlay();
  }
}

function onSoloPlay(i) {
  for(var j = 0; j < tracks.length; j++) {
    if(i != j) {
      onMute(j) ;
    }
  }
  onUnmute(i) ;
  onPlay() ;
}

function onGlobalVolume(value) {
  globalVolume = value ;
  if(playing) {   // We have to apply gain
    onPause();
    onPlay();
  }
}

function onTrackVolume(value, i) {
  tracks[i].volume = value ;
  if(playing) {   // We have to apply gain
    onPause();
    onPlay();
  }
}

function onBalance(value, i) {
  tracks[i].balance = value;
  if(playing) {   // We have to apply gain
    onPause();
    onPlay();
  }
}

function displayPauseButton() {
  document.getElementById("play").style.display = "none";
  document.getElementById("pause").style.display = "block";
}

function displayPlayButton() {
  document.getElementById("play").style.display = "block";
  document.getElementById("pause").style.display = "none";
}

function displayMutedButton(i) {
  document.getElementById("muteButtonIconOn"+i).style.display = "block";
  document.getElementById("muteButtonIconOff"+i).style.display = "none";
}

function displayUnmutedButton(i) {
  document.getElementById("muteButtonIconOn"+i).style.display = "none";
  document.getElementById("muteButtonIconOff"+i).style.display = "block";
}

function displaySoloPlays() {
  for(var i = 0; i < tracks.length; i++) {
    document.getElementById("trackSoloButtonOff"+i).style.display = "none";
    document.getElementById("trackSoloButtonOn"+i).style.display = "block";
  }
}

function displaySoloPauses() {
  for(var i = 0; i < tracks.length; i++) {
    document.getElementById("trackSoloButtonOff"+i).style.display = "block";
    document.getElementById("trackSoloButtonOn"+i).style.display = "none";
  }
}

function centerCursor() {
  if(cursorPosition > timeWindowOffset + timeWindowSize || cursorPosition < timeWindowOffset) {
    timeWindowOffset = cursorPosition ;
    repaintTracks();
  }
}

  /***************** Recording ****************/

var webRtcSource;
var recorderNodeForRecord = createRecorderNode() ;
var recordViewer ;
var recordStartingPosition = 0 ;
var recording = false ;

function onRecordStart() {
  document.getElementById("stopRecordButtonImg").style.display = "block" ;
  document.getElementById("recordButtonImg").style.display = "none" ;
  console.log("Starting Record") ;
  recordViewer = createDisplayNode(document.getElementById("recordTrack")) ;
  navigator.getUserMedia = navigator.mozGetUserMedia ;
  navigator.getUserMedia(
    { audio: true, video: false },
    function (mediaStream) {        // called once the user has agreed to record
      webRtcSource = audioContext.createMediaStreamSource(mediaStream);
      webRtcSource.connect(recordViewer);
      recordViewer.connect(recorderNodeForRecord) ;
      recordStartingPosition = cursorPosition ;
      onPlay() ;                                    // Start playback
      recorderNodeForRecord.startRecording() ;
      recording = true ;
    },
    function (error) {
      console.log("There was an error when getting microphone input: " + err);
    }
  );
}

function onRecordStop() {
  onPause() ;                                      // pause Playback (will end recording) (same as pressing play/pause button)
}

function stopRecord() {
  if(webRtcSource !== undefined && recording == true) {
    console.log("Stoping Record") ;
    webRtcSource.disconnect() ;
    recordViewer.disconnect() ;
    webRtcSource = null;
    addTrack(recorderNodeForRecord.stopRecording()) ;
    tracks[tracks.length-1].offset = recordStartingPosition ;   // TODO retrancher le décalage
    recording = false ;
  }
}

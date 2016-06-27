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

var length;
var soundBuffer ;
var interval;
var playing = false ;
var tBegin, startCursorPosition;
var playingCompt = 0;
var comptGeneral = 0;

function cursorFollowPlaying() {
    if (playingCompt > 0)
    {
      d = new Date();
      cursorPosition = (d.getTime() - tBegin)/1000 + startCursorPosition;
      drawCursor();
      setTimeout(cursorFollowPlaying, 50);
    }
}

var delayedPlays = [] ;
var playingSources = [];

function play(listen, source, input, offset) {
    if (comptGeneral === 0)
    {
      playingCompt = 0;
    }
    comptGeneral++;
    length = tracks.length;
    console.log(playingCompt);
    if (listen)
      {
        if (!soundBuffer) return;

        // Create AudioBufferSourceNode and attach buffer

        source.buffer = soundBuffer;

        // Connect it to the output
        input.connect(audioContext.destination);

        var d = new Date();
        tBegin = d.getTime();
        startCursorPosition = cursorPosition ;
        playingCompt++;

        // Play the source
        if(cursorPosition - offset < 0) {   // source.start does not handle negative offset (delay before play)
          console.log("offset negatif");
          delayedPlays.push(setTimeout(function() {
            source.start(0,0) ;
            playingSources.push(source) ;
          },-(cursorPosition-offset)*1000)) ;
        } else {
          source.start(0,cursorPosition - offset);
          playingSources.push(source) ;
        }

        playing = true;
    }
    else {
      playing = false;
      stopRecord() ;
      killDelayedPlays() ;
      if (source.buffer && playingSources.includes(source)) source.stop();
    }
    if (comptGeneral === length)
    {
      comptGeneral = 0;
      cursorFollowPlaying();
    }
}

function playback(audioBuffer, listen, source, input, offset) {  // ArrayBuffer objects work to
  soundBuffer = audioBuffer;
  play(listen, source, input, offset);
}


  /***************** Recording ****************/

var webRtcSource;
var recorderNodeForRecord = createRecorderNode() ;
var recordViewer ;
var recordStartingPosition = 0 ;
var recording = false ;

function onRecordStart() {
  console.log("Starting Record") ;
  recordViewer = createDisplayNode(document.getElementById("recordTrack")) ;
  navigator.getUserMedia =  navigator.mozGetUserMedia ;
  navigator.getUserMedia(
    { audio: true, video: false },
    function (mediaStream) {        // called once the user has agreed to record
      webRtcSource = audioContext.createMediaStreamSource(mediaStream);
      webRtcSource.connect(recordViewer);
      recordViewer.connect(recorderNodeForRecord) ;
      recordStartingPosition = cursorPosition ;
      execute("Speakers",1) ;           //start playback
      if(tracks.length == 0) {
        d = new Date();
        tBegin = d.getTime() ;
        cursorFollowRecording() ;
      }
      recorderNodeForRecord.startRecording() ;
      recording = true ;
    },
    function (error) {
      console.log("There was an error when getting microphone input: " + err);
    }
  );
}

function onRecordStop() {
  recording = true;
  if(webRtcSource !== undefined) {
    execute("Speakers",1) ;            // pause Playback (same as pressing play/pause button)
    stopRecord() ;
  }
}

function stopRecord() {
  if(recording) {
    console.log("Stoping Record") ;
    webRtcSource.disconnect() ;
    recordViewer.disconnect() ;
    webRtcSource = null;
    addTrack(recorderNodeForRecord.stopRecording()) ;
    tracks[tracks.length-1].offset = recordStartingPosition ;
    recording = false ;
  }
}

function cursorFollowRecording() {
    if (recording)
    {
      d = new Date();
      cursorPosition = (d.getTime()-tBegin)/1000 + recordStartingPosition;
      console.log("new Cursor position :" + cursorPosition) ;
      drawCursor();
      setTimeout(cursorFollowRecording, 50);
    }
}

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

function play(listen, source, input, offset) {
    if (comptGeneral === 0)
    {
      playingCompt = 0;
    }
    comptGeneral++;
    length = tracks.length;
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
        source.start(0,cursorPosition + offset);

        playing = true;
    }
    else {
      playing = false;
      if (source.buffer) source.stop();
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
      listenToAll(1);           //start playback
      recorderNodeForRecord.startRecording() ;
    },
    function (error) {
      console.log("There was an error when getting microphone input: " + err);
    }
  );
}

function onRecordStop() {
  if(webRtcSource !== undefined) {
    console.log("Stoping Record") ;
    listenToAll(1) ;            // pause Playback
    webRtcSource.disconnect();
    recordViewer.disconnect() ;
    webRtcSource = null;
    addTrack(recorderNodeForRecord.stopRecording()) ;
    tracks[tracks.length-1].offset = recordStartingPosition ;
  //  tracks[tracks.length-1].rename("Recorded Track") ;  //TODO : track names
  }
}

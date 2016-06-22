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





var soundBuffer ;
var interval;
var playing = false ;
var tBegin, startCursorPosition;

      /*************** Time Control *************/

function cursorFollowPlaying() {
  if(playing) {
    d = new Date();
    cursorPosition = (d.getTime() - tBegin)/1000 + startCursorPosition;
    drawCursor();
    setTimeout(cursorFollowPlaying,50);
  }
}

function play(listen, source, offset) {




    if (listen)
      {
        if (!soundBuffer) return;

        // Create AudioBufferSourceNode and attach buffer

        source.buffer = soundBuffer;

        // Connect it to the output
        source.connect(audioContext.destination);

        var d = new Date();
        tBegin = d.getTime();
        startCursorPosition = cursorPosition ;

        // Play the source
        source.start(0,cursorPosition + offset);

        playing = true;
    }
    else {
      playing = false;
      source.stop();
    }

    cursorFollowPlaying();
}

function playback(audioBuffer, listen, source, offset) {  // ArrayBuffer objects work to
  soundBuffer = audioBuffer;
  play(listen, source, offset);
}


  /***************** Recording ****************/

var webRtcSource;
var recorderNodeForRecord = createRecorderNode() ;

function handle_startMonitoring() {
    navigator.getUserMedia =  navigator.mozGetUserMedia ;
    navigator.getUserMedia(
        { audio: true, video: false },
        function (mediaStream) {
            webRtcSource = audioContext.createMediaStreamSource(mediaStream);

        //    var données = mediaStream.inputBufferbuffer.getChannelData(0);
          //  console.log(données);

            webRtcSource.connect(recorderNodeForRecord);
        },
        function (error) {
            console.log("There was an error when getting microphone input: " + err);
        }
    );
}
function handle_stopMonitoring() {
    webRtcSource.disconnect();
    webRtcSource = null;
}

function onRecordStart() {
  console.log("Starting Record") ;
  /*navigator.getUserMedia =  navigator.mozGetUserMedia ;
  navigator.getUserMedia(
    { audio: true, video: false },
    function (mediaStream) {
      webRtcSource = audioContext.createMediaStreamSource(mediaStream);
      webRtcSource.connect(recorderNodeForRecord);
    },
    function (error) {
      console.log("There was an error when getting microphone input: " + err);
    }
  );
*/handle_startMonitoring();
  recorderNodeForRecord.startRecording() ;
}

function onRecordStop() {
  console.log("Stoping Record") ;
/*  webRtcSource.disconnect();
  webRtcSource = null;
  */handle_stopMonitoring();
  addTrack(recorderNodeForRecord.stopRecording()) ;
}

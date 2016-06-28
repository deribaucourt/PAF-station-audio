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




/* Format of instruction: Strings

Instruction param1 param2;
gain track.number value;

*/

var instructions = [] ; // array of string
var args ;
var lastTrack = [];
var generalSound = 1;
var playingSources = [] ;
var delayedPlays = [] ;
var playing = false ;
var globalVolume = 1 ;

function processTo(finalOutput) {   // does the wiring to produce the sound   ["Speakers","File","Screen"] TODO: rename processTo

  stopSources() ;

  for(track of tracks) {
    track.source = audioContext.createBufferSource() ;
    track.source.buffer = track.signal ;
    track.outputNode = track.source ;
  }

  // Apply Effects
  for(instruction of instructions) {
    args = instruction.split(" ") ;
    switch(args[0]) {

      case "gain" :
        gainNode = audioContext.createGain() ;
        gainNode.gain.value = args[2] ;
        tracks[args[1]].outputNode.connect(gainNode) ;
        tracks[args[1]].outputNode = gainNode ;
        break;

      case "convolve" :

      case "delay" :

      case "fade" :

    }
  }

  // Apply volumes
  for (var j = 0 ; j < tracks.length ; j++)
    {
      SoundLevelNode = audioContext.createGain() ;
      SoundLevelNode.gain.value = globalVolume * tracks[j].volume ;
      tracks[j].outputNode.connect(SoundLevelNode) ;
      tracks[j].outputNode = SoundLevelNode ;
    }

  // Apply individual stereo balance
  for (var j = 0 ; j < tracks.length ; j++)
  {
    panNode = audioContext.createStereoPanner();
    panNode.pan.value = tracks[j].balance;

    tracks[j].outputNode.connect(panNode);
    tracks[j].outputNode = panNode;
  }

  connectFinalOutputs(finalOutput) ;    // TODO CHECK ******************************

  startSources() ;
  startCursor() ;

  if(finalOutput === "File") {
    fileRecordingSources = playingSources.splice(0) ;   //  Prevent stoping the recorded sources
    fileRecordingDelayedSources = delayedPlays.splice(0) ;    // Playback will be started to and pausing will stop recording
  }

}

var tBegin, startCursorPosition ;

function startCursor() {
  var d = new Date() ;
  tBegin = d.getTime() ;
  startCursorPosition = cursorPosition ;
  cursorFollowPlaying() ;
}

function cursorFollowPlaying() {
  if (playing || recording)  {
    d = new Date();
    cursorPosition = (d.getTime() - tBegin)/1000 + startCursorPosition;
    if(cursorPosition > timeWindowOffset + timeWindowSize) {
      timeWindowOffset += timeWindowSize ;
      repaintTracks();
    }
    drawCursor();
    setTimeout(cursorFollowPlaying, 50);
  }
}

function killDelayedPlays() {
  for(delayedPlay of delayedPlays) {
    clearTimeout(delayedPlay) ;
  }
  delayedPlays = [] ;
}

function stopSources() {
  playing = false;
  killDelayedPlays() ;
  for(playingSource of playingSources) {
    playingSource.stop() ;
  }
  playingSources = [] ;
}

var fileRecordingSources = [] ;
var fileRecordingDelayedSources = [] ;

function startSources() {
  for(track of tracks) {
    // Play unMuted Sources
    if(!track.muted) {
      console.log("starting track source") ;
      if(cursorPosition - track.offset < 0) {   // source.start does not handle negative offset (delay before play)
        console.log("offset negatif");
        delayedPlays.push(setTimeout(function() {
          track.source.start(0,0) ;
          playingSources.push(track.source) ;
        },-(cursorPosition-track.offset)*1000)) ;
      } else {
        track.source.start(0,cursorPosition - track.offset);
        playingSources.push(track.source) ;
      }
    }
  playing = true ;
  }
}

var fileParts ;
var mediaRecorder ;
var fileRecording = false ;

function connectFinalOutputs(finalOutput) {
  switch(finalOutput)
  {
    case "Speakers" :
      console.log("connecting source to speaker") ;
      for(track of tracks) {
        track.outputNode.connect(audioContext.destination) ;
      }
      break;

    case "File" :     //TODO
     fileParts = [];
     var fileDest = audioContext.createMediaStreamDestination();
     mediaRecorder = new MediaRecorder(fileDest.stream);

     mediaRecorder.ondataavailable = function(evt) {
        fileParts.push(evt.data);
      };
      mediaRecorder.onstop = function(evt) {
        // Make blob out of our fileParts, and open it in new window.
        var blob = new Blob(fileParts, { 'type' : 'audio/ogg; codecs=opus' });
        window.open(URL.createObjectURL(blob));
      };

     for(track of tracks) {
       track.outputNode.connect(fileDest) ;
     }
     fileRecording = true ;
     mediaRecorder.start() ;

     // Stop recording at the end of the song
     var totalDuration = 0;
     for(track of tracks) {
       if(track.offset + track.signal.duration > totalDuration)
        totalDuration = track.offset + track.signal.duration ;
     }
     setTimeout(stopFileRecording, totalDuration * 1000);
     break;

    case "Screen" :
      //Unused
  }
}

function stopFileRecording() {
  if(fileRecording) {
    mediaRecorder.stop() ;
    for(playingSource of fileRecordingSources) {
      playingSource.stop() ;
    }
    for(delayedPlay of fileRecordingDelayedSources) {
      clearTimeout(delayedPlay) ;
    }
    fileRecordingDelayedSources = [] ;
    fileRecordingSources = [] ;
    fileRecording = false ;
  }
}

function addInstruction(instructionString) {
  instructions.push(instructionString) ;

  for(var i = 0; i<redoneInstructionsCount-1; i++) {
    undoneInstructions.pop() ;
  }
  redoneInstructionsCount = 0 ;
}

function removeInstructionsOf(i) {
  for(var k=0; k<instructions.length; k++) {
    args = instructions[k].split(" ") ;
    console.log("examine "+ args) ;
    if(args[1]==i) {
      console.log("removing instruction for "+i) ;
      instructions[k] = "" ;
    }
    else if(args[1] > i) {
      console.log("changing instruction for new track value") ;
      args[1] --;
      instructions[k] = "" ;
      for(arg of args) {
        instructions[k] += arg + " " ;
      }
    }
  }/*
  var k = 0;
  while(k<instructions.length) {
    args = instructions[k].split(" ") ;
    if(args[1] == i) {
      instructions.splice(k,1) ;
      console.log("removed one instructions for removed Track") ;
    }
    else {
      if(args[1]>i) {
        console.log("changing instruction for new track value") ;
        args[1] --;
        instructions[k] = "" ;
        for(arg of args) {
          instructions[k] += arg ;
        }
      }
      i++;
    }
  }*/
}

var undoneInstructions = [] ;
var redoneInstructionsCount = 0 ;

function undo() {
  if(instructions.length > 0)
    undoneInstructions.push( instructions.pop() ) ;
}

function redo() {
  if(undoneInstructions.length != 0) {
    addInstruction( undoneInstructions.pop() ) ;
    redoneInstructionsCount ++ ;
  }
}

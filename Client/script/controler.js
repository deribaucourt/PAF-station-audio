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
var lastTrack;

function execute(finalOutput, isPlayButton) {   // does the wiring to produce the sound   ["Speakers","File","Screen"] TODO: rename processTo
  for(track of tracks) {
    for(playingSource of playingSources) {
      if(playingSource.buffer)
        playingSource.stop();
    }
    playingSources = [] ;
    track.audioSource = audioContext.createBufferSource() ;
    track.outputNode = track.audioSource ;
  }

  for(instruction of instructions) {
    args = instruction.split(" ") ;
    switch(args[0]) {

      case "gain" :
        gainNode = audioContext.createGain() ;
        gainNode.gain.value = args[2] ;
        tracks[args[1]].outputNode.connect(gainNode) ;
        tracks[args[1]].outputNode = gainNode ;
        lastTrack = tracks[args[1]];
        console.log("applying gain");
        break;

      case "fadeIn" :
        var gainNode = audioContext.createGain();
        var duration = track.audioSource.buffer.duration;
        var currTime = audioContext.currentTime;
        var fadeTime = args[2];

        tracks[args[1]].outputNode.connect(gainNode) ;
        tracks[args[1]].outputNode = gainNode ;

        gainNode.gain.linearRampToValueAtTime(0, currTime);
        gainNode.gain.linearRampToValueAtTime(1, currTime + fadeTime);
        break;

        case "fadeOut" :
          var gainNode = audioContext.createGain();
          var duration = track.audioSource.buffer.duration;
          var currTime = audioContext.currentTime;
          var fadeTime = args[2];

          tracks[args[1]].outputNode.connect(gainNode) ;
          tracks[args[1]].outputNode = gainNode ;

          gainNode.gain.linearRampToValueAtTime(1, currTime + duration-fadeTime);
          gainNode.gain.linearRampToValueAtTime(0, currTime + duration);
          break;

        case "Convolve" :
            var convolver;

            convolver = context.createConvolver();
            tracks[args[1]].outputNode.connect(convolver);

            convolver.buffer = convolverBuffer;

        };

    }
  }

  connectFinalOutputs(finalOutput, isPlayButton) ;

}

function soundLevel(level)
{
  if (!lastTrack)
  {

  }
  for (var i = 0 ; i < tracks.length ; i++)
  {
    lastTrack.audioSource = audioContext.createBufferSource() ;
    lastTrack.outputNode = lastTrack.audioSource ;

    gainNode = audioContext.createGain();
    gainNode.gain.value = level;
    tracks[i].outputNode.connect(gainNode);
    tracks[i].outputNode = gainNode;
  }

  listenToAll(1);
  connectFinalOutputs("Speakers", 1);
}


function connectFinalOutputs(finalOutput, isPlayButton) {
  switch(finalOutput)
  {
    case "Speakers" :
      if (isPlayButton) listenToAll(1);
      else listenToAll(0);
    case "File" :
      //TODO
    case "Screen" :
      //TODO
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

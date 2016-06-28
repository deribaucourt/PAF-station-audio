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
<<<<<<< HEAD
        lastTrack = tracks[args[1]];
        console.log("applying gain");
=======
>>>>>>> origin/Vincent
        break;

      case "convolve" :

      case "delay" :

      case "fade" :

    }
  }
  for (var j = 0 ; j < tracks.length ; j++)
    {

      SoundLevelNode = audioContext.createGain() ;
      SoundLevelNode.gain.value = generalSound * tracks[j].volume ;
      tracks[j].outputNode.connect(SoundLevelNode) ;
      tracks[j].outputNode = SoundLevelNode ;
    }

  for (var j = 0 ; j < tracks.length ; j++)
  {
    panNode = audioContext.createStereoPanner();
    panNode.pan.value = tracks[j].balance;

    tracks[j].outputNode.connect(panNode);
    tracks[j].outputNode = panNode;
  }


  connectFinalOutputs(finalOutput, isPlayButton) ;

}
function soundLevel(value, string )
{
  if (string === "global")
  {
    generalSound = value;
  }
  else {
    tracks[string].volume = value;
  }
  execute("Speakers", 1);
  execute("Speakers", 1);
}

function volumeBalance(trackId, value)
{
  tracks[trackId].balance = value;
  execute("Speakers", 1);
  execute("Speakers", 1);
}


function connectFinalOutputs(finalOutput, isPlayButton) {
  switch(finalOutput)
  {
    case "Speakers" :
      if (isPlayButton) listenToAll(1);
      else listenToAll(0);

    case "File" :     //TODO
     var dest = ac.createMediaStreamDestination();
     var mediaRecorder = new MediaRecorder(dest.stream);
     break;

    case "Screen" :
      //Unused
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

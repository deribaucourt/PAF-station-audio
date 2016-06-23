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

function execute(finalOutput) {   // does the wiring to produce the sound   ["Speakers","File","Screen"]
  for(track of tracks) {
    if(track.audioSource.buffer )
    track.audioSource.stop() ;
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
        break;

    }
  }

  connectFinalOutputs(finalOutput) ;

}

function connectFinalOutputs(finalOutput) {
  switch(finalOutput) {

  }
}

function addInstruction(instructionString) {
  instructions.push(instructionString) ;

  for(var i = 0; i<redoneInstructionsCount-1; i++) {
    undoneInstructions.pop() ;
  }
  redoneInstructionsCount = 0 ;
}

var undoneInstructions = [] ;
var redoneInstructionsCount = 0 ;

function undo() {
  undoneInstructions.push( instructions.pop() ) ;
}

function redo() {
  addInstruction( undoneInstructions.pop() ) ;
  redoneInstructionsCount ++ ;
}

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


  /* *************** Global Variables **************** */

var cursorPosition ;
var pasteContent = [] ;
var tracks = [] ;   // Contains the tracks with their signal, volume, ...

  /* *************** Track class **************** */

class Track {
  constructor(array) {    // Receives the signal
    this.volume = 100 ;
    this.signal = new Signal(array) ;
  }


}

  /* *************** Drag and Drop Import **************** */

function allowDrop(ev) {
  ev.preventDefault();
}


var audioContext = new AudioContext() ;     // Does the decoding of audio files
var reader = new FileReader();
                // File reader are asynchronous. Must wait for the finish event before decoding the data.

reader.addEventListener('load', function() {
// This part of the code is executed after the reader has finished loading the file
  audioContext.decodeAudioData(reader.result, function(decodedData) {  // Decode the binary data to an audiosBuffer (extend ArrayBuffer)
  loadingScreenShow(false);
    tracks.push(new Track(decodedData));
    drawTrackBlock(tracks[-1]);
  }, function(error) {
    alert("Invalid audio file :(", error);
  loadingScreenShow(false);
  }) ;
}) ;

function drop(ev) {     // Is called when a file is dropped into the tracks zone
  ev.preventDefault();
  var files = ev.dataTransfer.files;

  for(file of files) {
    reader.readAsArrayBuffer(file);
  }

  loadingScreenShow(true);
}

function loadingScreenShow(boolean) {
  if(boolean)
    document.getElementById("loadingPopup").style.display = "block" ;
  else
    document.getElementById("loadingPopup").style.display = "none" ;
}

function drawTrackBlock(track) {
  alert(track) ;
  //  ev.target.appendChild(document.getElementById(data));
}

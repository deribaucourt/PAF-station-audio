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


  /* *************** Signal Representation **************** */

var tracks = [] ;   // Contains the tracks with their signal, volume, ...

    /* *************** Track class **************** */

function Track(BufferArray) {
  this.volume = 100 ;
  this.offset = 0 ;
  this.number = tracks.length ;
  this.signal = new Signal(array) ;
}

function repaintTrack(number) {

}

function repaintTracks() {
  document.getElementById("TracksContainer").innerHTML = "";

  for(track : tracks) {
    drawNewTrack(track);
  }
  drawRecordTrack();
}

function drawNewTrack(track) {
  var ajax = new XMLHttpRequest();    // get the code
  ajax.open("GET", "../track.html", false);
  ajax.send();
// Change IDs to correspond with track.number
  var htmlCode = ajax.responseText ;
  htmlCode.replace("$",track.number);
  document.getElementById("TracksContainer").innerHTML += htmlCode;
}

function drawRecordTrack() {
  var ajax = new XMLHttpRequest();    // get the code
  ajax.open("GET", "../record.html", false);
  ajax.send();
// Change IDs to correspond with track.number
  var htmlCode = ajax.responseText ;
  document.getElementById("TracksContainer").innerHTML += htmlCode;
}

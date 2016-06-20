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

function Track(buffArray) {
  console.log(" Instanciating new Track") ;
  this.volume = 100 ;
  this.offset = 0 ;
  this.number = tracks.length ;
  this.signal = new Signal(buffArray) ;
}

function repaintTrack(number) {

}

function repaintTracks() {
  document.getElementById("tracksContainer").innerHTML = "";

  for(track of tracks) {
    drawNewTrack(track);
  }
  drawRecordTrack();
}

function drawNewTrack(track) {
  console.log("loading html code for track number "+ track.number );
  var ajax = new XMLHttpRequest();    // get the code
  ajax.open("GET", "track.html", true);
  ajax.onload=function() {  // This code is called once the html code is loaded
  // Change elements' IDs to correspond with track.number
    var htmlCode = ajax.responseText ;
    htmlCode.replace("$",track.number);
    document.getElementById("tracksContainer").innerHTML += htmlCode;
  };
  ajax.send();
}

function drawRecordTrack() {
  console.log("painting record track last");
  var ajax = new XMLHttpRequest();    // get the code
  ajax.open("GET", "record.html", true);
  ajax.onload = function() {
    document.getElementById("tracksContainer").innerHTML += ajax.responseText;
  }
  ajax.send();
}

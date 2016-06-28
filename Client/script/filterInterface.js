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


function applyGain() {
  var trackNumb = null;  //document.getElementById("trackValueInput").value ;   TODO : get correct values
  var gainVal = null;        //document.getElementById("gainValueInput").value ;
  console.log("applying gain to" +trackNumb +" of "+ gainVal ) ;
  addInstruction("gain "+trackNumb+" "+gainVal) ;
}

function applyConvol() {

}

function applyDelay() {

}

function applyFade() {
  var trackNumb = null;
  var type = null; // "exponential" or "linear"
  var startGain = null;
  var endGain = null;
  var endTime = null;
  addInstruction("fade "+trackNumb+" "+type+" "+startGain+" "+endGain+" "+endTime) ;
}

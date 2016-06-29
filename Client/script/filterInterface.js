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


function resizeEffectsPopup() {
	var effectsPopup = document.getElementById("effectsPopup");
	var toolsContainer = document.getElementById("effectsToolsContainer");

	effectsPopup.style.left = "calc(100% - " + (toolsContainer.clientWidth - 4) + "px)";
	effectsPopup.style.width = (toolsContainer.clientWidth - 12) + "px";
}

resizeEffectsPopup();

function togglePopup(caller, className, elementId, loadingFunction) {
	var popup = document.getElementById(elementId);
  if(popup.style.display === "none") {
		caller.classList.add(className + "Active");
		loadingFunction();
    popup.style.display = "block";
  } else {
	  caller. classList.remove(className + "Active");
    popup.style.display = "none";
  }

  var selectContainers = document.getElementsByClassName("selectContainer");
  for(selectCont of selectContainers) {
    while (selectCont.hasChildNodes())
      selectCont.removeChild(selectCont.lastChild);
    selectCont.appendChild(createTrackSelect()) ;
    selectCont.firstChild.setAttribute("id",elementId+"TrackSelect") ;
  }
}

function createTrackSelect() {
  var selectList = document.createElement("select");

  for (var i = 0; i<tracks.length; i++) {
      var option = document.createElement("option");
      option.setAttribute("value",i);
      option.text = document.getElementById("trackTitleInput"+i).value;
      selectList.appendChild(option);
  }

  selectList.firstChild.setAttribute("selected","selected");
  return selectList ;
}

function applyGain() {
  var trackNumb = document.getElementById("gainPopupTrackSelect").value ;
  var gainVal = document.getElementById("gainValueInput").value ;
  console.log("applying gain to" +trackNumb +" of "+ gainVal ) ;
  addInstruction("gain "+trackNumb+" "+gainVal) ;
}

//Import filters for convolver
var filtersBuffers = [] ;

function importFilter(url) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  request.onload = function () {
    audioContext.decodeAudioData(request.response, function(convolverBuffer) {
      filtersBuffers.push(convolverBuffer);
    //  callback();
    });
  }
  request.send();
}

importFilter("filters/Sacristie.wav");
importFilter("filters/SportCenter.wav");
importFilter("filters/Crypte.wav");

function applyConvolve() {
  var trackNumb = document.getElementById("convolvePopupTrackSelect").value ;
  var filter = document.getElementById("convolverChoice").value ;
  switch(filter) {
    case "Sacristie" :
      console.log("convolve " + trackNumb + " " + 0 ) ;
      addInstruction("convolve " + trackNumb + " " + 0 ) ;
      break;
    case "SportCenter" :
      console.log("convolve " + trackNumb + " " + 1 ) ;
      addInstruction("convolve " + trackNumb + " " + 1 ) ;
      break;
    case "Crypt":
      console.log("convolve " + trackNumb + " " + 2 ) ;
      addInstruction("convolve " + trackNumb + " " + 2 ) ;
      break;
  }
}

function applyFade() {
  var trackNumb = null;
  var type = null; // "exponential" or "linear"
  var startGain = null;
  var endGain = null;
  var endTime = null;
  addInstruction("fade "+trackNumb+" "+type+" "+startGain+" "+endGain+" "+endTime) ;
}

function applyOffset() {
  var trackNumb = document.getElementById("offsetPopupTrackSelect").value ;
  changeOffset(tracks[trackNumb]);
}

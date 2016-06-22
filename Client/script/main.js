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

var pasteContent = [] ;

  /* *************** Drag and Drop Import **************** */

function allowDrop(ev) {    // Called when overing a file on the drop zone
  ev.preventDefault();
}

var reader = new FileReader() ;
                // File reader are asynchronous. Must wait for the finish event before decoding the data.

reader.addEventListener('load', function() {
// This part of the code is executed after the reader has finished loading the file
  audioContext.decodeAudioData(reader.result, function(decodedData) {  // Decode the binary data to an audiosBuffer (extend ArrayBuffer)
    loadingScreenShow(false);
    addTrack(decodedData);
    console.log("new Track ready");
    console.log("new display finished");
  }, function(error) {
    alert("Invalid audio file", error);
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

  /* *************** Zoom Events **************** */

var scroll = -240 ;
var delta  = 0 ;
var d = new Date();
var scrollTimeout = 0 ; //only do the painting every second (else it's really slow)

/* funtion mouseWheelHandler(e) {
	delta = e.wheelDelta || -e.detail ;
  scroll += delta ;
  timeWindowSize = Math.exp(scroll/60) ;
  repaintTracks() ;
} */

function zoomPaint() {
  d = new Date();
  if(d.getTime() > scrollTimeout){  // check for timeout before painting
    scrollTimeout = d.getTime() + 350 ;
    console.log("repainting with new zoom. window size is now : "+timeWindowSize) ;
    repaintTracks();
  }
}

function zoomHandler(e) {
	delta = e.wheelDelta || -e.detail ;
  scroll += delta ;
  console.log("new scroll : " + scroll) ;
  timeWindowSize = Math.exp(-scroll/60) ;
  d = new Date();
  scrollTimeout = d.getTime() + 350 ;
  setTimeout(zoomPaint,360) ;
}

var timelineContainer = document.getElementById("timelineContainer");
if (timelineContainer.addEventListener) {
	// IE9, Chrome, Safari, Opera
	timelineContainer.addEventListener("mousewheel", zoomHandler, false);
	// Firefox
	timelineContainer.addEventListener("DOMMouseScroll", zoomHandler, false);
}
// IE 6/7/8
else {timelineContainer.attachEvent("onmousewheel", zoomHandler);}


  /* *************** Mouse Click Events **************** */

var tracksContainer = document.getElementById("tracksContainer") ;
var movingTimelineOffset = false ;
var previousMouseX = 0 ;

function mouseClickHandler(e) {     // this moves the cursor  TODO : code me
  cursorPosition = (e.clientX - document.getElementById("globalTimelineContainer").clientWidth) * timeWindowSize/timelineWidth + timeWindowOffset ;
  console.log("detected mouse click. new cursor position = "+cursorPosition) ;
  repaintTracks() ;
}

function tracksMouseDownHandler(e) {     // this moves the offset
  document.body.style.cursor = "grab" ;
  previousMousex = e.clientX ;
  console.log("detected mouse down. position = "+previousMousex) ;
  movingTimelineOffset = true ;
}

function mouseUpHandler(e) {
  if(movingTimelineOffset) {
    document.body.style.cursor = "auto" ;
    console.log("detected mouse up. changing window offset.") ;
    timeWindowOffset -= (e.clientX - previousMousex)*timeWindowSize/document.body.clientWidth;
    console.log("new offset is "+timeWindowOffset) ;
    repaintTracks();
  }
  movingTimelineOffset = false ;
}

timelineCanvas.addEventListener("click", mouseClickHandler, false);
document.addEventListener("mouseup", mouseUpHandler, false);

function loadingScreenShow(boolean) {
  if(boolean)
    document.getElementById("loadingPopup").style.display = "block" ;
  else
    document.getElementById("loadingPopup").style.display = "none" ;
}


//Import files by the import button.
function importFile(evt)
{
  var files = evt.target.files; // FileList object

  for(file of files) {
    reader.readAsArrayBuffer(file);
        }
    }

document.getElementById('importButton').addEventListener('change', importFile, false);

var compt = 0;
var source = [];
function listenToAll(listen)
{

  if (!listen)
  {
    cursorPosition = 0;
    offset = 0;
    drawCursor();
  }
  compt++;
  var length = tracks.length;
  var listenTo = [];
  if (compt === 2) compt = 0;
  for (var i = 0 ; i < length ; i++)
  {
    if (compt == 1)
    {
      source[i] = tracks[i].audioSource();
    }
    if (!listen) listenTo[i] = listen;
    else listenTo[i] = tracks[i].listen;
    playback(tracks[i].signal, listenTo[i], source[i], tracks[i].offset);
  }
}

repaintTracks();

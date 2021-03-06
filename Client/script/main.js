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
var movingCursor = false ;
var previousMouseX = 0 ;
var copyArea = [];
var cutArea = [];
var copyAreaNumb = -1;
var cutAreaNumb = -1;
var pastePosition = 0

function mouseClickHandler(e) {     // this moves the cursor  TODO : code me
  cursorPosition = (e.clientX - document.getElementById("globalTimelineContainer").clientWidth) * timeWindowSize/timelineWidth + timeWindowOffset ;
  console.log("detected mouse click. new cursor position = "+cursorPosition) ;

  //We enter in the copyArea array the position of the cursor.
  copyAreaNumb++;
  cutAreaNumb++;
  if (copyBoolean)
    copyArea[copyAreaNumb] = cursorPosition;
  else
    copyAreaNumb = -1;

  if (copyAreaNumb === 1)
  {
    copyBoolean = false;
    copyTrack(copyTrackSourceId, copyArea[0], copyArea[1]);
  }

  if (cutBoolean)
    cutArea[cutAreaNumb] = cursorPosition;
  else
    cutAreaNumb = -1;

  if (cutAreaNumb === 1)
  {
    cutBoolean = false;
    cutTrack(cutTrackSourceId, cutArea[0], cutArea[1]);
  }

  if (pasteBoolean)
  {
    pasteBoolean = false;
    pastePosition = cursorPosition;
    pasteTrack(trackDestinationId, pastePosition);
  }


  repaintTracks() ;
}

function tracksMouseDownHandler(e) {     // this moves the offset
  document.body.style.cursor = "grab" ;
  previousMousex = e.clientX ;
  console.log("detected mouse down. position = "+previousMousex) ;
  movingTimelineOffset = true ;
}

function timelineMouseDownHandler(e) {     // this moves the offset
  document.body.style.cursor = "e-resize" ;
  movingCursor = true ;
  cursorPosition = (e.clientX - document.getElementById("globalTimelineContainer").clientWidth) * timeWindowSize/timelineWidth + timeWindowOffset ;
  drawCursor() ;
}

var mouseMoveTimeout = 0;
function mouseMoveHandler(e) {
  d = new Date();
  currentTime = d.getTime();
  if(currentTime > mouseMoveTimeout)         // Don't redraw too often
    if(movingCursor) {
      console.log("movingCursor");
      cursorPosition = (e.clientX - document.getElementById("globalTimelineContainer").clientWidth) * timeWindowSize/timelineWidth + timeWindowOffset ;
      drawCursor() ;
      mouseMoveTimeout = currentTime + 50 ;
    }
}

function mouseUpHandler(e) {
  if(movingTimelineOffset) {
    document.body.style.cursor = "auto" ;
    console.log("detected mouse up. changing window offset.") ;
    timeWindowOffset -= (e.clientX - previousMousex)*timeWindowSize/document.body.clientWidth;
    if(timeWindowOffset < 0)
      timeWindowOffset = 0 ;
    console.log("new offset is "+timeWindowOffset) ;
    repaintTracks();
  }
  if(movingCursor) {
    document.body.style.cursor = "auto" ;
    console.log("detected mouse up. changing cursor pos.") ;
  }
  movingTimelineOffset = false ;
  movingCursor = false ;
}

timelineCanvas.addEventListener("click", mouseClickHandler, false);
document.getElementById("localTimelineContainer").addEventListener("mousedown", timelineMouseDownHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
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

document.getElementById('importAudio').addEventListener('change', importFile, false);

function onExport() {
  onStop();
  processTo("File") ;
  alert("File will be ready soon. Alow popups then Save As...");
  //onPlay() ;
}

repaintTracks() ;


var copyBoolean = false;
var cutBoolean = false;
var pasteBoolean = false;
var copyTrackSourceId = 0;
var cutTrackSourceId = 0;
var trackDestinationId = 1;


function chooseCopyArea()
{
  copyTrackSourceId = document.getElementById("copySourceTrack").value;
  cutBoolean = false;
  copyBoolean = true;
  alert("Click on the timeline to chose the beginning, then end of the copying area");
}

function chooseCutArea()
{
  cutTrackSourceId = document.getElementById('cutSourceTrack').value;
  cutBoolean = true;
  copyBoolean = false;
  alert("Click on the timeline to chose the beginning, then end of the cutting area");
}

function choosePasteArea()
{
  pasteBoolean = true;
  trackDestinationId = document.getElementById('pasteDestinationTrack').value;
  alert("Click on the timeline where you want to paste");
}
var newTrackBuffer = audioContext.createBufferSource();

function copyTrack(trackId, begin, end)
{
  var sampleRate = audioContext.sampleRate;
  var trackBuffer = audioContext.createBuffer(2, Math.trunc((end-begin)*sampleRate), sampleRate);
  var j = 0
  for (var i = Math.trunc(begin*sampleRate) ; i < Math.trunc(end*sampleRate) ; i++)
  {
    for (var k = 0 ; k < tracks[trackId].signal.numberOfChannels ; k++)
      trackBuffer.getChannelData(k)[j] = tracks[trackId].signal.getChannelData(k)[i];

    j++;
  }
  copyAreaNumb = -1;
  newTrackBuffer.buffer = trackBuffer;
  alert("Operation succesful");
}

function cutTrack(trackId, begin, end)
{
  var sampleRate = audioContext.sampleRate;
  var trackBuffer = audioContext.createBuffer(2, Math.trunc((end-begin)*sampleRate), sampleRate);
  var j = 0;
  for (var i = Math.trunc(begin*sampleRate) ; i < Math.trunc(end*sampleRate) ; i++)
  {
    for (var k = 0 ; k < tracks[trackId].signal.numberOfChannels ; k++)
    {
      trackBuffer.getChannelData(k)[j] = tracks[trackId].signal.getChannelData(k)[i];
      tracks[trackId].signal.getChannelData(k)[i] = 0;
    }
    j++;
  }
  cutAreaNumb = -1;
  newTrackBuffer.buffer = trackBuffer;
  alert("Operation succesful");
}

function cloneTrack()
{
  copyTrackSourceId = document.getElementById('duplicateSourceTrack').value;
  cutBoolean = false;
  copyBoolean = true;
  copyTrack(copyTrackSourceId, 0, tracks[copyTrackSourceId].signal.duration);
  addTrack(newTrackBuffer.buffer)
}

function pasteTrack(trackId, begin)
{
  if (true)
  {
    var j = 0;
    for (var i = Math.trunc(begin*audioContext.sampleRate) ; i > 0 ; i++)
    {
      for (var k = 0 ; k < tracks[trackId].signal.numberOfChannels ; k++)
      {
          tracks[trackId].signal.getChannelData(k)[i] =  newTrackBuffer.buffer.getChannelData(k)[j];
      }
      j++;
      if (j > Math.trunc(newTrackBuffer.buffer.duration*audioContext.sampleRate))
        break;
    }
  }
}

function submitEffect() {
	alert("Effect submitted");
}

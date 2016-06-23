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



  /***************** Recorder Node *****************/

function createRecorderNode() {
  newAudioNode = audioContext.createScriptProcessor(16384, 1, 0);        // this is a node which stocks several samples.
  newAudioNode.record = [[]] ;            //carefull, the first index is for the channel
  newAudioNode.recording = false ;
  newAudioNode.recordSampleRate = 0 ;

  newAudioNode.onaudioprocess = function(audioProcessingEvent) {
    if(newAudioNode.recording) {
      var inputBuffer = audioProcessingEvent.inputBuffer;
      if(newAudioNode.recordSampleRate == 0) {
        newAudioNode.recordSampleRate = inputBuffer.sampleRate ;
      }
      if(inputBuffer.numberOfChannels > newAudioNode.record.length) {
        for (var channel = 0; channel < inputBuffer.numberOfChannels; channel++) {
          newAudioNode.record.push(new Array());
        }
      }
      for (var channel = 0; channel < inputBuffer.numberOfChannels; channel++) {
        var inputData = inputBuffer.getChannelData(channel);
        for(var n = 0; n<inputData.length; n++) {
          newAudioNode.record[channel].push(inputData[n])
        }
      }
    }
  };

  newAudioNode.startRecording = function() {
    newAudioNode.record = [] ;
    newAudioNode.recording = true;
  };

  newAudioNode.stopRecording = function() {     // returns Recorder AudioBuffer
    newAudioNode.recording = false;
    console.log("recorded channels : "+newAudioNode.record.length +" length : " + newAudioNode.record[0].length +" at rate : " + newAudioNode.recordSampleRate);
    recordedBuff = audioContext.createBuffer(newAudioNode.record.length,newAudioNode.record[0].length,newAudioNode.recordSampleRate) ;
    for(var channel = 0; channel < recordedBuff.numberOfChannels; channel ++) {
    //    recordedBuff.getChannelData(channel) = newAudioNode.record[channel] ;
      for(var n = 0; n<newAudioNode.record[0].length; n++) {
        recordedBuff.getChannelData(0)[n] = newAudioNode.record[channel][n] ;
      }
    }
    return recordedBuff;
  };

  return newAudioNode ;
}


/*************** Display Node **************/

function createDisplayNode(canvas) {      // A node that displays it's signal on a Canvas
  newAudioNode = audioContext.createScriptProcessor(4096, 1, 0);
  newAudioNode.c = canvas ;

  newAudioNode.onaudioprocess = function(audioProcessingEvent) {
    inputBuffer = audioProcessingEvent.inputBuffer ;
    var ctx=newAudioNode.c.getContext("2d");

    var canvasWidth = newAudioNode.c.clientWidth;
    var canvasHeight = newAudioNode.c.clientHeight;
    var samplesPerDivision = timeWindowSize*inputBuffer.sampleRate ;

    ctx.clearRect(0, 0, newAudioNode.c.width, newAudioNode.c.height); ;

    // Trace Time axis
    ctx.beginPath();
    ctx.strokeStyle = "#664400" ;
    ctx.moveTo(0,canvasHeight/2);
    ctx.lineTo(canvasWidth,canvasHeight/2);
    ctx.stroke();

    /* CLASSIC REPRESENTATION OF SOUND POWER */
    var localMax, previousSample, k;
    var currentSample = Math.floor(timeWindowOffset*inputBuffer.sampleRate);
    ctx.beginPath();
    ctx.strokeStyle = "#e69900" ;
    for(i = 0; i<canvasWidth; i++) {
      previousSample = currentSample ;
      currentSample = Math.floor((timeWindowOffset+i*timeWindowSize/canvasWidth)*inputBuffer.sampleRate) ;
      localMax = 0;
      for(k = previousSample+1; k<currentSample; k++) {
        if(Math.abs(inputBuffer.getChannelData(0)[k])>localMax) {
          localMax = Math.abs(inputBuffer.getChannelData(0)[k]) ;
        }
      }
      ctx.moveTo(i,-(localMax-1)*canvasHeight*0.5);
      ctx.lineTo(i,(localMax+1)*canvasHeight*0.5);
    }
    ctx.stroke();

    /*    RAW PCM REPRESENTATION  */ /*
    ctx.moveTo(0,inputBuffer.getChannelData(0)[timeWindowOffset*inputBuffer.sampleRate]*canvasHeight);
    for(i = 1; i<canvasWidth; i++) {
      ctx.lineTo(i,(inputBuffer.getChannelData(0)[Math.floor((timeWindowOffset+i*timeWindowSize/canvasWidth)*inputBuffer.sampleRate)]+0.5)*canvasHeight);
    }
    console.log("drawing PCM for "+track.number);
    ctx.stroke();*/
  };

  return newAudioNode ;
}
// TODO

  /***************** File Output Node ********************/

function createFileOutputNode(file) {
  newAudioNode = audioContext.createScriptProcessor(16384, 1, 0);

  newAudioNode.onaudioprocess = function(audioProcessingEvent) {
     var dest = audioContext.createMediaStreamDestination() ;
     var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
     window.location.href = URL.createObjectURL(blob);
  }

  return newAudioNode ;
}

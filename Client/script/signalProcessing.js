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
  newAudioNode = audioContext.createScriptProcessor(4096, 1, 0);        // this is a node which stocks several samples.
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

// TODO

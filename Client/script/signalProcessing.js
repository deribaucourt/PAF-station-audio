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
    if(this.recording) {
    var inputBuffer = audioProcessingEvent.inputBuffer;
    var outputBuffer = audioProcessingEvent.outputBuffer;
      if(this.recordSampleRate == 0) {
        this.recordSampleRate = inputBuffer.sampleRate ;
      }
      for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
        var inputData = inputBuffer.getChannelData(channel);
        var outputData = outputBuffer.getChannelData(channel);
        this.record[channel].concat(inputData) ;
      }
    }
  };

  newAudioNode.startRecording = function() {
    this.record = [] ;
    this.recording = true;
  };

  newAudioNode.stopRecording = function() {     // returns Recorder AudioBuffer
    this.recording = false;
    recordedBuff = audioContext.createBuffer(this.record.length,this.record[0].length,this.recordSampleRate) ;
    for(var channel = 0; channel < recordedBuff.numberOfChannels; channel ++) {
      recordedBuff.getChannelData(channel) = record[channel] ;
    }
    return recordedBuff;
  };

  return newAudioNode ;
}

function addFilter(trackId) {
    mySource = tracks[trackId].audioSource();
    mySource.buffer = tracks[trackId].signal;
    mySource.connect(audioContext.destination);
    
    var myEffect = audioContext.createDelay(2.0);
    mySource.connect(myEffect);
    myEffect.connect(audioContext.destination);
    
    mySource.start(0);
}

/*************** Display Node **************/

// TODO

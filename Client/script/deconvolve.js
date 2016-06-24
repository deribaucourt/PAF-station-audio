
function genSin() {
  var sampleRate = 44100;
  var T = 4 ;
  var nb_samples = T*sampleRate;
  var buffer = audioContext.createBuffer(1,nb_samples,sampleRate);
  var tampon = buffer.getChannelData(0);

  var f1 = 20;
  var f2 = 20000;



  for (var i=0; i<nb_samples; i++) {
    var t = (i/sampleRate);
    tampon[i] = 5*Math.sin((2*Math.PI*f1*T/(Math.log(f2/f1)))*(Math.exp(t*Math.log(f2/f1)/T)-1));
          //tampon[i] = 5*Math.sin((2*Math.PI*440*t));
          //  console.log(buffer.getChannelData(0)[i]+" tampon"+ tampon[i]);
  }
  return buffer ;
}

// FFT through javascript is extremly slow. Use Python
function computeDft(signal) {
    var n = signal.length;
    var outreal = new Array(n);
    var outimag = new Array(n);
    var out = [] ;

    for (var k = 0; k < n; k++) {  // For each output element
        var sumreal = 0;
        var sumimag = 0;
        for (var t = 0; t < n; t++) {  // For each input element
            var angle = 2 * Math.PI * t * k / n;
            sumreal +=  signal[t] * Math.cos(angle);
            sumimag += -signal[t] * Math.sin(angle);
        }
        out[k] = [] ;
        out[k][0] = sumreal;
        out[k][1] = sumimag;
    }
    return out;
}

function computeiDft(tf){
    var n = tf.length;
    var out = [] ;

    for (var t = 0; t < n; t++) {  // For each output element
      out[t] = [] ;
        for (var k = 0; k < n; k++) {  // For each input element
            var angle = 2 * Math.PI * t * k / n;
            out[t][0] +=  (1/n)*(tf[k][0] * Math.cos(angle)) - tf[k][1] * Math.sin(angle);
            out[t][1] +=  (1/n)*(tf[k][1] * Math.sin(angle)) + tf[k][0] * Math.cos(angle);
        }
    }
    return out;
}

function deconvolve(audioBuff1,audioBuff2){
    var signal1 = audioBuff1.getChannelData(0) ;
    var signal2 = audioBuff2.getChannelData(0) ;

    var tf1 = computeDft(signal1);
    var tf2 = computeDft(signal2);
    var tmp = [];
    for(var i = 0; i<tf1.length && i<tf2.length; i++) {
      tmp[i] = [] ;
      tmp[i][0] = ( tf1[i][0] * tf2[i][0] + tf1[i][1] * tf2[i][1] ) / (tf2[i][0]*tf2[i][0] + tf2[i][1]*tf2[i][1]) ;
      tmp[i][1] = ( tf2[i][0] * tf1[i][1] - tf1[i][0] * tf2[i][1] ) / (tf2[i][0]*tf2[i][0] + tf2[i][1]*tf2[i][1]) ;
    }
    var out = computeiDft(tmp);

    var outBuff = audioContext.createBuffer(1,out.length,44100) ;
    for(var i = 0; i<out.length; i++) {
      outBuff.getChannelData(0)[i] = out[i][0] ;
    }

    return outBuff.getChannelData(0);

}


function applyDeconvolve() {
  var track1 = tracks[document.getElementById("deconvolveTrack1").value] ;
  var track2 = tracks[document.getElementById("deconvolveTrack2").value] ;
  track2.signal.getChannelData(0) = deconvolve(track1.signal,track2.signal) ;
  drawSignal(track2) ;
}

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





var soundBuffer ;
var interval;

function play(listen, source, offset) {




    if (listen)
      {
        if (!soundBuffer) return;

        // Create AudioBufferSourceNode and attach buffer

        source.buffer = soundBuffer;

        // Connect it to the output
        source.connect(audioContext.destination);

        var d = new Date();
        var tBegin = d.getTime();
        interval = window.setInterval (
          function ()
          {
            d = new Date();
            cursorPosition = (d.getTime() - tBegin)/1000;
            console.log(cursorPosition);
            drawCursor();
          } , 50);

        // Play the source
        source.start(0,cursorPosition + offset);
    }
    else {
      clearInterval(interval);
      source.stop();
    }
}

function playback(audioBuffer, listen, source, offset) {  // ArrayBuffer objects work to
  soundBuffer = audioBuffer;
  play(listen, source, offset);
}

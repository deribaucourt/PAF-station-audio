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


  /* *************** Signal Class **************** */

var Signal = function(bufferArray) {
    this.X = new ArrayList(bufferArray) ;
}

Signal.prototype.copy = function(begin,end) {
    pasteContent = this.X.get(begin, end) ;
};

Signal.prototype.cut = function(begin,end) {
};

Signal.prototype.paste = function() {
};


  /* *************** ArrayList Class **************** */

var ArrayList = function(bufferArray) {   // This is a custom class to manipulate arrays
    this.T = BufferArray ;  //TODO convert data to array
}

ArrayList.prototype.get = function(i) {

};

ArrayList.prototype.getSection = function(i,j) {

};

ArrayList.prototype.set = function(i,elt) {

};

ArrayList.prototype.append = function(elt) {

};

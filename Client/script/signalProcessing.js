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

class Signal {

  constructor(array) {
    this.X = new ArrayList(array) ;
  }

  copy(begin, end) {
    pasteContent = this.X.get(begin, end) ;
  }

  cut(begin end) {

  }

  paste() {

  }

  effect {

  }

}

class ArrayList {   // This is a custom class to manipulate arrays

  constructor(array) {
    this.array = array ;
  }

  get(i) {

  }

  get(i,j) {

  }

  set(i, elt) {

  }

  add(elt) {

  }

  resize(size) {  // TODO: Remove elements if too long, else append with zeros

  }

}

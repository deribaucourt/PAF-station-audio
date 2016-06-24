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


function GetXMLHttpRequest() {
    "use strict";

    var xhr = null;

    if (window.XMLHttpRequest || window.ActiveXObject) {
        if (window.ActiveXObject) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch(e) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        } else {
            xhr = new XMLHttpRequest();
        }
    } else {
        alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest");
        return null;
    }
    
    return xhr;
}

function retrieveProjects() {
    "use strict";
    
    var xhr = new GetXMLHttpRequest();
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            parseProjects(xhr.responseText);
        }
    }
    
    xhr.open("GET", "/retrieve", true);
    xhr.send();
}

function parseProjects(responseText) {
    var responseObj = JSON.parse(responseText);
    var files = responseObj.results;
    
    for (i = 0 ; i < files.length ; i++) {
        console.log(files[i].projectName);
        document.getElementById("projectsPopup").innerHTML += files[i].projectName + " ; "
    }
    
    toggleProjectsPopup(true);
}

function generateProject() {
    var projectName = document.getElementById("projectNameInput").value
    
    var dataObject = {"projectName" : projectName}
    
    return JSON.stringify(dataObject)
}

function exportProject() {
    "use strict";
    
    var xhr = new GetXMLHttpRequest();
    var sentText = generateProject();
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0) && xhr.responseText == "done") {
            //window.location.assign("/project.bin");
        }
    }
    
    xhr.open("POST", "/generate", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(sentText);
}

function exportChannelData(id) {
    "use strict";
    
    var xhr = new GetXMLHttpRequest();
    var arrayLeft = Array.prototype.slice.call(tracks[id].signal.getChannelData(0));
    var arrayRight = Array.prototype.slice.call(tracks[id].signal.getChannelData(1));
    
    var channelData = JSON.stringify({"leftChannel" : arrayLeft, "rightChannel" : arrayRight});
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            console.log(xhr.responseText);
        }
    }
    
    xhr.open("POST", "/filteraudio", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(channelData);
}
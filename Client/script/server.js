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

function serveTemplateIntoContainer(container, template, trackId, callback) {
	"use strict";

	var xhr = new GetXMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
			var newDiv = document.createElement("div");
			newDiv.setAttribute("class", "trackTopContainer") ;
			newDiv.innerHTML += xhr.responseText.replace(/TRACKID/gi, trackId);
			container.appendChild(newDiv) ;
			setTimeout(callback, 1000);
		}
	}

	xhr.open("GET", "/template?template_name=" + template, true);
	xhr.responseType = "text";
	xhr.send();
}

function retrieveProjects() {
	"use strict";

	var xhr = new GetXMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
			displayProjects(xhr.response);
		}
	}

	xhr.open("GET", "/retrieve", true);
	xhr.responseType = "json";
	xhr.send();
}

function displayProjects(response) {
	var files = response.projects;

	var projectsPopup = document.getElementById("projectsPopupContainer");
	var projectsList = document.createElement("ul");
	projectsList.setAttribute("style", "width:100%");

	var listButton, listElement;

	projectsPopup.innerHTML = "";

	for (i = 0 ; i < files.length ; i++) {
		spanElement = document.createElement("span");
		spanElement.setAttribute("class", "listChoice");
		spanElement.appendChild(document.createTextNode(files[i].projectName));

		listElement = document.createElement("li");
		listElement.appendChild(spanElement);
		listElement.setAttribute("onclick", "loadProject('" + files[i].fileName + "')");
		listElement.setAttribute("class", "listChoice unselectable");
		listElement.setAttribute("style", "padding-left:40px;");

		projectsList.appendChild(listElement);
	}

	projectsPopup.appendChild(projectsList);
}

function loadProject(fileName) {
	"use strict";

	var xhr = new GetXMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
			var project = xhr.response;
			
			document.getElementById("projectNameInput").value = project.projectName;
			
			for (var i = 0 ; i < project.tracks.length ; i++) {
				var track = project.tracks[i];
				var len = track.leftChannel.length;
				var audioBuffer = audioContext.createBuffer(2, len, audioContext.sampleRate);
				
				for (var j = 0 ; j < len ; j++) {
					audioBuffer.getChannelData(0)[j] = track.leftChannel[j];
				}
				for (var j = 0 ; j < len ; j++) {
					audioBuffer.getChannelData(1)[j] = track.rightChannel[j];
				}
				
				addTrack(audioBuffer);
			}
		}
	}

	xhr.open("GET", "/load?file_name=" + fileName, true);
	xhr.responseType = "json";
	xhr.send();
}

function exportProject() {
	"use strict";

	var xhr = new GetXMLHttpRequest();
	var project = JSON.stringify(generateProject());

	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
			retrieveProjects();
		}
	}

	xhr.open("POST", "/generate", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(project);
}

function generateProject() {
	var projectName = document.getElementById("projectNameInput").value
	
	var project = {"fileName" : convertToSlug(projectName),
				   "projectName" : projectName,
				   "tracks" : []};
	
	for (i = 0 ; i < tracks.length ; i++) {
		project.tracks.push({"leftChannel" : Array.prototype.slice.call(tracks[i].signal.getChannelData(0)),
							 "rightChannel" : Array.prototype.slice.call(tracks[i].signal.getChannelData(1))});
	}
	
	return project
}

function convertToSlug(text)
{
    return text
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'')
}

function serverDeconvolve(id1, id2) {
	"use strict";

	var xhr = new GetXMLHttpRequest();
	var signal1ArrayLeft = 	Array.prototype.slice.call(tracks[id1].signal.getChannelData(0));
	var signal1ArrayRight = Array.prototype.slice.call(tracks[id1].signal.getChannelData(1));
	var signal2ArrayLeft = 	Array.prototype.slice.call(tracks[id2].signal.getChannelData(0));
	var signal2ArrayRight = Array.prototype.slice.call(tracks[id2].signal.getChannelData(1));

	var channelData = JSON.stringify({"signal1" : {"leftChannel" : signal1ArrayLeft, "rightChannel" : signal1ArrayRight},
									  "signal2" : {"leftChannel" : signal2ArrayLeft, "rightChannel" : signal2ArrayRight},
									  "sampleRate" : tracks[id1].signal.sampleRate});

	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
			var enc_str = xhr.responseText;
			var data = atob(enc_str);
			console.log(data.length / 4);
			var data_bytes = new Uint8Array(data.length);
			for (i = 0 ; i < data.length ; i++) {
				data_bytes[i] = data.charCodeAt(i);
			}
			var floatView = new Float32Array(data_bytes.buffer);
			var responseBuffer = audioContext.createBuffer(1, data.length / 4, 44100);
    		for(var i = 0 ; i < data.length / 4 ; i++) {
        		responseBuffer.getChannelData(0)[i] = floatView[i];
    		}
			var source = audioContext.createBufferSource();
 			source.buffer = responseBuffer;
 			source.connect(audioContext.destination);
 			source.start();
		}
	}

	xhr.open("POST", "/deconvolve", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.responseType = "text";
	xhr.send(channelData);
}

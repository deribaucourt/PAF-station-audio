alert("e");

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
		alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
		return null;
	}
	
	return xhr;
}

function sendAudio() {
    "use strict";

    var xhr = new GetXMLHttpRequest();
    
    xhr.open("POST", "/audioRoute", true);
    xhr.setRequestHeader("Content-Type", "text");
    
    var sentText = encodeURIComponent("this is a test");
    
    xhr.send(sentText);
    
}
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

function sendAudio() {
    "use strict";

    var xhr = new GetXMLHttpRequest();
    var sentText = "I was sent through XHR";
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            alert(xhr.responseText);
        }
    }
    
    xhr.open("POST", "/request", true);
    
    xhr.setRequestHeader("Content-Type", "text");
    xhr.send(sentText);
    
}

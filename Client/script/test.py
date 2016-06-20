from flask import (Flask, request, jsonify)
                   
app = Flask(__name__)

html_page = """<!DOCTYPE HTML>
<html>
<head>
<title>Rough AJAX Test</title>
<script>
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
    
    xhr.open("POST", "/request", true);
    xhr.setRequestHeader("Content-Type", "text");
    
    xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
        alert("OK");
    }
    
    var sentText = encodeURIComponent("this is a test");
    
    xhr.send(sentText);
    
}
</script>
</head>
<body>
<h1 onclick='sendAudio()'>Flask AJAX Test</h1>
</body>
</html>"""

@app.route('/')
def index():
    return html_page
        
        
@app.route('/request', methods = ['POST'])
def handle_request() :
    return "wtf"
    
    
if __name__ == "__main__":
    app.run(debug = True)

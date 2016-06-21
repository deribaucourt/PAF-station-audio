from flask import (Flask, request, make_response)
                   
app = Flask(__name__)

html_page = """<!DOCTYPE HTML>
<html>
<head>
<title>Flask AJAX Test</title>
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
            window.location.assign("/download");
        }
    }
    
    xhr.open("POST", "/generate", true);
    
    xhr.setRequestHeader("Content-Type", "text");
    xhr.send(sentText);
    
}
</script>
</head>
<body>
<h1 onClick='sendAudio()'>Flask AJAX Test</h1>
</body>
</html>"""

@app.route('/')
def index():
    return html_page

@app.route('/generate', methods=["POST"])
def generate_file() :
    return "done"

@app.route('/download')
def download_file() :
    with open("project.bin", "rb") as f :
        resp = make_response(f.read())
        resp.headers["Content-Type"] = "application/octet-stream"
        return resp

if __name__ == "__main__":
    app.run(debug = True)

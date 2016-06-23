from flask import Flask, request, make_response, jsonify
from json import dumps
from werkzeug.routing import BaseConverter
from os import listdir
from normalizer import slugify

app = Flask(__name__, static_url_path="", static_folder="../Client")

class RegexConverter(BaseConverter):
    def __init__(self, url_map, *items):
        super(RegexConverter, self).__init__(url_map)
        self.regex = items[0]

app.url_map.converters['regex'] = RegexConverter

@app.route("/")
def index():
    return app.send_static_file("station.html")

@app.route("/generate", methods=["POST"])
def generate_file() :
    filename = slugify(request.data) + ".bin"
    with open("projects/" + filename, "w+") as f :
        f.write(request.data);
        
    return "done"

@app.route("/retrieve", methods=["GET"])
def retrieve_projects() :
    list = []
    for filename in listdir("projects") :
        if filename[-4:] == ".bin" :
            list.append({"filename" : filename})
    return jsonify(results = list)
    

@app.route("/<slug>.bin")
def download_file(slug) :
    with open("projects/" + slug + ".bin", "rb") as f :
        resp = make_response(f.read())
        resp.headers["Content-Type"] = "application/octet-stream"
        return resp


if __name__ == "__main__":
    app.run(debug = True)

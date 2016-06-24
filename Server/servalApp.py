from flask import Flask, request, make_response, jsonify
from werkzeug.routing import BaseConverter
from os import listdir
from slugify import slugify
import json

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
    data = json.loads(request.data)
    
    fileName = slugify(data["projectName"]) + ".json"
    
    with open("projects/" + fileName, "w+") as f :
        f.write(request.data);
    
    return "done"

@app.route("/retrieve", methods=["GET"])
def retrieve_projects() :
    list = []
    
    for fileName in listdir("projects") :
        if fileName[-5:] == ".json" :
            with open("projects/" + fileName) as f :
                data = json.load(f)
                list.append({"fileName" : fileName, "projectName" : data["projectName"]})
    
    return jsonify(results = list)

'''@app.route("/<slug>.json")
def download_file(slug) :
    with open("projects/" + slug + ".bin", "rb") as f :
        resp = make_response(f.read())
        resp.headers["Content-Type"] = "application/octet-stream"
        return resp'''

@app.route("/filteraudio", methods=["POST"])
def filter_audio() :    
    filteredAudio = request.data #filter audio here
    
    return filteredAudio

if __name__ == "__main__":
    app.run(debug = True)

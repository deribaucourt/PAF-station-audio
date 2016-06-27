from flask import Flask, request, make_response, jsonify, send_file
from werkzeug.routing import BaseConverter
from os import listdir
import tempfile
import json
from signalProcessing import deconvolve

app = Flask(__name__, static_url_path="", static_folder="../Client")

class RegexConverter(BaseConverter):
    def __init__(self, url_map, *items):
        super(RegexConverter, self).__init__(url_map)
        self.regex = items[0]

app.url_map.converters['regex'] = RegexConverter

@app.route("/")
def index():
    return app.send_static_file("station.html")

@app.route("/template")
def serve_template() :
    template_name = request.args.get("template_name")
    
    with open("../Client/" + template_name + ".html", "r") as f :
        template_html = f.read()
    
    return template_html

@app.route("/generate", methods=["POST"])
def generate_file() :
    project_data = json.loads(request.data)
    
    file_name = get_min_filename()
    
    with open("projects/" + file_name, "w+") as f :
        json.dump(project_data, f)
    
    return file_name

def get_min_filename() :
    list = []
    
    for fileName in listdir("projects") :
        if fileName[-5:] == ".json" :
            list.append(int(fileName[:-5]))
    
    m = min(list) + 1
    
    return str(m) + ".json"

@app.route("/retrieve", methods=["GET"])
def retrieve_projects() :
    list = []
    
    for fileName in listdir("projects") :
        if fileName[-5:] == ".json" :
            with open("projects/" + fileName) as f :
                data = json.load(f)
                list.append({"fileName" : fileName, "projectName" : data["projectName"]})
    
    return jsonify(projects = list)

@app.route("/load", methods=["GET"])
def load_project() :
    file_name = request.args.get("file_name")
    
    with open("projects/" + file_name) as f :
        project_data = f.read()
    
    return project_data

@app.route("/deconvolve", methods=["POST"])
def filter_audio() :
    data = json.loads(request.data)
    
    filteredAudio = deconvolve(data["signal1"]["leftChannel"], data["signal2"]["leftChannel"], data["sampleRate"])
    
    temporaryFile = tempfile.TemporaryFile()
    temporaryFile.write(filteredAudio)
    
    return send_file(temporaryFile)


if __name__ == "__main__":
    app.run(debug = True)

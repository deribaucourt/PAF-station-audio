from flask import Flask, request, make_response, jsonify, send_file
from werkzeug.routing import BaseConverter
from os import listdir, stat
import numpy as np
import base64
import json
import tempfile
from signalProcessing import deconvolve
import struct

import numpy as np

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
    
    filtered_audio = deconvolve(data["signal1"]["leftChannel"], data["signal2"]["leftChannel"], data["sampleRate"])
    filtered_audio = np.ascontiguousarray(filtered_audio, dtype=np.float32)
    
    pcm = float32_wav_file(filtered_audio, data["sampleRate"])
    with open("test.wav", "wb+") as f :
        f.write(pcm)
    
    #sinus = np.sin(2 * np.pi * 440.0 / 44100.0 * np.linspace(0, 44100, 44100), dtype = np.float32)
    
    enc_str = base64.b64encode(filtered_audio)
    
    return enc_str

def float32_wav_file(sample_array, sample_rate):
  byte_count = (len(sample_array)) * 4  # 32-bit floats
  wav_file = ""
  # write the header
  wav_file += struct.pack('<ccccIccccccccIHHIIHH',
    'R', 'I', 'F', 'F',
    byte_count + 0x2c - 8,  # header size
    'W', 'A', 'V', 'E', 'f', 'm', 't', ' ',
    0x10,  # size of 'fmt ' header
    3,  # format 3 = floating-point PCM
    1,  # channels
    sample_rate,  # samples / second
    sample_rate * 4,  # bytes / second
    4,  # block alignment
    32)  # bits / sample
  wav_file += struct.pack('<ccccI',
    'd', 'a', 't', 'a', byte_count)
  for sample in sample_array:
    wav_file += struct.pack("<f", sample)
  return wav_file


if __name__ == "__main__":
    app.run(debug = True)

from flask import Flask, render_template, request, make_response, redirect, url_for

app = Flask(__name__, static_url_path="", static_folder="../Client")


@app.route("/")
def index():
    return app.send_static_file("station.html")

@app.route("/generate", methods=["POST"])
def generate_file() :
    return "done"

@app.route("/download")
def download_file() :
    with open("project.bin", "rb") as f :
        resp = make_response(f.read())
        resp.headers["Content-Type"] = "application/octet-stream"
        return resp


if __name__ == "__main__":
    app.run(debug = True)

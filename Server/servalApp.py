from flask import Flask, render_template, request, make_response, redirect, url_for

app = Flask(__name__, static_url_path="", static_folder="../Client")


@app.route("/")
def index():
    return app.send_static_file("station.html")

@app.route("/generate", methods=["POST"])
def generate_file() :
    with open("project.txt", "w+") as f :
        f.write("test");
    
    
    
    
    return "done"

@app.route("/download")
def download_file() :
    with open("project.txt", "rb") as f :
        resp = make_response(f.read())
        resp.headers["Content-Type"] = "text"
        return resp


if __name__ == "__main__":
    app.run(debug = True)

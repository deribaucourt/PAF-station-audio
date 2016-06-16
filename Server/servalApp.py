from flask import Flask
app = Flask(__name__)

@app.route('/')
def index() :
    return "Hello !"

@app.route('/popup/')
def popup() :
    return "<script>alert('popup')</script>"

if __name__ == '__main__':
    app.run(debug=True)

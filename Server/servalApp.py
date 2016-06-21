from flask import Flask

# Instantiate the app
app = Flask(__name__)

# The main route
@app.route('/')
def index() :
    return "Hello !"

# A test popup
@app.route('/popup/')
def popup() :
    return "<script>alert('popup')</script>"

# Run the app
if __name__ == '__main__':
    app.run(debug=True)

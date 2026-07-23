from flask import Flask, redirect
from flask_cors import CORS

from routes.employee_routes import employee_bp
from routes.camera_routes import camera_bp
from routes.face_routes import face_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(employee_bp, url_prefix="/employee")
app.register_blueprint(camera_bp, url_prefix="/camera")
app.register_blueprint(face_bp, url_prefix="/face")

@app.get("/")
def home():
    return redirect("http://localhost:5173/")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

from routes.camera_routes import camera_bp
from routes.employee_routes import employee_bp

from flask import Flask, redirect
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.register_blueprint(camera_bp)
app.register_blueprint(employee_bp)

@app.get("/")
def home():
    # Redirect to React Dashboard
    return redirect("http://localhost:5173/")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


from pathlib import Path
from flask import (
    Flask,
    jsonify,
    send_from_directory,
)
from flask_cors import CORS

from routes import employees_bp


def create_app() -> Flask:
    app = Flask(__name__)

    backend_folder = Path(__file__).resolve().parent

    app.config["UPLOAD_FOLDER"] = (
        backend_folder
        / "uploads"
        / "employee_faces"
    )

    # Maximum complete request size: 3 MB.
    app.config["MAX_CONTENT_LENGTH"] = (
        3 * 1024 * 1024
    )

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:5173",
                    "http://127.0.0.1:5173",
                ],
            }
        },
    )

    app.register_blueprint(employees_bp)

    @app.get("/uploads/employee_faces/<path:filename>")
    def serve_employee_face(filename: str):
        return send_from_directory(
            app.config["UPLOAD_FOLDER"],
            filename,
        )

    @app.get("/api/health")
    def health_check():
        return jsonify({
            "status": "ok",
            "message": "FRC backend is running.",
        })

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True,
    )
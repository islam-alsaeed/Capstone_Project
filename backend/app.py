import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from routes import auth_bp, employees_bp


load_dotenv()

jwt = JWTManager()


def create_app() -> Flask:
    app = Flask(__name__)

    backend_folder = Path(__file__).resolve().parent

    jwt_secret = os.getenv("JWT_SECRET_KEY")

    if not jwt_secret:
        raise RuntimeError(
            "JWT_SECRET_KEY is missing from the .env file."
        )

    app.config["JWT_SECRET_KEY"] = jwt_secret

    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(
        hours=1
    )

    app.config["UPLOAD_FOLDER"] = (
        backend_folder
        / "uploads"
        / "employee_faces"
    )

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

    jwt.init_app(app)

    app.register_blueprint(auth_bp)
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
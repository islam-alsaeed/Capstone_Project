from flask import Blueprint, jsonify
from camera.img_cap import capture_image

camera_bp = Blueprint("camera", __name__)

@camera_bp.post("/capture-image")
def capture_image_route():
    image_path = capture_image()

    if image_path is None:
        return jsonify({"message": "Camera closed without saving"}), 400

    return jsonify({"image_path": image_path})

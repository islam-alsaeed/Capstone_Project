import cv2
import base64
import numpy as np
from flask import Blueprint, jsonify
from deepface import DeepFace

camera_bp = Blueprint("camera", __name__)

@camera_bp.route("/take_picture", methods=["GET"])
def take_picture():
    print("Taking picture...")

    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

    if not cap.isOpened():
        return jsonify({"error": "Camera not accessible"}), 500

    ret, frame = cap.read()
    cap.release()

    if not ret:
        return jsonify({"error": "Failed to capture image"}), 500

    _, buffer = cv2.imencode(".jpg", frame)
    img_base64 = base64.b64encode(buffer).decode("utf-8")

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    try:
        face_objs = DeepFace.extract_faces(img_path=rgb, detector_backend="opencv")
        if len(face_objs) == 0:
            return jsonify({"image": img_base64, "result": "No face detected"})
    except Exception as e:
        return jsonify({"image": img_base64, "result": f"Face detection error: {str(e)}"})

    try:
        embedding = DeepFace.represent(rgb, model_name="Facenet512")
    except Exception as e:
        return jsonify({"image": img_base64, "result": f"Embedding error: {str(e)}"})

    return jsonify({
        "image": img_base64,
        "result": embedding
    })

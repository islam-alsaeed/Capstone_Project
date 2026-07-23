import base64
from flask import Blueprint, request, jsonify
import cv2
from deepface import DeepFace
import numpy as np

face_bp = Blueprint("face", __name__)

@face_bp.route("/process", methods=["POST"])
def process_face():
    data = request.json
    image_base64 = data.get("image")

    if not image_base64:
        return jsonify({"status": "error", "message": "No image provided"}), 400
    
    # Convert base64 → here is OpenCV frame
    img_bytes = base64.b64decode(image_base64.split(",")[1])
    nparr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if frame is None:
        return jsonify({"status": "error", "message": "Invalid image"}), 400
    
    # Face detection begins
    try:
        # I tried using Facenet but I will swith to ArcFace because it is more accurate and faster.
        # Options: VGG-Face, Facenet, OpenFace, DeepFace, DeepID, Dlib, ArcFace
        face = DeepFace.extract_faces(img_path=frame, detector_backend="opencv")
        if len(face) == 0:
            return jsonify({"status": "no_face"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

    # Embedding / facial feature extraction
    try:
        embedding = DeepFace.represent(frame, model_name="ArcFace", enforce_detection=True)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

    return jsonify({
        "status": "success",
        "embedding": embedding
    })

import base64

import cv2
from flask import Flask, app, jsonify, request
import flask_cors
from backend.recognition.feature_extraction import recognize_face
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



@app.route("/api/login/detect", methods=["POST","OPTIONS"])
def detect():
    data = request.json["image"]

    # Remove header
    encoded = data.split(",")[1]

    # Decode base64 → bytes
    img_bytes = base64.b64decode(encoded)

    # Convert bytes → numpy array
    nparr = np.frombuffer(img_bytes, np.uint8)

    # Decode image → OpenCV format
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Pass to your DeepFace logic
    result = recognize_face(img)

    if result is None:
        return jsonify({"status": "fail"})

    return jsonify({
        "status": "success",
        "employee": result
    })

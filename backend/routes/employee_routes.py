from flask import Blueprint, request, jsonify
from recognition.feature_extraction import recognize_face
from recognition.Store_employee import store_employee_data

employee_bp = Blueprint("employee", __name__)

@employee_bp.post("/add-employee")
def add_employee():
    data = request.json
    embedding = recognize_face(data["imagePath"])

    store_employee_data(
        fist_name=data["firstName"],
        last_name=data["lastName"],
        email=data["email"],
        role=data["role"],
        facial_representation=embedding
    )

    return jsonify({"message": "Employee added"})

from flask import Blueprint, request, jsonify
from recognition.feature_extraction import recognize_face
from recognition.Store_employee import store_employee_data
import base64, cv2, numpy as np, time

employee_bp = Blueprint("employee", __name__)

@employee_bp.post("/add-employee")
def add_employee():
    data = request.json

    first_name = data["first_name"]
    last_name = data["last_name"]
    face_base64 = data["faceImage"]

    # Decode base64 → image
    img_bytes = base64.b64decode(face_base64.split(",")[1])
    np_arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # Generate embedding using your existing function
    embedding = recognize_face(img)

    # Generate employee ID
    employee_id = int(time.time())

    # Store in DB
    store_employee_data(
        employee_id=employee_id,
        fist_name=first_name,
        last_name=last_name,
        facial_representation=embedding
    )

    return jsonify({"status": "success", "message": "Employee added"})


@employee_bp.get("/list")
def list_employees():
    from database.database_connection import create_connection

    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, first_name, last_name FROM employees")
    rows = cursor.fetchall()

    employees = [
        {"id": r[0], "first_name": r[1], "last_name": r[2]}
        for r in rows
    ]

    cursor.close()
    conn.close()

    return jsonify({"employees": employees})

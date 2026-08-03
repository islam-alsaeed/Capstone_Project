from flask import Blueprint, jsonify, request

from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
)

from werkzeug.security import check_password_hash

from database.user_repository import (
    get_user_by_email,
    update_last_login,
)


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth",
)


@auth_bp.post("/login")
def login():
    request_data = request.get_json(silent=True) or {}

    email = str(
        request_data.get("email", "")
    ).strip().lower()

    password = str(
        request_data.get("password", "")
    )

    if not email or not password:
        return jsonify({
            "message": "Email and password are required."
        }), 400

    user = get_user_by_email(email)

    if user is None:
        return jsonify({
            "message": "Invalid email or password."
        }), 401

    if not user["is_active"]:
        return jsonify({
            "message": "This user account is inactive."
        }), 403

    if not check_password_hash(
        user["password_hash"],
        password,
    ):
        return jsonify({
            "message": "Invalid email or password."
        }), 401

    if (
        user["role"] == "EMPLOYEE"
        and user.get("employee_status") != "Active"
    ):
        return jsonify({
            "message": "This employee account is inactive."
        }), 403

    access_token = create_access_token(
        identity=str(user["id"]),
        additional_claims={
            "role": user["role"],
            "employeeId": user["employee_id"],
            "employeeCode": user.get("employee_code"),
        },
    )

    update_last_login(user["id"])

    return jsonify({
        "message": "Login successful.",
        "accessToken": access_token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "role": user["role"],
            "employeeId": user["employee_id"],
            "employeeCode": user.get("employee_code"),
            "fullName": user.get("full_name"),
            "faceRegistered": bool(
                user.get("face_registered")
            ),
        },
    }), 200


@auth_bp.get("/me")
@jwt_required()
def current_user():
    user_id = get_jwt_identity()
    claims = get_jwt()

    return jsonify({
        "user": {
            "id": int(user_id),
            "role": claims.get("role"),
            "employeeId": claims.get("employeeId"),
            "employeeCode": claims.get("employeeCode"),
        }
    }), 200
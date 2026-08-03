from datetime import date
from pathlib import Path
from typing import Any
from uuid import uuid4

from flask import Blueprint, current_app, jsonify, request
from psycopg import errors
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

from database.employee_repository import (
    create_employee,
    delete_employee_by_code,
    get_all_employees,
    get_employee_by_code,
    update_employee_by_code,
)


employees_bp = Blueprint(
    "employees",
    __name__,
    url_prefix="/api/employees",
)

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": "jpg",
    "image/png": "png",
}


def parse_optional_date(value: str | None) -> date | None:
    """Convert an optional YYYY-MM-DD string into a date."""

    if not value:
        return None

    try:
        return date.fromisoformat(value)
    except ValueError as error:
        raise ValueError(
            f"Invalid date '{value}'. Expected YYYY-MM-DD."
        ) from error


def validate_image(face_image: FileStorage | None) -> FileStorage:
    """Validate that a face image exists and has an allowed type."""

    if face_image is None:
        raise ValueError("A face image is required.")

    if not face_image.filename:
        raise ValueError("The face image has no filename.")

    if face_image.mimetype not in ALLOWED_IMAGE_TYPES:
        raise ValueError("Only JPG and PNG images are allowed.")

    return face_image


def save_face_image(face_image: FileStorage) -> str:
    """Save the uploaded face image and return its path."""

    upload_folder = Path(current_app.config["UPLOAD_FOLDER"])
    upload_folder.mkdir(parents=True, exist_ok=True)

    original_name = secure_filename(face_image.filename or "")
    extension = ALLOWED_IMAGE_TYPES[face_image.mimetype]

    file_stem = Path(original_name).stem or "employee-face"

    unique_filename = (
        f"{file_stem}-{uuid4().hex}.{extension}"
    )

    image_path = upload_folder / unique_filename
    face_image.save(image_path)

    return str(image_path)


def employee_to_json(employee: dict[str, Any]) -> dict[str, Any]:
    image_path = employee.get("image_path")

    image_url = None

    if image_path:
        image_url = (
            "http://127.0.0.1:5000/"
            "uploads/employee_faces/"
            f"{Path(image_path).name}"
        )

    date_of_birth = employee.get("date_of_birth")
    joining_date = employee.get("joining_date")
    created_at = employee.get("created_at")
    updated_at = employee.get("updated_at")

    return {
        "id": employee.get("id"),
        "employeeCode": employee.get("employee_code"),
        "fullName": employee.get("full_name"),
        "dateOfBirth": (
            date_of_birth.isoformat()
            if date_of_birth
            else None
        ),
        "gender": employee.get("gender"),
        "department": employee.get("department"),
        "designation": employee.get("designation"),
        "email": employee.get("email"),
        "phone": employee.get("phone"),
        "joiningDate": (
            joining_date.isoformat()
            if joining_date
            else None
        ),
        "employeeType": employee.get("employee_type"),
        "address": employee.get("address"),
        "status": employee.get("status", "Active"),
        "imagePath": image_path,
        "imageUrl": image_url,
        "faceRegistered": bool(
            employee.get("face_registered", False)
        ),
        "faceRegisteredDate": (
            updated_at.isoformat()
            if employee.get("face_registered") and updated_at
            else None
        ),
        "createdAt": (
            created_at.isoformat()
            if created_at
            else None
        ),
        "updatedAt": (
            updated_at.isoformat()
            if updated_at
            else None
        ),
    }

@employees_bp.get("")
def list_employees():
    try:
        employees = get_all_employees()

        return jsonify({
            "employees": [
                employee_to_json(employee)
                for employee in employees
            ],
            "total": len(employees),
        }), 200

    except Exception as error:
        current_app.logger.exception(
            "Unable to retrieve employees."
        )

        return jsonify({
            "message": "Unable to retrieve employees.",
            "error": str(error),
        }), 500

@employees_bp.post("")
def add_employee():
    image_path: str | None = None

    try:
        face_image = validate_image(
            request.files.get("face_image")
        )

        full_name = request.form.get(
            "fullName",
            "",
        ).strip()

        department = request.form.get(
            "department",
            "",
        ).strip()

        designation = request.form.get(
            "designation",
            "",
        ).strip()

        email = request.form.get(
            "email",
            "",
        ).strip().lower()

        missing_fields: list[str] = []

        if not full_name:
            missing_fields.append("fullName")

        if not department:
            missing_fields.append("department")

        if not designation:
            missing_fields.append("designation")

        if not email:
            missing_fields.append("email")

        if missing_fields:
            return jsonify({
                "message": "Required fields are missing.",
                "fields": missing_fields,
            }), 400

        employee_data = {
            "full_name": full_name,
            "date_of_birth": parse_optional_date(
                request.form.get("dateOfBirth")
            ),
            "gender": (
                request.form.get("gender") or None
            ),
            "department": department,
            "designation": designation,
            "email": email,
            "phone": (
                request.form.get("phone") or None
            ),
            "joining_date": parse_optional_date(
                request.form.get("joiningDate")
            ),
            "employee_type": (
                request.form.get("employeeType") or None
            ),
            "address": (
                request.form.get("address") or None
            ),
            "status": "Active",
        }

        image_path = save_face_image(face_image)

        employee = create_employee(
            employee_data=employee_data,
            image_path=image_path,
        )

        return jsonify({
            "message": "Employee created successfully.",
            "employee": employee_to_json(employee),
        }), 201

    except ValueError as error:
        if image_path:
            Path(image_path).unlink(missing_ok=True)

        return jsonify({
            "message": str(error),
        }), 400

    except errors.UniqueViolation:
        if image_path:
            Path(image_path).unlink(missing_ok=True)

        return jsonify({
            "message": (
                "An employee with this email address "
                "already exists."
            ),
        }), 409

    except Exception as error:
        if image_path:
            Path(image_path).unlink(missing_ok=True)

        current_app.logger.exception(
            "Unable to create employee."
        )

        return jsonify({
            "message": "Unable to create employee.",
            "error": str(error),
        }), 500

@employees_bp.put("/<string:employee_code>")
def update_employee(employee_code: str):
    try:
        request_data = request.get_json(silent=True)

        if not request_data:
            return jsonify({
                "message": "JSON request data is required."
            }), 400

        full_name = str(
            request_data.get("fullName", "")
        ).strip()

        department = str(
            request_data.get("department", "")
        ).strip()

        designation = str(
            request_data.get("designation", "")
        ).strip()

        email = str(
            request_data.get("email", "")
        ).strip().lower()

        missing_fields = []

        if not full_name:
            missing_fields.append("fullName")

        if not department:
            missing_fields.append("department")

        if not designation:
            missing_fields.append("designation")

        if not email:
            missing_fields.append("email")

        if missing_fields:
            return jsonify({
                "message": "Required fields are missing.",
                "fields": missing_fields,
            }), 400

        employee_data = {
            "full_name": full_name,
            "date_of_birth": parse_optional_date(
                request_data.get("dateOfBirth")
            ),
            "gender": request_data.get("gender") or None,
            "department": department,
            "designation": designation,
            "email": email,
            "phone": request_data.get("phone") or None,
            "joining_date": parse_optional_date(
                request_data.get("joiningDate")
            ),
            "employee_type": (
                request_data.get("employeeType") or None
            ),
            "address": request_data.get("address") or None,
            "status": request_data.get("status") or "Active",
        }

        employee = update_employee_by_code(
            employee_code=employee_code,
            employee_data=employee_data,
        )

        if employee is None:
            return jsonify({
                "message": (
                    f"No employee exists with code "
                    f"{employee_code}."
                )
            }), 404

        return jsonify({
            "message": "Employee updated successfully.",
            "employee": employee_to_json(employee),
        }), 200

    except ValueError as error:
        return jsonify({
            "message": str(error),
        }), 400

    except errors.UniqueViolation:
        return jsonify({
            "message": (
                "Another employee already uses this email address."
            ),
        }), 409

    except Exception as error:
        current_app.logger.exception(
            "Unable to update employee."
        )

        return jsonify({
            "message": "Unable to update employee.",
            "error": str(error),
        }), 500
    
@employees_bp.get("/<string:employee_code>")
def get_employee(employee_code: str):
    try:
        employee = get_employee_by_code(employee_code)

        if employee is None:
            return jsonify({
                "message": (
                    f"No employee exists with code "
                    f"{employee_code}."
                )
            }), 404

        return jsonify({
            "employee": employee_to_json(employee)
        }), 200

    except Exception as error:
        current_app.logger.exception(
            "Unable to retrieve employee."
        )

        return jsonify({
            "message": "Unable to retrieve employee.",
            "error": str(error),
        }), 500

@employees_bp.delete("/<string:employee_code>")
def delete_employee(employee_code: str):
    try:
        employee = delete_employee_by_code(employee_code)

        if employee is None:
            return jsonify({
                "message": (
                    f"No employee exists with code "
                    f"{employee_code}."
                )
            }), 404

        image_path = employee.get("image_path")

        if image_path:
            Path(image_path).unlink(missing_ok=True)

        return jsonify({
            "message": "Employee deleted successfully.",
            "employee": {
                "employeeCode": employee["employee_code"],
                "fullName": employee["full_name"],
            },
        }), 200

    except Exception as error:
        current_app.logger.exception(
            "Unable to delete employee."
        )

        return jsonify({
            "message": "Unable to delete employee.",
            "error": str(error),
        }), 500

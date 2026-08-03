from pathlib import Path
from uuid import uuid4

from flask import (
    Blueprint,
    current_app,
    jsonify,
    request,
)

from flask_jwt_extended import (
    get_jwt,
    jwt_required,
)

from werkzeug.datastructures import FileStorage

from database.attendance_repository import (
    create_attendance_event,
    get_latest_attendance_event,
)

from database.face_repository import (
    get_face_embedding_by_employee_id,
)

from services.attendance_service import (
    validate_attendance_transition,
)

from services.face_service import (
    calculate_cosine_distance,
    generate_face_embedding,
)


attendance_bp = Blueprint(
    "attendance",
    __name__,
    url_prefix="/api/attendance",
)


ALLOWED_EVENT_TYPES = {
    "CHECK_IN",
    "BREAK_START",
    "BREAK_END",
    "LUNCH_START",
    "LUNCH_END",
    "CHECK_OUT",
}

FACE_THRESHOLD = 0.40


def save_temporary_face_image(
    face_image: FileStorage | None,
) -> Path:
    if face_image is None:
        raise ValueError(
            "A face image is required."
        )

    if face_image.mimetype not in {
        "image/jpeg",
        "image/png",
    }:
        raise ValueError(
            "Only JPG and PNG images are allowed."
        )

    temp_folder = Path(
        current_app.config[
            "ATTENDANCE_TEMP_FOLDER"
        ]
    )

    temp_folder.mkdir(
        parents=True,
        exist_ok=True,
    )

    extension = (
        "png"
        if face_image.mimetype == "image/png"
        else "jpg"
    )

    temp_path = temp_folder / (
        f"attendance-{uuid4().hex}.{extension}"
    )

    face_image.save(temp_path)

    return temp_path


@attendance_bp.post("/verify-and-record")
@jwt_required()
def verify_and_record_attendance():
    temporary_path: Path | None = None

    try:
        claims = get_jwt()

        employee_id = claims.get("employeeId")
        role = claims.get("role")

        if role != "EMPLOYEE":
            return jsonify({
                "message": (
                    "Only employee accounts can use "
                    "this attendance endpoint."
                )
            }), 403

        if not employee_id:
            return jsonify({
                "message": (
                    "This user account is not linked "
                    "to an employee."
                )
            }), 403

        event_type = str(
            request.form.get("event_type", "")
        ).strip().upper()

        if event_type not in ALLOWED_EVENT_TYPES:
            return jsonify({
                "message": "Invalid attendance event type."
            }), 400

        face_image = request.files.get(
            "face_image"
        )

        temporary_path = save_temporary_face_image(
            face_image
        )

        face_record = (
            get_face_embedding_by_employee_id(
                int(employee_id)
            )
        )

        if face_record is None:
            return jsonify({
                "message": (
                    "No registered face embedding "
                    "was found for this employee."
                )
            }), 404

        if face_record.get("status") != "Active":
            return jsonify({
                "message": (
                    "This employee account is inactive."
                )
            }), 403

        probe_embedding = generate_face_embedding(
            str(temporary_path)
        )

        distance = calculate_cosine_distance(
            probe_embedding,
            face_record["embedding"],
        )

        if distance > FACE_THRESHOLD:
            return jsonify({
                "verified": False,
                "message": "Face verification failed.",
                "distance": round(distance, 6),
                "threshold": FACE_THRESHOLD,
            }), 403

        latest_event = get_latest_attendance_event(
            int(employee_id)
        )

        latest_event_type = (
            latest_event["event_type"]
            if latest_event
            else None
        )

        validate_attendance_transition(
            latest_event_type,
            event_type,
        )

        attendance_event = create_attendance_event(
            employee_id=int(employee_id),
            event_type=event_type,
            face_distance=distance,
        )

        return jsonify({
            "verified": True,
            "message": (
                f"{event_type.replace('_', ' ').title()} "
                "recorded successfully."
            ),
            "employee": {
                "employeeId": employee_id,
                "employeeCode": face_record[
                    "employee_code"
                ],
                "fullName": face_record[
                    "full_name"
                ],
            },
            "attendanceEvent": {
                "id": attendance_event["id"],
                "eventType": attendance_event[
                    "event_type"
                ],
                "eventTime": attendance_event[
                    "event_time"
                ].isoformat(),
                "verificationMethod":
                    attendance_event[
                        "verification_method"
                    ],
                "faceDistance": attendance_event[
                    "face_distance"
                ],
            },
        }), 201

    except ValueError as error:
        return jsonify({
            "message": str(error)
        }), 400

    except Exception as error:
        current_app.logger.exception(
            "Unable to record attendance."
        )

        return jsonify({
            "message": (
                "Unable to record attendance."
            ),
            "error": str(error),
        }), 500

    finally:
        if temporary_path:
            temporary_path.unlink(
                missing_ok=True
            )
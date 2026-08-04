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

from collections import defaultdict
from datetime import date, datetime, timedelta

from werkzeug.datastructures import FileStorage

from database.attendance_repository import (
    create_attendance_event,
    get_attendance_events_by_date_range,
    get_today_attendance_events,
)

from database.face_repository import (
    get_face_embedding_by_employee_id,
)

from services.attendance_service import (
    get_allowed_attendance_actions,
    get_attendance_status_label,
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
    "CLOCKED_IN",
    "BREAK_START",
    "BREAK_END",
    "LUNCH_START",
    "LUNCH_END",
    "CLOCKED_OUT",
}

FACE_THRESHOLD = 0.40

def calculate_duration_minutes(
    start_time: datetime | None,
    end_time: datetime | None,
) -> int:
    if start_time is None or end_time is None:
        return 0

    seconds = (
        end_time - start_time
    ).total_seconds()

    return max(
        0,
        round(seconds / 60),
    )


def calculate_paired_duration(
    events: list[dict],
    start_type: str,
    end_type: str,
) -> int:
    total_minutes = 0
    active_start: datetime | None = None

    for event in events:
        event_type = event["event_type"]
        event_time = event["event_time"]

        if event_type == start_type:
            active_start = event_time

        elif (
            event_type == end_type
            and active_start is not None
        ):
            total_minutes += (
                calculate_duration_minutes(
                    active_start,
                    event_time,
                )
            )

            active_start = None

    return total_minutes


def build_daily_attendance_record(
    attendance_date: date,
    events: list[dict],
) -> dict:
    clocked_in_event = next(
        (
            event
            for event in events
            if event["event_type"]
            == "CLOCKED_IN"
        ),
        None,
    )

    clocked_out_event = next(
        (
            event
            for event in reversed(events)
            if event["event_type"]
            == "CLOCKED_OUT"
        ),
        None,
    )

    clocked_in_time = (
        clocked_in_event["event_time"]
        if clocked_in_event
        else None
    )

    clocked_out_time = (
        clocked_out_event["event_time"]
        if clocked_out_event
        else None
    )

    break_minutes = calculate_paired_duration(
        events,
        "BREAK_START",
        "BREAK_END",
    )

    lunch_minutes = calculate_paired_duration(
        events,
        "LUNCH_START",
        "LUNCH_END",
    )

    gross_minutes = calculate_duration_minutes(
        clocked_in_time,
        clocked_out_time,
    )

    worked_minutes = (
        max(
            0,
            gross_minutes
            - break_minutes
            - lunch_minutes,
        )
        if clocked_out_time
        else None
    )

    if clocked_out_time:
        status = "Completed"
    elif clocked_in_time:
        status = "In Progress"
    else:
        status = "Incomplete"

    return {
        "date": attendance_date.isoformat(),
        "clockedInTime": (
            clocked_in_time.isoformat()
            if clocked_in_time
            else None
        ),
        "clockedOutTime": (
            clocked_out_time.isoformat()
            if clocked_out_time
            else None
        ),
        "breakMinutes": break_minutes,
        "lunchMinutes": lunch_minutes,
        "workedMinutes": worked_minutes,
        "status": status,
        "events": [
            {
                "id": event["id"],
                "eventType": event["event_type"],
                "eventTime":
                    event["event_time"].isoformat(),
                "verificationMethod":
                    event["verification_method"],
                "faceDistance":
                    event["face_distance"],
            }
            for event in events
        ],
    }

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

@attendance_bp.get("/my-status")
@jwt_required()
def get_my_attendance_status():
    try:
        claims = get_jwt()

        employee_id = claims.get("employeeId")

        if not employee_id:
            return jsonify({
                "message": (
                    "This user account is not linked "
                    "to an employee."
                )
            }), 403

        events = get_today_attendance_events(
            int(employee_id)
        )

        latest_event = (
            events[-1]
            if events
            else None
        )

        latest_event_type = (
            latest_event["event_type"]
            if latest_event
            else None
        )

        clock_in_event = next(
            (
                event
                for event in events
                if event["event_type"] == "CLOCKED_IN"
            ),
            None,
        )

        clock_out_event = next(
            (
                event
                for event in reversed(events)
                if event["event_type"] == "CLOCKED_OUT"
            ),
            None,
        )

        return jsonify({
            "status": get_attendance_status_label(
                latest_event_type
            ),
            "latestEventType": latest_event_type,
            "allowedActions":
                get_allowed_attendance_actions(
                    latest_event_type
                ),
            "clockedInTime": (
                clock_in_event["event_time"].isoformat()
                if clock_in_event
                else None
            ),
            "clockedOutTime": (
                clock_out_event["event_time"].isoformat()
                if clock_out_event
                else None
        ),
            "events": [
                {
                    "id": event["id"],
                    "eventType": event["event_type"],
                    "eventTime":
                        event["event_time"].isoformat(),
                    "verificationMethod":
                        event["verification_method"],
                    "faceDistance":
                        event["face_distance"],
                }
                for event in events
            ],
        }), 200

    except Exception as error:
        current_app.logger.exception(
            "Unable to retrieve attendance status."
        )

        return jsonify({
            "message": (
                "Unable to retrieve attendance status."
            ),
            "error": str(error),
        }), 500

@attendance_bp.get("/my-history")
@jwt_required()
def get_my_attendance_history():
    try:
        claims = get_jwt()

        employee_id = claims.get("employeeId")
        role = claims.get("role")

        if role != "EMPLOYEE":
            return jsonify({
                "message": (
                    "Only employee accounts can view "
                    "personal attendance history."
                )
            }), 403

        if not employee_id:
            return jsonify({
                "message": (
                    "This user account is not linked "
                    "to an employee."
                )
            }), 403

        today = date.today()

        default_start_date = (
            today - timedelta(days=29)
        )

        start_date_value = request.args.get(
            "start_date"
        )

        end_date_value = request.args.get(
            "end_date"
        )

        start_date = (
            date.fromisoformat(start_date_value)
            if start_date_value
            else default_start_date
        )

        end_date = (
            date.fromisoformat(end_date_value)
            if end_date_value
            else today
        )

        if start_date > end_date:
            return jsonify({
                "message": (
                    "start_date cannot be after "
                    "end_date."
                )
            }), 400

        maximum_range_days = 366

        requested_days = (
            end_date - start_date
        ).days

        if requested_days > maximum_range_days:
            return jsonify({
                "message": (
                    "The attendance history range "
                    "cannot exceed 366 days."
                )
            }), 400

        events = (
            get_attendance_events_by_date_range(
                employee_id=int(employee_id),
                start_date=start_date,
                end_date=end_date,
            )
        )

        events_by_date = defaultdict(list)

        for event in events:
            event_date = (
                event["event_time"].date()
            )

            events_by_date[event_date].append(
                event
            )

        records = [
            build_daily_attendance_record(
                attendance_date,
                daily_events,
            )
            for attendance_date, daily_events
            in sorted(
                events_by_date.items(),
                key=lambda item: item[0],
                reverse=True,
            )
        ]

        total_completed_days = sum(
            1
            for record in records
            if record["status"] == "Completed"
        )

        total_worked_minutes = sum(
            record["workedMinutes"] or 0
            for record in records
        )

        return jsonify({
            "startDate": start_date.isoformat(),
            "endDate": end_date.isoformat(),
            "recordCount": len(records),
            "summary": {
                "completedDays":
                    total_completed_days,
                "workedMinutes":
                    total_worked_minutes,
            },
            "records": records,
        }), 200

    except ValueError:
        return jsonify({
            "message": (
                "Invalid date format. Use "
                "YYYY-MM-DD."
            )
        }), 400

    except Exception as error:
        current_app.logger.exception(
            "Unable to retrieve attendance history."
        )

        return jsonify({
            "message": (
                "Unable to retrieve attendance history."
            ),
            "error": str(error),
        }), 500

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

        today_events = get_today_attendance_events(
            int(employee_id)
        )
        latest_event = (
            today_events[-1]
            if today_events
            else None
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
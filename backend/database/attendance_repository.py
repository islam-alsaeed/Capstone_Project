from typing import Any
from psycopg.rows import dict_row
from database.database_connection import create_connection
from datetime import date


def get_latest_attendance_event(
    employee_id: int,
) -> dict[str, Any] | None:
    connection = create_connection()

    if connection is None:
        raise RuntimeError(
            "Unable to connect to PostgreSQL."
        )

    try:
        with connection.cursor(
            row_factory=dict_row
        ) as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    employee_id,
                    event_type,
                    event_time,
                    verification_method,
                    face_distance
                FROM attendance_events
                WHERE employee_id = %s
                ORDER BY event_time DESC, id DESC
                LIMIT 1
                """,
                (employee_id,),
            )

            event = cursor.fetchone()

            return dict(event) if event else None

    finally:
        connection.close()

def get_today_attendance_events(
    employee_id: int,
) -> list[dict[str, Any]]:
    connection = create_connection()

    if connection is None:
        raise RuntimeError(
            "Unable to connect to PostgreSQL."
        )

    try:
        with connection.cursor(
            row_factory=dict_row
        ) as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    employee_id,
                    event_type,
                    event_time,
                    verification_method,
                    face_distance
                FROM attendance_events
                WHERE
                    employee_id = %s
                    AND event_time::date = CURRENT_DATE
                ORDER BY event_time ASC, id ASC
                """,
                (employee_id,),
            )

            return [
                dict(row)
                for row in cursor.fetchall()
            ]

    finally:
        connection.close()

def get_attendance_events_by_date_range(
    employee_id: int,
    start_date: date,
    end_date: date,
) -> list[dict[str, Any]]:
    connection = create_connection()

    if connection is None:
        raise RuntimeError(
            "Unable to connect to PostgreSQL."
        )

    try:
        with connection.cursor(
            row_factory=dict_row
        ) as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    employee_id,
                    event_type,
                    event_time,
                    verification_method,
                    face_distance
                FROM attendance_events
                WHERE
                    employee_id = %s
                    AND event_time::date
                        BETWEEN %s AND %s
                ORDER BY
                    event_time ASC,
                    id ASC
                """,
                (
                    employee_id,
                    start_date,
                    end_date,
                ),
            )

            return [
                dict(row)
                for row in cursor.fetchall()
            ]

    finally:
        connection.close()

def create_attendance_event(
    employee_id: int,
    event_type: str,
    face_distance: float,
) -> dict[str, Any]:
    connection = create_connection()

    if connection is None:
        raise RuntimeError(
            "Unable to connect to PostgreSQL."
        )

    try:
        with connection.cursor(
            row_factory=dict_row
        ) as cursor:
            cursor.execute(
                """
                INSERT INTO attendance_events (
                    employee_id,
                    event_type,
                    verification_method,
                    face_distance
                )
                VALUES (%s, %s, 'FACE', %s)
                RETURNING
                    id,
                    employee_id,
                    event_type,
                    event_time,
                    verification_method,
                    face_distance
                """,
                (
                    employee_id,
                    event_type,
                    face_distance,
                ),
            )

            event = cursor.fetchone()

        connection.commit()

        if event is None:
            raise RuntimeError(
                "Attendance event was not created."
            )

        return dict(event)

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()
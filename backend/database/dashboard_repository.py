from typing import Any

from psycopg.rows import dict_row

from database.database_connection import (
    create_connection,
)


def get_admin_dashboard_summary() -> dict[str, Any]:
    connection = create_connection()

    if connection is None:
        raise RuntimeError(
            "Unable to connect to PostgreSQL."
        )

    try:
        with connection.cursor(
            row_factory=dict_row
        ) as cursor:
            # Employee totals
            cursor.execute(
                """
                SELECT
                    COUNT(*) AS total_employees,

                    COUNT(*) FILTER (
                        WHERE LOWER(
                            COALESCE(status, '')
                        ) = 'active'
                    ) AS active_employees,

                    COUNT(*) FILTER (
                        WHERE LOWER(
                            COALESCE(status, '')
                        ) <> 'active'
                    ) AS inactive_employees,

                    COUNT(*) FILTER (
                        WHERE EXISTS (
                            SELECT 1
                            FROM face_embeddings AS fe
                            WHERE
                                fe.employee_id =
                                    employees.id
                        )
                    ) AS face_registered_employees

                FROM employees
                """
            )

            employee_summary = cursor.fetchone()

            # Latest attendance status for each
            # employee today
            cursor.execute(
                """
                WITH latest_today_event AS (
                    SELECT DISTINCT ON (
                        employee_id
                    )
                        employee_id,
                        event_type,
                        event_time,
                        id
                    FROM attendance_events
                    WHERE
                        event_time::date =
                            CURRENT_DATE
                    ORDER BY
                        employee_id,
                        event_time DESC,
                        id DESC
                )
                SELECT
                    COUNT(*) FILTER (
                        WHERE event_type IN (
                            'CLOCKED_IN',
                            'BREAK_START',
                            'BREAK_END',
                            'LUNCH_START',
                            'LUNCH_END'
                        )
                    ) AS currently_clocked_in,

                    COUNT(*) FILTER (
                        WHERE event_type =
                            'CLOCKED_OUT'
                    ) AS clocked_out_today

                FROM latest_today_event
                """
            )

            attendance_summary = cursor.fetchone()

            # Latest attendance activity
            cursor.execute(
                """
                SELECT
                    ae.id,
                    ae.event_type,
                    ae.event_time,
                    ae.verification_method,
                    ae.face_distance,
                    e.employee_code,
                    e.full_name,
                    e.department,
                    e.designation

                FROM attendance_events AS ae

                INNER JOIN employees AS e
                    ON e.id = ae.employee_id

                ORDER BY
                    ae.event_time DESC,
                    ae.id DESC

                LIMIT 10
                """
            )

            recent_events = [
                dict(row)
                for row in cursor.fetchall()
            ]

            return {
                "employee_summary": (
                    dict(employee_summary)
                    if employee_summary
                    else {}
                ),
                "attendance_summary": (
                    dict(attendance_summary)
                    if attendance_summary
                    else {}
                ),
                "recent_events": recent_events,
            }

    finally:
        connection.close()
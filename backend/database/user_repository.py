from typing import Any

from psycopg.rows import dict_row

from database.database_connection import create_connection


def get_user_by_email(
    email: str,
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
                    u.id,
                    u.employee_id,
                    u.email,
                    u.password_hash,
                    u.role,
                    u.is_active,
                    u.last_login_at,
                    e.employee_code,
                    e.full_name,
                    e.status AS employee_status,
                    e.face_registered
                FROM users AS u
                LEFT JOIN employees AS e
                    ON e.id = u.employee_id
                WHERE LOWER(u.email) = LOWER(%s)
                """,
                (email,),
            )

            user = cursor.fetchone()

            return dict(user) if user else None

    finally:
        connection.close()


def create_user(
    employee_id: int | None,
    email: str,
    password_hash: str,
    role: str = "EMPLOYEE",
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
                INSERT INTO users (
                    employee_id,
                    email,
                    password_hash,
                    role
                )
                VALUES (%s, %s, %s, %s)
                RETURNING
                    id,
                    employee_id,
                    email,
                    role,
                    is_active,
                    created_at
                """,
                (
                    employee_id,
                    email.lower(),
                    password_hash,
                    role,
                ),
            )

            user = cursor.fetchone()

        connection.commit()

        if user is None:
            raise RuntimeError(
                "User account was not created."
            )

        return dict(user)

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


def update_last_login(user_id: int) -> None:
    connection = create_connection()

    if connection is None:
        raise RuntimeError(
            "Unable to connect to PostgreSQL."
        )

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE users
                SET
                    last_login_at = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                """,
                (user_id,),
            )

        connection.commit()

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()
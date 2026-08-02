from datetime import date
from typing import Any
from psycopg.rows import dict_row
from database.database_connection import create_connection
from psycopg.rows import dict_row

def get_employee_by_code(employee_code: str):
    connection = create_connection()

    if connection is None:
        raise RuntimeError("Unable to connect to PostgreSQL.")

    try:
        with connection.cursor(row_factory=dict_row) as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    employee_code,
                    full_name,
                    date_of_birth,
                    gender,
                    department,
                    designation,
                    email,
                    phone,
                    joining_date,
                    employee_type,
                    address,
                    status,
                    image_path,
                    face_registered,
                    created_at,
                    updated_at
                FROM employees
                WHERE employee_code = %s
                """,
                (employee_code,),
            )

            employee = cursor.fetchone()

            return dict(employee) if employee else None

    finally:
        connection.close()

def generate_employee_code(employee_id: int) -> str:
    current_year = date.today().year
    return f"EMP{current_year}{employee_id:04d}"


def get_all_employees() -> list[dict]:
    connection = create_connection()

    if connection is None:
        raise RuntimeError("Unable to connect to PostgreSQL.")

    try:
        with connection.cursor(row_factory=dict_row) as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    employee_code,
                    full_name,
                    date_of_birth,
                    gender,
                    department,
                    designation,
                    email,
                    phone,
                    joining_date,
                    employee_type,
                    address,
                    status,
                    image_path,
                    face_registered,
                    created_at,
                    updated_at
                FROM employees
                ORDER BY id DESC
                """
            )

            employees = cursor.fetchall()

            return [dict(employee) for employee in employees]

    finally:
        connection.close()

def delete_employee_by_code(employee_code: str) -> dict | None:
    connection = create_connection()

    if connection is None:
        raise RuntimeError("Unable to connect to PostgreSQL.")

    try:
        with connection.cursor(row_factory=dict_row) as cursor:
            cursor.execute(
                """
                DELETE FROM employees
                WHERE employee_code = %s
                RETURNING
                    id,
                    employee_code,
                    full_name,
                    image_path
                """,
                (employee_code,),
            )

            deleted_employee = cursor.fetchone()

        connection.commit()

        return (
            dict(deleted_employee)
            if deleted_employee
            else None
        )

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()

        
def create_employee(
    employee_data: dict[str, Any],
    image_path: str | None = None,
) -> dict[str, Any]:
    connection = create_connection()

    if connection is None:
        raise RuntimeError("Unable to connect to PostgreSQL.")

    try:
        with connection.cursor(row_factory=dict_row) as cursor:
            cursor.execute(
                """
                INSERT INTO employees (
                    full_name,
                    date_of_birth,
                    gender,
                    department,
                    designation,
                    email,
                    phone,
                    joining_date,
                    employee_type,
                    address,
                    status,
                    image_path,
                    face_registered
                )
                VALUES (
                    %(full_name)s,
                    %(date_of_birth)s,
                    %(gender)s,
                    %(department)s,
                    %(designation)s,
                    %(email)s,
                    %(phone)s,
                    %(joining_date)s,
                    %(employee_type)s,
                    %(address)s,
                    %(status)s,
                    %(image_path)s,
                    FALSE
                )
                RETURNING id
                """,
                {
                    "full_name": employee_data["full_name"],
                    "date_of_birth": employee_data.get("date_of_birth"),
                    "gender": employee_data.get("gender"),
                    "department": employee_data["department"],
                    "designation": employee_data["designation"],
                    "email": employee_data["email"].lower(),
                    "phone": employee_data.get("phone"),
                    "joining_date": employee_data.get("joining_date"),
                    "employee_type": employee_data.get("employee_type"),
                    "address": employee_data.get("address"),
                    "status": employee_data.get("status", "Active"),
                    "image_path": image_path,
                },
            )

            inserted_employee = cursor.fetchone()

            if inserted_employee is None:
                raise RuntimeError("Employee ID was not generated.")

            employee_id = inserted_employee["id"]
            employee_code = generate_employee_code(employee_id)

            cursor.execute(
                """
                UPDATE employees
                SET employee_code = %s
                WHERE id = %s
                RETURNING *
                """,
                (employee_code, employee_id),
            )

            employee = cursor.fetchone()

        connection.commit()

        if employee is None:
            raise RuntimeError("Created employee could not be retrieved.")

        return dict(employee)

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()
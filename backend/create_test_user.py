from werkzeug.security import generate_password_hash

from database.database_connection import create_connection


EMPLOYEE_CODE = "EMP20260009"
TEST_PASSWORD = "Employee123!"


def create_test_user() -> None:
    connection = create_connection()

    if connection is None:
        raise RuntimeError(
            "Unable to connect to PostgreSQL."
        )

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    email,
                    full_name
                FROM employees
                WHERE employee_code = %s
                """,
                (EMPLOYEE_CODE,),
            )

            employee = cursor.fetchone()

            if employee is None:
                raise RuntimeError(
                    f"Employee {EMPLOYEE_CODE} was not found."
                )

            employee_id = employee[0]
            employee_email = employee[1]
            employee_name = employee[2]

            if not employee_email:
                raise RuntimeError(
                    "The employee does not have an email address."
                )

            password_hash = generate_password_hash(
                TEST_PASSWORD
            )

            cursor.execute(
                """
                INSERT INTO users (
                    employee_id,
                    email,
                    password_hash,
                    role
                )
                VALUES (%s, %s, %s, 'EMPLOYEE')
                ON CONFLICT (email)
                DO UPDATE SET
                    employee_id = EXCLUDED.employee_id,
                    password_hash = EXCLUDED.password_hash,
                    role = 'EMPLOYEE',
                    is_active = TRUE,
                    updated_at = CURRENT_TIMESTAMP
                RETURNING id, email, role
                """,
                (
                    employee_id,
                    employee_email.lower(),
                    password_hash,
                ),
            )

            user = cursor.fetchone()

        connection.commit()

        print("Employee account created successfully.")
        print("User ID:", user[0])
        print("Name:", employee_name)
        print("Email:", user[1])
        print("Role:", user[2])
        print("Password:", TEST_PASSWORD)

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


if __name__ == "__main__":
    create_test_user()
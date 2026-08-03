import json
from typing import Any

from psycopg.rows import dict_row

from database.database_connection import create_connection


def get_face_embedding_by_employee_id(
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
                    fe.employee_id,
                    fe.embedding,
                    fe.model_name,
                    e.employee_code,
                    e.full_name,
                    e.status,
                    e.face_registered
                FROM face_embeddings AS fe
                INNER JOIN employees AS e
                    ON e.id = fe.employee_id
                WHERE fe.employee_id = %s
                """,
                (employee_id,),
            )

            record = cursor.fetchone()

            if record is None:
                return None

            face_record = dict(record)

            embedding = face_record.get(
                "embedding"
            )

            if isinstance(embedding, str):
                embedding = json.loads(
                    embedding
                )

            face_record["embedding"] = embedding

            return face_record

    finally:
        connection.close()
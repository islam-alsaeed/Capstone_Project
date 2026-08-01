import os

import psycopg
from dotenv import load_dotenv
from psycopg import Connection


load_dotenv()


def create_connection() -> Connection | None:
    """Create and return a PostgreSQL connection."""

    try:
        connection = psycopg.connect(
            host=os.getenv("DB_HOST", "localhost"),
            dbname=os.getenv("DB_NAME", "FRC"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD"),
            port=os.getenv("DB_PORT", "5432"),
        )

        print("Database connected successfully")
        return connection

    except psycopg.Error as error:
        print("Error connecting to PostgreSQL:", error)
        return None


if __name__ == "__main__":
    connection = create_connection()

    if connection is not None:
        connection.close()
        print("Database connection closed")
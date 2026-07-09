import psycopg2


# Establish a connection to the PostgreSQL database
def create_connection():
    """Create a connection to the PostgreSQL database."""
    try:
        connection = psycopg2.connect(
            host="localhost",
            database="FRC",
            user="postgres",
            password="Islam702"
        )
        print("Database connected successfully")
        return connection
    except psycopg2.Error as e:
        print("Error connecting to PostgreSQL:", e)
        return None




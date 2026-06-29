from database.database_connection import create_connection
import json
def store_employee_data(employee_id, fist_name ,last_name , facial_representation):
    conn = create_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return False
    cursor = conn.cursor()
    try:
        # Convert the facial representation to a JSON string
        facial_json=json.dumps(facial_representation)
        sql = "INSERT INTO employees (id, first_name, last_name, embedding) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (employee_id, fist_name ,last_name , facial_json))

        # Fetch and print the stored employee data for testing purposes only
        sql2= "select * from employees"
        cursor.execute(sql2)
        print("Employee data fetched successfully.")
        rows = cursor.fetchall()
        for row in rows:
            print(row)
        conn.commit()
        cursor.close()
        conn.close()
        print("Employee data stored successfully.")
    except Exception as e:
        print("Error storing employee data:", e)
        conn.rollback()


    
    
from database.employee_repository import create_employee


employee_data = {
    "full_name": "Test Employee",
    "date_of_birth": None,
    "gender": "Male",
    "department": "Software Development",
    "designation": "Software Engineer",
    "email": "test.employee@example.com",
    "phone": "+1 555 123 4567",
    "joining_date": None,
    "employee_type": "Full Time",
    "address": "123 Test Street",
    "status": "Active",
}


try:
    employee = create_employee(employee_data)

    print("Employee created successfully:")
    print(employee)

except Exception as error:
    print("Unable to create employee:", error)
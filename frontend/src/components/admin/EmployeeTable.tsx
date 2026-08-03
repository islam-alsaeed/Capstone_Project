import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from "@mui/material";

interface Employee {
  id: number | string;
  first_name?: string;
  last_name?: string;
  role?: string;
  created_at?: string;
}
export default function EmployeeTable() {

    const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/employee/list")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data.employees);
      })
      .catch((err) => console.error("Failed to load employees", err));
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No employees found
              </TableCell>
            </TableRow>
          ) : (
            employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>{emp.id}</TableCell>
                <TableCell>{emp.first_name} {emp.last_name}</TableCell>
                <TableCell>{emp.role || "N/A"}</TableCell>
                <TableCell>{emp.created_at || "N/A"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

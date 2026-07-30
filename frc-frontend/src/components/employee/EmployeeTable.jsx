import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import EmployeeRow from "./EmployeeRow";
import employees from "../../data/employees";

function EmployeeTable() {
  return (
    <Paper
      sx={{
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 8px 30px rgba(0,0,0,.05)",
      }}
    >
      <Table>

        <TableHead>

          <TableRow
            sx={{
              background: "#F5F7FB",
            }}
          >
            <TableCell>ID</TableCell>
            <TableCell>Photo</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>

        </TableHead>

        <TableBody>

          {employees.map((employee) => (
            <EmployeeRow
              key={employee.id}
              employee={employee}
            />
          ))}

        </TableBody>

      </Table>
    </Paper>
  );
}

export default EmployeeTable;
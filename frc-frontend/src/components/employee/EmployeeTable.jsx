import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import EmployeeRow from "./EmployeeRow";

function EmployeeTable({
  employees,
  onEmployeeDeleted,
}) {
  return (
    <Paper
      sx={{
        overflowX: "auto",
        borderRadius: "12px",
        boxShadow: "0 4px 18px rgba(0,0,0,.05)",
      }}
    >
      <Table sx={{ minWidth: 1150 }}>
        <TableHead>
          <TableRow sx={{ background: "#f5f7fb" }}>
            <TableCell>ID</TableCell>
            <TableCell>Photo</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Designation</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {employees.map((employee) => (
            <EmployeeRow
              key={employee.employeeCode}
              employee={employee}
              onEmployeeDeleted={onEmployeeDeleted}
            />
          ))}

          {employees.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={9}
                align="center"
                sx={{ py: 7 }}
              >
                <Typography color="text.secondary">
                  No employees found.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default EmployeeTable;
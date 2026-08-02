import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  IconButton,
  TableCell,
  TableRow,
} from "@mui/material";

import {
  Delete,
  Edit,
  Visibility,
} from "@mui/icons-material";

import StatusChip from "./StatusChip";

function EmployeeRow({
  employee,
  onEmployeeDeleted,
}) {
  const navigate = useNavigate();

  const openEmployee = () => {
    navigate(
      `/employees/${employee.employeeCode}`
    );
  };

  const editEmployee = (event) => {
    event.stopPropagation();

    navigate(
      `/employees/${employee.employeeCode}/edit`
    );
  };

  const deleteEmployee = async (event) => {
    event.stopPropagation();

    const confirmed = window.confirm(
      `Delete ${employee.fullName}?`
    );

    if (!confirmed) {
      return;
    }

    // The DELETE backend endpoint will be added next.
    console.log(
      "Delete employee:",
      employee.employeeCode
    );

    onEmployeeDeleted?.();
  };

  return (
    <TableRow
      hover
      onClick={openEmployee}
      sx={{ cursor: "pointer" }}
    >
      <TableCell>
        {employee.employeeCode}
      </TableCell>

      <TableCell>
        <Avatar
          src={employee.imageUrl || employee.imagePath}
          alt={employee.fullName}
        />
      </TableCell>

      <TableCell sx={{ fontWeight: 600 }}>
        {employee.fullName}
      </TableCell>

      <TableCell>
        {employee.department}
      </TableCell>

      <TableCell>
        {employee.designation}
      </TableCell>

      <TableCell>{employee.email}</TableCell>

      <TableCell>
        {employee.phone || "—"}
      </TableCell>

      <TableCell>
        <StatusChip status={employee.status} />
      </TableCell>

      <TableCell align="center">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <IconButton
            color="primary"
            onClick={(event) => {
              event.stopPropagation();
              openEmployee();
            }}
          >
            <Visibility />
          </IconButton>

          <IconButton
            color="primary"
            onClick={editEmployee}
          >
            <Edit />
          </IconButton>

          <IconButton
            color="error"
            onClick={deleteEmployee}
          >
            <Delete />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
}

export default EmployeeRow;
import axios from "axios";
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
      `Are you sure you want to delete ${employee.fullName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `http://127.0.0.1:5000/api/employees/${employee.employeeCode}`
      );

      alert("Employee deleted successfully.");

      onEmployeeDeleted?.();
    } catch (error) {
      console.error(
        "Unable to delete employee:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Unable to delete the employee."
      );
    }
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
          src={employee.imageUrl}
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
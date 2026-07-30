import {
  Avatar,
  TableCell,
  TableRow,
  IconButton,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import StatusChip from "./StatusChip";

function EmployeeRow({ employee }) {
  return (
    <TableRow hover>

      <TableCell>{employee.id}</TableCell>

      <TableCell>
        <Avatar src={employee.photo} />
      </TableCell>

      <TableCell>{employee.name}</TableCell>

      <TableCell>{employee.department}</TableCell>

      <TableCell>{employee.position}</TableCell>

      <TableCell>{employee.email}</TableCell>

      <TableCell>{employee.phone}</TableCell>

      <TableCell>
        <StatusChip status={employee.status} />
      </TableCell>

      <TableCell>

        <IconButton color="primary">
          <EditIcon />
        </IconButton>

        <IconButton color="error">
          <DeleteIcon />
        </IconButton>

      </TableCell>

    </TableRow>
  );
}

export default EmployeeRow;
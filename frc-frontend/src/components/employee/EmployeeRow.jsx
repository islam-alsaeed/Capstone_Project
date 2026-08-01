import {
  Avatar,
  TableCell,
  TableRow,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import StatusChip from "./StatusChip";

function EmployeeRow({ employee }) {
  const navigate = useNavigate();
  return (
    <TableRow hover onClick={() => navigate(`/employees/${employee.id}`)} style={{ cursor: "pointer" }}>

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
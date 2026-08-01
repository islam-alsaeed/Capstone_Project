import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Typography,
} from "@mui/material";

import {
  Add,
  FilterList,
} from "@mui/icons-material";

import "./EmployeeHeader.css";

function EmployeeHeader() {
  const navigate = useNavigate();

  return (
    <Box className="employee-header">
      <Box>
        <Typography component="h1">
          Employees
        </Typography>

        <Typography component="p">
          Manage all registered employees
        </Typography>
      </Box>

      <Box className="employee-header-actions">
        <Button
          variant="outlined"
          startIcon={<FilterList />}
        >
          Filters
        </Button>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/employees/add")}
        >
          Add Employee
        </Button>
      </Box>
    </Box>
  );
}

export default EmployeeHeader;
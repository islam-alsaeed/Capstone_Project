import { Box } from "@mui/material";

import EmployeeHeader from "../components/employee/EmployeeHeader";
import EmployeeSearch from "../components/employee/EmployeeSearch";
import EmployeeTable from "../components/employee/EmployeeTable";

import "./Employees.css";

function Employees() {
  return (
    <Box className="employees-page">
      <EmployeeHeader />
      <EmployeeSearch />
      <EmployeeTable />
    </Box>
  );
}

export default Employees;
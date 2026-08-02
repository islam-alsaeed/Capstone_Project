import { useEffect, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import axios from "axios";

import EmployeeHeader from "../components/employee/EmployeeHeader";
import EmployeeSearch from "../components/employee/EmployeeSearch";
import EmployeeTable from "../components/employee/EmployeeTable";

import "./Employees.css";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEmployees = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/employees"
      );

      setEmployees(response.data.employees || []);
    } catch (requestError) {
      console.error(
        "Unable to load employees:",
        requestError.response?.data || requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return employees;
    }

    return employees.filter((employee) =>
      [
        employee.employeeCode,
        employee.fullName,
        employee.department,
        employee.designation,
        employee.email,
        employee.phone,
        employee.status,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      )
    );
  }, [employees, search]);

  return (
    <Box className="employees-page">
      <EmployeeHeader
        employeeCount={filteredEmployees.length}
      />

      <EmployeeSearch
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
      />

      {loading && (
        <Box
          sx={{
            minHeight: 260,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Box
          sx={{
            padding: 3,
            borderRadius: 2,
            backgroundColor: "#ffffff",
          }}
        >
          <Typography color="error">
            {error}
          </Typography>
        </Box>
      )}

      {!loading && !error && (
        <EmployeeTable
          employees={filteredEmployees}
          onEmployeeDeleted={loadEmployees}
        />
      )}
    </Box>
  );
}

export default Employees;
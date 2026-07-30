import EmployeeTable from "../components/EmployeeTable";

import {
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";

import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";

function Employees() {
  return (
    <Paper
      sx={{
        padding: 3,
        borderRadius: 3,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <div>
          <Typography variant="h5" fontWeight="bold">
            Employee List
          </Typography>

          <Typography color="gray">
            Total 3 employees found
          </Typography>
        </div>

        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
          >
            Filters
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Employee
          </Button>
        </Box>
      </Box>

      <EmployeeTable />
    </Paper>
  );
}

export default Employees;
import { Box, Button, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";

function EmployeeHeader() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight="bold">
          Employee List
        </Typography>

        <Typography color="text.secondary">
          Manage all registered employees
        </Typography>
      </Box>

      <Box display="flex" gap={2}>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
          }}
        >
          Filters
        </Button>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
          }}
        >
          Add Employee
        </Button>
      </Box>
    </Box>
  );
}

export default EmployeeHeader;
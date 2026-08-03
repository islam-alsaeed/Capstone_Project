import {
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

function EmployeeDashboard() {
  const {
    user,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f8fc",
        p: 4,
      }}
    >
      <Paper
        sx={{
          maxWidth: 700,
          mx: "auto",
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          Welcome, {user?.fullName}
        </Typography>

        <Typography sx={{ mt: 2 }}>
          Employee code:{" "}
          {user?.employeeCode || "Not available"}
        </Typography>

        <Typography>
          Email: {user?.email}
        </Typography>

        <Typography>
          Role: {user?.role}
        </Typography>

        <Typography>
          Face registered:{" "}
          {user?.faceRegistered
            ? "Yes"
            : "No"}
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Paper>
    </Box>
  );
}

export default EmployeeDashboard;
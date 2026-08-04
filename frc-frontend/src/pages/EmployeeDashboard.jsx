import {
  AccessTimeOutlined,
  BadgeOutlined,
  CalendarMonthOutlined,
  CheckCircleOutlineOutlined,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Chip,
  Paper,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

import "./EmployeeDashboard.css";

function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box className="employee-dashboard">
      <Box className="employee-dashboard-heading">
        <Box>
          <Typography component="h1">
            Welcome back, {user?.fullName || "Employee"}
          </Typography>

          <Typography component="p">
            Manage your attendance and review your work activity.
          </Typography>
        </Box>

        <Chip
          icon={<CheckCircleOutlineOutlined />}
          label="Account Active"
          color="success"
          variant="outlined"
        />
      </Box>

      <Box className="employee-summary-grid">
        <Paper className="employee-summary-card">
          <BadgeOutlined />

          <Box>
            <span>Employee Code</span>
            <strong>
              {user?.employeeCode || "Not available"}
            </strong>
          </Box>
        </Paper>

        <Paper className="employee-summary-card">
          <AccessTimeOutlined />

          <Box>
            <span>Today's Status</span>
            <strong>Not Checked In</strong>
          </Box>
        </Paper>

        <Paper className="employee-summary-card">
          <CalendarMonthOutlined />

          <Box>
            <span>Face Registration</span>
            <strong>
              {user?.faceRegistered
                ? "Registered"
                : "Not Registered"}
            </strong>
          </Box>
        </Paper>
      </Box>

      <Box className="employee-dashboard-content">
        <Paper className="employee-clock-card">
          <Box className="employee-clock-icon">
            <AccessTimeOutlined />
          </Box>

          <Typography component="h2">
            Record Attendance
          </Typography>

          <Typography component="p">
            Clock in, start or end a break, record lunch,
            and clock out using face verification.
          </Typography>

          <Button
            variant="contained"
            size="large"
            disabled={!user?.faceRegistered}
            onClick={() => navigate("/employee/clock")}
          >
            Open Attendance Clock
          </Button>
        </Paper>

        <Paper className="employee-profile-card">
          <Typography component="h2">
            My Information
          </Typography>

          <InformationRow
            label="Full name"
            value={user?.fullName}
          />

          <InformationRow
            label="Employee code"
            value={user?.employeeCode}
          />

          <InformationRow
            label="Email"
            value={user?.email}
          />

          <InformationRow
            label="Role"
            value={user?.role}
          />
        </Paper>
      </Box>
    </Box>
  );
}

function InformationRow({ label, value }) {
  return (
    <Box className="employee-profile-row">
      <Typography component="span">
        {label}
      </Typography>

      <Typography component="strong">
        {value || "Not available"}
      </Typography>
    </Box>
  );
}

export default EmployeeDashboard;
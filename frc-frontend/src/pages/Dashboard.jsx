import {
  AccessTimeOutlined,
  BadgeOutlined,
  CheckCircleOutlineOutlined,
  GroupsOutlined,
  LogoutOutlined,
  PersonOffOutlined,
  RefreshOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import apiClient from "../api/apiClient";

import "./Dashboard.css";

function Dashboard() {
  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadDashboard = useCallback(
    async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiClient.get(
          "/employees/dashboard-summary"
        );

        setDashboardData(response.data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const recentEvents =
    dashboardData?.recentEvents || [];

  return (
    <Box className="admin-dashboard">
      <Box className="admin-dashboard-header">
        <Box>
          <Typography component="h1">
            Dashboard
          </Typography>

          <Typography component="p">
            Monitor employees and today&apos;s
            attendance activity.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshOutlined />}
          onClick={loadDashboard}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {loading && !dashboardData ? (
        <Box className="admin-dashboard-loading">
          <CircularProgress />

          <Typography>
            Loading dashboard...
          </Typography>
        </Box>
      ) : (
        <>
          <Box className="admin-summary-grid">
            <SummaryCard
              icon={<GroupsOutlined />}
              label="Total Employees"
              value={
                dashboardData?.totalEmployees ?? 0
              }
            />

            <SummaryCard
              icon={
                <CheckCircleOutlineOutlined />
              }
              label="Active Employees"
              value={
                dashboardData?.activeEmployees ?? 0
              }
            />

            <SummaryCard
              icon={<AccessTimeOutlined />}
              label="Currently Clocked In"
              value={
                dashboardData
                  ?.currentlyClockedIn ?? 0
              }
            />

            <SummaryCard
              icon={<LogoutOutlined />}
              label="Clocked Out Today"
              value={
                dashboardData
                  ?.clockedOutToday ?? 0
              }
            />
          </Box>

          <Box className="admin-secondary-grid">
            <Paper className="admin-secondary-card">
              <Box className="admin-secondary-icon">
                <BadgeOutlined />
              </Box>

              <Box>
                <Typography component="span">
                  Faces Registered
                </Typography>

                <Typography component="strong">
                  {dashboardData
                    ?.faceRegisteredEmployees ?? 0}
                </Typography>
              </Box>
            </Paper>

            <Paper className="admin-secondary-card">
              <Box className="admin-secondary-icon">
                <PersonOffOutlined />
              </Box>

              <Box>
                <Typography component="span">
                  Inactive Employees
                </Typography>

                <Typography component="strong">
                  {dashboardData
                    ?.inactiveEmployees ?? 0}
                </Typography>
              </Box>
            </Paper>
          </Box>

          <Paper className="recent-activity-card">
            <Box className="recent-activity-heading">
              <Box>
                <Typography component="h2">
                  Recent Attendance Activity
                </Typography>

                <Typography component="p">
                  Latest face-verified attendance
                  events.
                </Typography>
              </Box>

              <Chip
                label={`${recentEvents.length} events`}
                variant="outlined"
                color="primary"
              />
            </Box>

            {recentEvents.length === 0 ? (
              <Box className="recent-activity-empty">
                <AccessTimeOutlined />

                <Typography component="h3">
                  No attendance activity
                </Typography>

                <Typography component="p">
                  Employee attendance events will
                  appear here.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table className="recent-activity-table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Code</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Event</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Verification</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {recentEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <Box className="activity-employee">
                            <Box className="activity-avatar">
                              {getInitials(
                                event.fullName
                              )}
                            </Box>

                            <Box>
                              <strong>
                                {event.fullName}
                              </strong>

                              <span>
                                {event.designation ||
                                  "Employee"}
                              </span>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          {event.employeeCode}
                        </TableCell>

                        <TableCell>
                          {event.department ||
                            "Not assigned"}
                        </TableCell>

                        <TableCell>
                          <EventChip
                            eventType={
                              event.eventType
                            }
                          />
                        </TableCell>

                        <TableCell>
                          {formatDateTime(
                            event.eventTime
                          )}
                        </TableCell>

                        <TableCell>
                          {event.verificationMethod ||
                            "FACE"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}) {
  return (
    <Paper className="admin-summary-card">
      <Box className="admin-summary-icon">
        {icon}
      </Box>

      <Box>
        <Typography component="span">
          {label}
        </Typography>

        <Typography component="strong">
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}

function EventChip({ eventType }) {
  const eventSettings = {
    CLOCKED_IN: {
      label: "Clocked In",
      color: "success",
    },
    CLOCKED_OUT: {
      label: "Clocked Out",
      color: "default",
    },
    BREAK_START: {
      label: "Break Started",
      color: "warning",
    },
    BREAK_END: {
      label: "Break Ended",
      color: "success",
    },
    LUNCH_START: {
      label: "Lunch Started",
      color: "warning",
    },
    LUNCH_END: {
      label: "Lunch Ended",
      color: "success",
    },
  };

  const settings =
    eventSettings[eventType] || {
      label: eventType || "Unknown",
      color: "default",
    };

  return (
    <Chip
      size="small"
      label={settings.label}
      color={settings.color}
      variant="outlined"
    />
  );
}

function getInitials(fullName) {
  return String(fullName || "Employee")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDateTime(value) {
  if (!value) {
    return "Not available";
  }

  return new Date(value).toLocaleString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

export default Dashboard;
import {
  AccessTimeOutlined,
  ArrowBackOutlined,
  CalendarMonthOutlined,
  CheckCircleOutlineOutlined,
  CoffeeOutlined,
  FastfoodOutlined,
  RefreshOutlined,
  ScheduleOutlined,
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

import { useNavigate } from "react-router-dom";

import apiClient from "../api/apiClient";

import "./MyAttendance.css";

function MyAttendance() {
  const navigate = useNavigate();

  const [history, setHistory] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadAttendanceHistory = useCallback(
    async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiClient.get(
          "/attendance/my-history"
        );

        setHistory(response.data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load attendance history."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadAttendanceHistory();
  }, [loadAttendanceHistory]);

  const records = history?.records || [];
  const summary = history?.summary || {};

  return (
    <Box className="my-attendance-page">
      <Box className="my-attendance-header">
        <Box>
          <Typography component="h1">
            My Attendance
          </Typography>

          <Typography component="p">
            Review your clock-ins, breaks, lunch
            periods, and completed workdays.
          </Typography>
        </Box>

        <Box className="my-attendance-header-actions">
          <Button
            variant="outlined"
            startIcon={<RefreshOutlined />}
            onClick={loadAttendanceHistory}
            disabled={loading}
          >
            Refresh
          </Button>

          <Button
            variant="outlined"
            startIcon={<ArrowBackOutlined />}
            onClick={() =>
              navigate("/employee/dashboard")
            }
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      <Box className="attendance-summary-grid">
        <SummaryCard
          icon={<CalendarMonthOutlined />}
          label="Attendance Days"
          value={history?.recordCount ?? 0}
        />

        <SummaryCard
          icon={<CheckCircleOutlineOutlined />}
          label="Completed Days"
          value={summary.completedDays ?? 0}
        />

        <SummaryCard
          icon={<ScheduleOutlined />}
          label="Total Worked"
          value={formatDuration(
            summary.workedMinutes
          )}
        />

        <SummaryCard
          icon={<AccessTimeOutlined />}
          label="Date Range"
          value={formatDateRange(
            history?.startDate,
            history?.endDate
          )}
        />
      </Box>

      <Paper className="attendance-history-card">
        <Box className="attendance-history-heading">
          <Box>
            <Typography component="h2">
              Attendance History
            </Typography>

            <Typography component="p">
              Showing your most recent attendance
              records.
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Box className="attendance-history-loading">
            <CircularProgress />

            <Typography>
              Loading attendance history...
            </Typography>
          </Box>
        ) : records.length === 0 ? (
          <Box className="attendance-history-empty">
            <CalendarMonthOutlined />

            <Typography component="h3">
              No attendance records
            </Typography>

            <Typography component="p">
              Your recorded attendance events will
              appear here.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table className="attendance-history-table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Clocked In</TableCell>
                  <TableCell>Clocked Out</TableCell>
                  <TableCell>Break</TableCell>
                  <TableCell>Lunch</TableCell>
                  <TableCell>Worked</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.date}>
                    <TableCell>
                      <strong>
                        {formatDate(record.date)}
                      </strong>
                    </TableCell>

                    <TableCell>
                      {formatTime(
                        record.clockedInTime
                      )}
                    </TableCell>

                    <TableCell>
                      {formatTime(
                        record.clockedOutTime
                      )}
                    </TableCell>

                    <TableCell>
                      <DurationValue
                        icon={<CoffeeOutlined />}
                        minutes={
                          record.breakMinutes
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <DurationValue
                        icon={<FastfoodOutlined />}
                        minutes={
                          record.lunchMinutes
                        }
                      />
                    </TableCell>

                    <TableCell>
                      {record.workedMinutes == null
                        ? "In progress"
                        : formatDuration(
                            record.workedMinutes
                          )}
                    </TableCell>

                    <TableCell>
                      <StatusChip
                        status={record.status}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}) {
  return (
    <Paper className="attendance-summary-card">
      <Box className="attendance-summary-icon">
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

function DurationValue({
  icon,
  minutes,
}) {
  return (
    <Box className="attendance-duration">
      {icon}

      <span>
        {formatDuration(minutes)}
      </span>
    </Box>
  );
}

function StatusChip({ status }) {
  const chipProperties = {
    Completed: {
      label: "Completed",
      color: "success",
    },
    "In Progress": {
      label: "In Progress",
      color: "warning",
    },
    Incomplete: {
      label: "Incomplete",
      color: "error",
    },
  };

  const properties =
    chipProperties[status] || {
      label: status || "Unknown",
      color: "default",
    };

  return (
    <Chip
      size="small"
      label={properties.label}
      color={properties.color}
      variant="outlined"
    />
  );
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  return new Date(
    `${value}T00:00:00`
  ).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

function formatDuration(minutes) {
  const totalMinutes = Number(minutes || 0);

  if (totalMinutes <= 0) {
    return "0 min";
  }

  const hours = Math.floor(
    totalMinutes / 60
  );

  const remainingMinutes =
    totalMinutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

function formatDateRange(
  startDate,
  endDate
) {
  if (!startDate || !endDate) {
    return "Not available";
  }

  const start = new Date(
    `${startDate}T00:00:00`
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const end = new Date(
    `${endDate}T00:00:00`
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${start} – ${end}`;
}

export default MyAttendance;
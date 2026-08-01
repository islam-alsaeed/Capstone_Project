import { useNavigate, useParams } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Typography,
} from "@mui/material";

import {
  AccessTimeOutlined,
  ArrowBackOutlined,
  BadgeOutlined,
  CameraAltOutlined,
  EditOutlined,
  EmailOutlined,
  PhoneOutlined,
} from "@mui/icons-material";

import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import WorkOutlineOutlined from "@mui/icons-material/WorkOutlineOutlined";

import "./EmployeeDetails.css";
import employees from "../data/employees";

function EmployeeDetails() {
  const navigate = useNavigate();
  const { employeeId } = useParams();

  const employee = employees.find(
    (item) => item.id === employeeId
  );

  if (!employee) {
    return (
      <Box className="employee-details-page">
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Employee not found
          </Typography>

          <Typography sx={{ mt: 1 }}>
            No employee exists with ID: {employeeId}
          </Typography>

          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => navigate("/employees")}
          >
            Back to Employees
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className="employee-details-page">
      <Box className="employee-details-topbar">
        <Button
          startIcon={<ArrowBackOutlined />}
          onClick={() => navigate("/employees")}
        >
          Back to Employees
        </Button>

        <Button
          variant="contained"
          startIcon={<EditOutlined />}
          onClick={() =>
            navigate(`/employees/${employee.id}/edit`)
          }
        >
          Edit Employee
        </Button>
      </Box>

      <Box className="employee-details-grid">
        <Paper className="employee-profile-card">
          <Avatar
            src={employee.photo}
            alt={employee.name}
            className="employee-details-avatar"
          />

          <Typography component="h1">
            {employee.name}
          </Typography>

          <Typography className="employee-number">
            {employee.id}
          </Typography>

          <Chip
            label={employee.status}
            className={
              employee.status === "Active"
                ? "employee-active-chip"
                : "employee-inactive-chip"
            }
          />

          <Divider />

          <Box className="employee-quick-information">
            <InformationRow
              icon={<WorkOutlineOutlined />}
              label="Department"
              value={employee.department}
            />

            <InformationRow
              icon={<BadgeOutlined />}
              label="Designation"
              value={employee.designation}
            />

            <InformationRow
              icon={<EmailOutlined />}
              label="Email"
              value={employee.email}
            />

            <InformationRow
              icon={<PhoneOutlined />}
              label="Phone"
              value={employee.phone}
            />
          </Box>
        </Paper>

        <Box className="employee-details-content">
          <Paper className="details-section-card">
            <Typography component="h2">
              Employee Information
            </Typography>

            <Box className="information-grid">
              <InformationField
                label="Employee ID"
                value={employee.id}
              />

              <InformationField
                label="Full Name"
                value={employee.name}
              />

              <InformationField
                label="Date of Birth"
                value={employee.dateOfBirth || "Not provided"}
              />

              <InformationField
                label="Date of Joining"
                value={employee.joiningDate || "Not provided"}
              />

              <InformationField
                label="Employee Type"
                value={employee.employeeType || "Not provided"}
              />

              <InformationField
                label="Status"
                value={employee.status}
              />

              <Box className="full-information-field">
                <InformationField
                  label="Address"
                  value={employee.address || "Not provided"}
                />
              </Box>
            </Box>
          </Paper>

          <Paper className="details-section-card">
            <Box className="details-section-heading">
              <Box>
                <Typography component="h2">
                  Face Recognition
                </Typography>

                <Typography component="p">
                  Employee face registration information
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<CameraAltOutlined />}
                onClick={() =>
                  navigate(
                    `/employees/${employee.id}/face-registration`
                  )
                }
              >
                {employee.faceRegistered
                  ? "Update Face"
                  : "Register Face"}
              </Button>
            </Box>

            <Box className="face-registration-status">
              <Box className="face-status-icon">
                <CheckCircleOutlineOutlined />
              </Box>

              <Box>
                <Typography component="h3">
                  {employee.faceRegistered
                    ? "Face Registered"
                    : "Face Not Registered"}
                </Typography>

                <Typography component="p">
                  Registration date:{" "}
                  {employee.faceRegisteredDate || "Not available"}
                </Typography>
              </Box>
            </Box>

            <Box className="face-information-grid">
              <InformationField
                label="Registration Status"
                value={
                  employee.faceRegistered
                    ? "Registered"
                    : "Not Registered"
                }
              />

              <InformationField
                label="Last Recognition"
                value={
                  employee.lastRecognition || "No recognition yet"
                }
              />
            </Box>
          </Paper>

          <Paper className="details-section-card">
            <Box className="details-section-heading">
              <Box>
                <Typography component="h2">
                  Recent Attendance
                </Typography>

                <Typography component="p">
                  Latest employee attendance activity
                </Typography>
              </Box>

              <Button
                startIcon={<AccessTimeOutlined />}
                onClick={() =>
                  navigate(
                    `/attendance?employee=${employee.id}`
                  )
                }
              >
                View History
              </Button>
            </Box>

            <Box className="attendance-summary">
              <AttendanceItem
                label="Check In"
                value={employee.checkIn || "Not available"}
                status={employee.checkInStatus || "No record"}
              />

              <AttendanceItem
                label="Lunch Break"
                value={employee.lunchBreak || "Not available"}
                status={employee.lunchStatus || "No record"}
              />

              <AttendanceItem
                label="Check Out"
                value={employee.checkOut || "Not available"}
                status={employee.checkOutStatus || "No record"}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

function InformationRow({ icon, label, value }) {
  return (
    <Box className="information-row">
      <Box className="information-row-icon">{icon}</Box>

      <Box>
        <Typography component="span">{label}</Typography>
        <Typography component="strong">{value}</Typography>
      </Box>
    </Box>
  );
}

function InformationField({ label, value }) {
  return (
    <Box className="information-field">
      <Typography component="span">{label}</Typography>
      <Typography component="strong">{value}</Typography>
    </Box>
  );
}

function AttendanceItem({ label, value, status }) {
  return (
    <Box className="attendance-item">
      <Typography component="span">{label}</Typography>
      <Typography component="strong">{value}</Typography>
      <Chip label={status} size="small" />
    </Box>
  );
}

export default EmployeeDetails;
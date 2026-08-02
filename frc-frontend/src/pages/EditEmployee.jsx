import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  ArrowBackOutlined,
  SaveOutlined,
} from "@mui/icons-material";

import "./EditEmployee.css";

const initialForm = {
  fullName: "",
  dateOfBirth: "",
  gender: "",
  department: "",
  designation: "",
  email: "",
  phone: "",
  joiningDate: "",
  employeeType: "",
  address: "",
  status: "Active",
};

function EditEmployee() {
  const navigate = useNavigate();
  const { employeeId } = useParams();

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadEmployee = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/employees/${employeeId}`
        );

        const employee = response.data.employee;

        setFormData({
          fullName: employee.fullName || "",
          dateOfBirth: employee.dateOfBirth || "",
          gender: employee.gender || "",
          department: employee.department || "",
          designation: employee.designation || "",
          email: employee.email || "",
          phone: employee.phone || "",
          joiningDate: employee.joiningDate || "",
          employeeType: employee.employeeType || "",
          address: employee.address || "",
          status: employee.status || "Active",
        });
      } catch (error) {
        console.error(
          "Unable to load employee:",
          error.response?.data || error
        );

        setLoadError(
          error.response?.data?.message ||
            "Unable to load employee."
        );
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, [employeeId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/api/employees/${employeeId}`,
        formData
      );

      alert(response.data.message);

      navigate(`/employees/${employeeId}`);
    } catch (error) {
      console.error(
        "Unable to update employee:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update the employee."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box className="edit-employee-loading">
        <CircularProgress />
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box className="edit-employee-page">
        <Paper className="edit-error-card">
          <Typography component="h1">
            Unable to load employee
          </Typography>

          <Typography component="p">
            {loadError}
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/employees")}
          >
            Back to Employees
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className="edit-employee-page">
      <Box className="edit-employee-header">
        <Box>
          <Typography component="h1">
            Edit Employee
          </Typography>

          <Typography component="p">
            Update information for {employeeId}
          </Typography>
        </Box>

        <Button
          startIcon={<ArrowBackOutlined />}
          onClick={() =>
            navigate(`/employees/${employeeId}`)
          }
        >
          Back to Employee
        </Button>
      </Box>

      <Paper
        component="form"
        className="edit-employee-card"
        onSubmit={handleSubmit}
        noValidate
      >
        <Box className="edit-form-grid">
          <FormField label="Employee ID">
            <TextField
              fullWidth
              value={employeeId}
              disabled
            />
          </FormField>

          <FormField label="Full Name" required>
            <TextField
              fullWidth
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={Boolean(errors.fullName)}
              helperText={errors.fullName}
            />
          </FormField>

          <FormField label="Date of Birth">
            <TextField
              fullWidth
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </FormField>

          <FormField label="Gender">
            <TextField
              fullWidth
              select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              SelectProps={{
                displayEmpty: true,
              }}
            >
              <MenuItem value="">
                Not specified
              </MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </FormField>

          <FormField label="Department" required>
            <TextField
              fullWidth
              select
              name="department"
              value={formData.department}
              onChange={handleChange}
              error={Boolean(errors.department)}
              helperText={errors.department}
            >
              <MenuItem value="Software Development">
                Software Development
              </MenuItem>

              <MenuItem value="IT Support">
                IT Support
              </MenuItem>

              <MenuItem value="Human Resources">
                Human Resources
              </MenuItem>

              <MenuItem value="Finance">
                Finance
              </MenuItem>

              <MenuItem value="Security">
                Security
              </MenuItem>
            </TextField>
          </FormField>

          <FormField label="Designation" required>
            <TextField
              fullWidth
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              error={Boolean(errors.designation)}
              helperText={errors.designation}
            />
          </FormField>

          <FormField label="Email" required>
            <TextField
              fullWidth
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
          </FormField>

          <FormField label="Phone Number">
            <TextField
              fullWidth
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </FormField>

          <FormField label="Date of Joining">
            <TextField
              fullWidth
              name="joiningDate"
              type="date"
              value={formData.joiningDate}
              onChange={handleChange}
            />
          </FormField>

          <FormField label="Employee Type">
            <TextField
              fullWidth
              select
              name="employeeType"
              value={formData.employeeType}
              onChange={handleChange}
            >
              <MenuItem value="">
                Not specified
              </MenuItem>
              <MenuItem value="Full Time">
                Full Time
              </MenuItem>
              <MenuItem value="Part Time">
                Part Time
              </MenuItem>
              <MenuItem value="Contract">
                Contract
              </MenuItem>
              <MenuItem value="Intern">
                Intern
              </MenuItem>
            </TextField>
          </FormField>

          <FormField label="Status">
            <TextField
              fullWidth
              select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="Active">
                Active
              </MenuItem>
              <MenuItem value="Inactive">
                Inactive
              </MenuItem>
            </TextField>
          </FormField>

          <Box className="edit-full-width">
            <FormField label="Address">
              <TextField
                fullWidth
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                minRows={2}
              />
            </FormField>
          </Box>
        </Box>

        <Box className="edit-form-actions">
          <Button
            type="button"
            variant="outlined"
            onClick={() =>
              navigate(`/employees/${employeeId}`)
            }
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveOutlined />}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

function FormField({
  label,
  required = false,
  children,
}) {
  return (
    <Box className="edit-form-field">
      <Typography component="label">
        {label}

        {required && (
          <span className="edit-required-marker">
            {" "}*
          </span>
        )}
      </Typography>

      {children}
    </Box>
  );
}

export default EditEmployee;
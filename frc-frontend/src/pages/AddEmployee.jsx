import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import {
  AddAPhotoOutlined,
  BadgeOutlined,
  CameraAltOutlined,
  CheckCircleOutlineOutlined,
  ClearOutlined,
  CloudUploadOutlined,
  ImageOutlined,
  SaveOutlined,
} from "@mui/icons-material";
// import CheckCircleOutlneIcon from "@mui/icons-material/CheckCircleOutline";


import "./AddEmployee.css";

const initialForm = {
  employeeId: "",
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
};

function AddEmployee() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(initialForm);
  const [imagePreview, setImagePreview] = useState("");
  const [imageDetails, setImageDetails] = useState(null);
  const [errors, setErrors] = useState({});

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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("The image must be smaller than 2 MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setImagePreview((previousPreview) => {
      if (previousPreview) {
        URL.revokeObjectURL(previousPreview);
      }

      return previewUrl;
    });

    setImageDetails({
      file,
      quality: "Good",
      size: formatFileSize(file.size),
      format: file.type.split("/")[1]?.toUpperCase() || "IMAGE",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = "Employee ID is required";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const employeePayload = {
      ...formData,
      image: imageDetails?.file || null,
    };

    console.log("Employee submitted:", employeePayload);

    // Later, replace the console.log with your Flask API call.
    // Example:
    //
    // const requestData = new FormData();
    // Object.entries(formData).forEach(([key, value]) => {
    //   requestData.append(key, value);
    // });
    //
    // if (imageDetails?.file) {
    //   requestData.append("image", imageDetails.file);
    // }
    //
    // await axios.post(
    //   "http://localhost:5000/api/employees",
    //   requestData
    // );

    alert("Employee saved successfully.");
  };

  const handleClear = () => {
    setFormData(initialForm);
    setErrors({});
    setImageDetails(null);

    setImagePreview((previousPreview) => {
      if (previousPreview) {
        URL.revokeObjectURL(previousPreview);
      }

      return "";
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCaptureImage = () => {
    // This button will later open your webcam component.
    alert("The camera capture page will be connected in the next step.");
  };

  return (
    <Box className="add-employee-page">
      <Box className="add-employee-heading">
        <Typography component="h1">
          Register New Employee
        </Typography>

        <Typography component="p">
          Add employee details and capture image
        </Typography>
      </Box>

      <Box
        component="form"
        className="employee-page-grid"
        onSubmit={handleSubmit}
        noValidate
      >
        <section className="employee-card employee-information-card">
          <SectionTitle
            icon={<BadgeOutlined />}
            title="Employee Information"
          />

          <Box className="employee-form-grid">
            <FormField label="Employee ID" required>
              <TextField
                fullWidth
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="EMP2025001"
                error={Boolean(errors.employeeId)}
                helperText={errors.employeeId}
              />
            </FormField>

            <FormField label="Full Name" required>
              <TextField
                fullWidth
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ayesha Khan"
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
                <MenuItem value="" disabled>
                  Select gender
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
                SelectProps={{
                  displayEmpty: true,
                }}
              >
                <MenuItem value="" disabled>
                  Select department
                </MenuItem>
                <MenuItem value="Software Development">
                  Software Development
                </MenuItem>
                <MenuItem value="IT Support">IT Support</MenuItem>
                <MenuItem value="Human Resources">
                  Human Resources
                </MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Security">Security</MenuItem>
              </TextField>
            </FormField>

            <FormField label="Designation" required>
              <TextField
                fullWidth
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Software Engineer"
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
                placeholder="ayesha.khan@company.com"
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
            </FormField>

            <FormField label="Phone Number">
              <TextField
                fullWidth
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 555 123 4567"
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
                SelectProps={{
                  displayEmpty: true,
                }}
              >
                <MenuItem value="" disabled>
                  Select employee type
                </MenuItem>
                <MenuItem value="Full Time">Full Time</MenuItem>
                <MenuItem value="Part Time">Part Time</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
                <MenuItem value="Intern">Intern</MenuItem>
              </TextField>
            </FormField>

            <Box className="full-width-field">
              <FormField label="Address">
                <TextField
                  fullWidth
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123, Green Avenue, Lahore, Pakistan"
                />
              </FormField>
            </Box>
          </Box>

          <Box className="employee-form-actions">
            <Button
              type="button"
              variant="outlined"
              startIcon={<ClearOutlined />}
              onClick={handleClear}
              className="clear-button"
            >
              Clear
            </Button>

            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveOutlined />}
              className="save-button"
            >
              Save Employee
            </Button>
          </Box>
        </section>

        <aside className="employee-image-column">
          <section className="employee-card image-capture-card">
            <SectionTitle
              icon={<CameraAltOutlined />}
              title="Employee Image"
            />

            <Box
              className={`image-capture-area ${
                imagePreview ? "has-image" : ""
              }`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Selected employee"
                  className="captured-main-image"
                />
              ) : (
                <Box className="capture-placeholder">
                  <AddAPhotoOutlined />

                  <Typography component="p">
                    Capture or upload employee image
                  </Typography>

                  <Typography component="span">
                    JPG or PNG, maximum 2 MB
                  </Typography>
                </Box>
              )}
            </Box>

            <Box className="image-action-buttons">
              <Button
                type="button"
                variant="outlined"
                startIcon={<CameraAltOutlined />}
                onClick={handleCaptureImage}
              >
                Capture Image
              </Button>

              <Button
                type="button"
                variant="outlined"
                startIcon={<CloudUploadOutlined />}
                onClick={handleUploadClick}
              >
                Upload Image
              </Button>
            </Box>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              hidden
              onChange={handleImageChange}
            />
          </section>

          <section className="employee-card image-preview-card">
            <SectionTitle
              icon={<ImageOutlined />}
              title="Image Preview"
            />

            {imagePreview ? (
              <>
                <Box className="preview-information">
                  <Box className="preview-avatar-wrapper">
                    <img
                      src={imagePreview}
                      alt="Employee preview"
                      className="preview-avatar"
                    />
                  </Box>

                  <Box className="preview-details">
                    <PreviewRow
                      label="Image Quality"
                      value={imageDetails?.quality}
                      success
                    />

                    <PreviewRow
                      label="Image Size"
                      value={imageDetails?.size}
                    />

                    <PreviewRow
                      label="Format"
                      value={imageDetails?.format}
                    />
                  </Box>
                </Box>

                <Box className="image-success-message">
                  <CheckCircleOutline />
                  <span>Image captured successfully</span>
                </Box>
              </>
            ) : (
              <Box className="empty-preview">
                <ImageOutlined />

                <Typography component="p">
                  No employee image selected
                </Typography>

                <Typography component="span">
                  Capture or upload an image to see its preview.
                </Typography>
              </Box>
            )}
          </section>
        </aside>
      </Box>

      <Box className="mobile-page-actions">
        <Button
          type="button"
          variant="outlined"
          onClick={() => navigate("/employees")}
        >
          Cancel
        </Button>

        <Button
          type="button"
          variant="contained"
          startIcon={<SaveOutlined />}
          onClick={handleSubmit}
        >
          Save Employee
        </Button>
      </Box>

      <Typography className="employee-page-footer">
        © 2026 FRC – Facial recognition control system
      </Typography>
    </Box>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <Box className="section-title">
      {icon}
      <Typography component="h2">{title}</Typography>
    </Box>
  );
}

function FormField({ label, required = false, children }) {
  return (
    <Box className="form-field">
      <Typography component="label">
        {label}
        {required && <span className="required-marker"> *</span>}
      </Typography>

      {children}
    </Box>
  );
}

function PreviewRow({ label, value, success = false }) {
  return (
    <Box className="preview-row">
      <Typography component="span">{label}</Typography>

      <Typography
        component="strong"
        className={success ? "preview-success-value" : ""}
      >
        {value}
      </Typography>
    </Box>
  );
}

function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default AddEmployee;
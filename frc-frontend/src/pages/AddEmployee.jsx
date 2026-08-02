import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

import "./AddEmployee.css";
import axios from "axios";

const initialForm = {
  // employeeId: "",
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

  // File upload reference
  const fileInputRef = useRef(null);

  // Webcam references
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraStreamRef = useRef(null);

  // Employee form state
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  // Employee image state
  const [imagePreview, setImagePreview] = useState("");
  const [imageDetails, setImageDetails] = useState(null);

  // Camera state
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");

  // Submission state
  const [saving, setSaving] = useState(false);

  /**
   * Stop the camera when the user leaves this page.
   */
  useEffect(() => {
    return () => {
      stopCamera();

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  /**
   * Update employee form values.
   */
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

  /**
   * Open the hidden image file input.
   */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handle an image selected from the computer.
   */
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a JPG or PNG image.");
      event.target.value = "";
      return;
    }

    const maximumSize = 2 * 1024 * 1024;

    if (file.size > maximumSize) {
      alert("The image must be smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    createImagePreview(file);
  };

  /**
   * Create an image preview and save its file information.
   */
  const createImagePreview = (file) => {
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
      format: getImageFormat(file.type),
    });
  };

  /**
   * Open the browser webcam.
   */
  const handleCaptureImage = async () => {
    setCameraOpen(true);
    setCameraError("");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access is not supported by this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: {
            ideal: 1280,
          },
          height: {
            ideal: 720,
          },
          facingMode: "user",
        },
        audio: false,
      });

      cameraStreamRef.current = stream;

      /*
       * The dialog needs a moment to render the video element.
       */
      window.setTimeout(async () => {
        if (!videoRef.current) {
          return;
        }

        videoRef.current.srcObject = stream;

        try {
          await videoRef.current.play();
          setCameraActive(true);
        } catch (error) {
          console.error("Unable to play camera stream:", error);
          setCameraError("Unable to start the camera preview.");
        }
      }, 100);
    } catch (error) {
      console.error("Unable to access camera:", error);

      setCameraError(
        "Unable to access the camera. Allow camera permission in your browser."
      );
    }
  };

  /**
   * Stop all active camera tracks.
   */
  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      cameraStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
  };

  /**
   * Close the camera dialog.
   */
  const closeCamera = () => {
    stopCamera();
    setCameraOpen(false);
    setCameraError("");
  };

  /**
   * Capture one webcam frame and convert it to a File.
   */
  const captureFace = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !cameraActive) {
      setCameraError("The camera is not ready.");
      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) {
      setCameraError("Wait for the camera to finish loading.");
      return;
    }

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      setCameraError("Unable to capture the image.");
      return;
    }

    /*
     * Flip the canvas so the captured image matches the
     * mirrored webcam preview.
     */
    context.save();
    context.translate(width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, width, height);
    context.restore();

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError("Unable to create the captured image.");
          return;
        }

        const filename = `employee-face-${Date.now()}.jpg`;

        const capturedFile = new File([blob], filename, {
          type: "image/jpeg",
        });

        createImagePreview(capturedFile);
        closeCamera();
      },
      "image/jpeg",
      0.92
    );
  };

  /**
   * Validate required employee fields.
   */
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

  /**
   * Submit employee information and face image together.
   */
  const handleSubmit = async (event) => {
    event?.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!imageDetails?.file) {
      alert("Please capture or upload the employee face image.");
      return;
    }

    setSaving(true);

    try {
      const requestData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        requestData.append(key, value);
      });

      requestData.append(
        "face_image",
        imageDetails.file
      );

      const response = await axios.post(
        "http://127.0.0.1:5000/api/employees",
        requestData
      );

      const createdEmployee = response.data.employee;

      alert(
        `Employee created successfully: ${createdEmployee.employeeCode}`
      );

      navigate(
        `/employees/${createdEmployee.employeeCode}`
      );
    } catch (error) {
      console.error(
        "Unable to save employee:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
        "Unable to save the employee."
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * Clear the complete form and image.
   */
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
            {/* <FormField label="Employee ID" required>
              <TextField
                fullWidth
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="EMP2025001"
                error={Boolean(errors.employeeId)}
                helperText={errors.employeeId}
              />
            </FormField> */}

            {/* {false&&<FormField label="Employee ID">
              <TextField
                fullWidth
                value="Generated automatically after saving"
                disabled
                helperText="Example: EMP2026001"
              />
            </FormField>} */}

            <FormField label="Full Name" required>
              <TextField
                fullWidth
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
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
                selectprops={{
                  displayEmpty: true,
                }}
              >
                <MenuItem value="" disabled>
                  Select gender
                </MenuItem>

                <MenuItem value="Male">
                  Male
                </MenuItem>

                <MenuItem value="Female">
                  Female
                </MenuItem>

                <MenuItem value="Other">
                  Other
                </MenuItem>
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
                selectprops={{
                  displayEmpty: true,
                }}
              >
                <MenuItem value="" disabled>
                  Select department
                </MenuItem>

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
                placeholder="john.doe@company.com"
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
                selectprops={{
                  displayEmpty: true,
                }}
              >
                <MenuItem value="" disabled>
                  Select employee type
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

            <Box className="full-width-field">
              <FormField label="Address">
                <TextField
                  fullWidth
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123, Green Avenue, Cario, Egypt"
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
              disabled={saving}
            >
              Clear
            </Button>

            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveOutlined />}
              className="save-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Employee"}
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
              className={`image-capture-area ${imagePreview ? "has-image" : ""
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
                  <CheckCircleOutlineOutlined />
                  <span>Face image captured successfully</span>
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
          disabled={saving}
        >
          Cancel
        </Button>

        <Button
          type="button"
          variant="contained"
          startIcon={<SaveOutlined />}
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Employee"}
        </Button>
      </Box>

      <Typography className="employee-page-footer">
        © 2026 FRC – Facial Recognition Control System
      </Typography>

      {/* Webcam capture dialog */}
      <Dialog
        open={cameraOpen}
        onClose={closeCamera}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Capture Employee Face
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              minHeight: 460,
              overflow: "hidden",
              borderRadius: 2,
              background: "#111827",
            }}
          >
            <video
              ref={videoRef}
              playsInline
              muted
              style={{
                display: cameraActive ? "block" : "none",
                width: "100%",
                height: "460px",
                objectFit: "cover",
                transform: "scaleX(-1)",
              }}
            />

            {!cameraActive && (
              <Box
                sx={{
                  minHeight: 460,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  padding: 3,
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                <CameraAltOutlined
                  sx={{
                    fontSize: 70,
                    color: "#9ca3af",
                  }}
                />

                <Typography>
                  {cameraError || "Starting camera..."}
                </Typography>
              </Box>
            )}

            {cameraActive && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <Box
                  sx={{
                    width: 240,
                    height: 320,
                    border: "3px solid #2196f3",
                    borderRadius: "50%",
                    boxShadow:
                      "0 0 0 9999px rgba(0, 0, 0, 0.18)",
                  }}
                />
              </Box>
            )}
          </Box>

          <canvas ref={canvasRef} hidden />

          {cameraError && (
            <Typography
              color="error"
              sx={{
                mt: 2,
              }}
            >
              {cameraError}
            </Typography>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <Button
            type="button"
            onClick={closeCamera}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="contained"
            startIcon={<CameraAltOutlined />}
            disabled={!cameraActive}
            onClick={captureFace}
          >
            Capture Face
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <Box className="section-title">
      {icon}

      <Typography component="h2">
        {title}
      </Typography>
    </Box>
  );
}

function FormField({
  label,
  required = false,
  children,
}) {
  return (
    <Box className="form-field">
      <Typography component="label">
        {label}

        {required && (
          <span className="required-marker">
            {" "}*
          </span>
        )}
      </Typography>

      {children}
    </Box>
  );
}

function PreviewRow({
  label,
  value,
  success = false,
}) {
  return (
    <Box className="preview-row">
      <Typography component="span">
        {label}
      </Typography>

      <Typography
        component="strong"
        className={
          success ? "preview-success-value" : ""
        }
      >
        {value || "Not available"}
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

function getImageFormat(mimeType) {
  if (mimeType === "image/jpeg") {
    return "JPG";
  }

  if (mimeType === "image/png") {
    return "PNG";
  }

  return "IMAGE";
}

export default AddEmployee;
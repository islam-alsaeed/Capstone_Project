import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Button,
  Chip,
  Paper,
  Typography,
} from "@mui/material";

import {
  ArrowBackOutlined,
  CameraAltOutlined,
  CameraswitchOutlined,
  CheckCircleOutlineOutlined,
  DeleteOutlineOutlined,
  SaveOutlined,
} from "@mui/icons-material";

import employees from "../data/employees";
import "./FaceRegistration.css";

function FaceRegistration() {
  const navigate = useNavigate();
  const { employeeId } = useParams();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [saving, setSaving] = useState(false);

  const employee = employees.find(
    (item) => item.id === employeeId
  );

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraActive(true);
    } catch (error) {
      console.error("Camera error:", error);
      setCameraError(
        "Unable to access the camera. Check browser permissions."
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
  };

  const captureFace = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !cameraActive) {
      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) {
      setCameraError("The camera is not ready yet.");
      return;
    }

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      setCameraError("Unable to capture the image.");
      return;
    }

    context.drawImage(video, 0, 0, width, height);

    const image = canvas.toDataURL("image/jpeg", 0.9);

    setCapturedImage(image);
    stopCamera();
  };

  const retakeImage = async () => {
    setCapturedImage("");
    await startCamera();
  };

  const clearImage = () => {
    setCapturedImage("");
  };

  const saveFace = async () => {
    if (!capturedImage) {
      alert("Capture an employee face first.");
      return;
    }

    setSaving(true);

    try {
      const imageBlob = await dataUrlToBlob(capturedImage);

      const requestData = new FormData();
      requestData.append("employee_id", employeeId);
      requestData.append(
        "image",
        imageBlob,
        `${employeeId}-face.jpg`
      );

      // Replace this section with the Flask API request later.
      //
      // await axios.post(
      //   `http://localhost:5000/api/employees/${employeeId}/face`,
      //   requestData
      // );

      console.log("Face registration payload:", {
        employeeId,
        image: imageBlob,
      });

      alert("Face registered successfully.");

      navigate(`/employees/${employeeId}`);
    } catch (error) {
      console.error("Save face error:", error);
      alert("Unable to save the employee face.");
    } finally {
      setSaving(false);
    }
  };

  if (!employee) {
    return (
      <Box className="face-registration-page">
        <Paper className="face-not-found-card">
          <Typography variant="h4">
            Employee not found
          </Typography>

          <Typography>
            No employee exists with ID {employeeId}.
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
    <Box className="face-registration-page">
      <Box className="face-registration-header">
        <Box>
          <Typography component="h1">
            Register Employee Face
          </Typography>

          <Typography component="p">
            Capture a clear, front-facing image for recognition
          </Typography>
        </Box>

        <Button
          startIcon={<ArrowBackOutlined />}
          onClick={() =>
            navigate(`/employees/${employee.id}`)
          }
        >
          Back to Employee
        </Button>
      </Box>

      <Box className="face-registration-grid">
        <Paper className="camera-card">
          <Box className="card-heading">
            <CameraAltOutlined />

            <Box>
              <Typography component="h2">
                Camera Capture
              </Typography>

              <Typography component="p">
                Position the employee’s face inside the frame
              </Typography>
            </Box>
          </Box>

          <Box className="camera-frame">
            {!capturedImage ? (
              <>
                <video
                  ref={videoRef}
                  className={`camera-video ${
                    cameraActive ? "visible" : ""
                  }`}
                  playsInline
                  muted
                />

                {!cameraActive && (
                  <Box className="camera-placeholder">
                    <CameraAltOutlined />

                    <Typography component="h3">
                      Camera is not active
                    </Typography>

                    <Typography component="p">
                      Start the camera to register the employee
                      face.
                    </Typography>
                  </Box>
                )}

                {cameraActive && (
                  <Box className="face-guide">
                    <div className="face-guide-oval" />
                  </Box>
                )}
              </>
            ) : (
              <img
                src={capturedImage}
                alt={`${employee.name} captured face`}
                className="captured-face-image"
              />
            )}
          </Box>

          {cameraError && (
            <Typography className="camera-error">
              {cameraError}
            </Typography>
          )}

          <Box className="camera-controls">
            {!cameraActive && !capturedImage && (
              <Button
                variant="contained"
                startIcon={<CameraAltOutlined />}
                onClick={startCamera}
              >
                Start Camera
              </Button>
            )}

            {cameraActive && (
              <>
                <Button
                  variant="outlined"
                  onClick={stopCamera}
                >
                  Stop Camera
                </Button>

                <Button
                  variant="contained"
                  startIcon={<CameraAltOutlined />}
                  onClick={captureFace}
                >
                  Capture Face
                </Button>
              </>
            )}

            {capturedImage && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<CameraswitchOutlined />}
                  onClick={retakeImage}
                >
                  Retake
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineOutlined />}
                  onClick={clearImage}
                >
                  Remove
                </Button>
              </>
            )}
          </Box>

          <canvas ref={canvasRef} hidden />
        </Paper>

        <Box className="face-side-column">
          <Paper className="employee-face-summary">
            <Typography component="h2">
              Employee
            </Typography>

            <Box className="employee-summary-content">
              <img
                src={employee.photo}
                alt={employee.name}
                className="employee-summary-photo"
              />

              <Box>
                <Typography component="h3">
                  {employee.name}
                </Typography>

                <Typography component="p">
                  {employee.id}
                </Typography>

                <Typography component="span">
                  {employee.department}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper className="capture-guidelines-card">
            <Typography component="h2">
              Capture Guidelines
            </Typography>

            <Box className="guideline-list">
              <Guideline text="Look directly at the camera" />
              <Guideline text="Keep the face fully visible" />
              <Guideline text="Use clear and even lighting" />
              <Guideline text="Remove sunglasses or face coverings" />
              <Guideline text="Capture only one person" />
            </Box>
          </Paper>

          <Paper className="capture-status-card">
            <Typography component="h2">
              Registration Status
            </Typography>

            <Box
              className={
                capturedImage
                  ? "capture-status success"
                  : "capture-status pending"
              }
            >
              {capturedImage ? (
                <CheckCircleOutlineOutlined />
              ) : (
                <CameraAltOutlined />
              )}

              <Box>
                <Typography component="strong">
                  {capturedImage
                    ? "Image ready"
                    : "Waiting for capture"}
                </Typography>

                <Typography component="span">
                  {capturedImage
                    ? "The captured image can now be saved."
                    : "Start the camera and capture a clear face."}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Box className="face-registration-actions">
        <Button
          variant="outlined"
          onClick={() =>
            navigate(`/employees/${employee.id}`)
          }
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          startIcon={<SaveOutlined />}
          disabled={!capturedImage || saving}
          onClick={saveFace}
        >
          {saving ? "Saving..." : "Save Face"}
        </Button>
      </Box>
    </Box>
  );
}

function Guideline({ text }) {
  return (
    <Box className="guideline-item">
      <CheckCircleOutlineOutlined />
      <Typography>{text}</Typography>
    </Box>
  );
}

async function dataUrlToBlob(dataUrl) {
  const response = await fetch(dataUrl);
  return response.blob();
}

export default FaceRegistration;
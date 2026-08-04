import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import {
  AccessTimeOutlined,
  ArrowBackOutlined,
  CameraAltOutlined,
  CheckCircleOutlineOutlined,
  CoffeeOutlined,
  FastfoodOutlined,
  LoginOutlined,
  LogoutOutlined,
  RefreshOutlined,
  StopCircleOutlined,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import apiClient from "../api/apiClient";
import { useAuth } from "../auth/AuthContext";

import "./AttendanceClock.css";


const ATTENDANCE_ACTIONS = [
  {
    eventType: "CHECK_IN",
    label: "Clock In",
    description: "Start your workday",
    icon: <LoginOutlined />,
  },
  {
    eventType: "BREAK_START",
    label: "Start Break",
    description: "Begin a short break",
    icon: <CoffeeOutlined />,
  },
  {
    eventType: "BREAK_END",
    label: "End Break",
    description: "Return from your break",
    icon: <CoffeeOutlined />,
  },
  {
    eventType: "LUNCH_START",
    label: "Start Lunch",
    description: "Begin your lunch period",
    icon: <FastfoodOutlined />,
  },
  {
    eventType: "LUNCH_END",
    label: "End Lunch",
    description: "Return from lunch",
    icon: <FastfoodOutlined />,
  },
  {
    eventType: "CHECK_OUT",
    label: "Clock Out",
    description: "End your workday",
    icon: <LogoutOutlined />,
  },
];


function AttendanceClock() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraActive, setCameraActive] =
    useState(false);

  const [selectedEvent, setSelectedEvent] =
    useState("");

  const [capturedPreview, setCapturedPreview] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [successResult, setSuccessResult] =
    useState(null);

  useEffect(() => {
    return () => {
      stopCamera();

      if (capturedPreview) {
        URL.revokeObjectURL(capturedPreview);
      }
    };
  }, [capturedPreview]);

  const startCamera = async () => {
    setError("");
    setSuccessResult(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Camera access is not supported by this browser."
        );
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
          },
          audio: false,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await videoRef.current.play();
      }

      setCameraActive(true);
    } catch (cameraError) {
      console.error(cameraError);

      setError(
        "Unable to access the camera. Check your browser permissions."
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

  const captureFaceImage = () => {
    return new Promise((resolve, reject) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || !cameraActive) {
        reject(
          new Error("The camera is not ready.")
        );

        return;
      }

      const width = video.videoWidth;
      const height = video.videoHeight;

      if (!width || !height) {
        reject(
          new Error(
            "Wait for the camera to finish loading."
          )
        );

        return;
      }

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (!context) {
        reject(
          new Error(
            "Unable to capture the camera image."
          )
        );

        return;
      }

      /*
       * Mirror the captured frame so it matches
       * the preview shown to the employee.
       */
      context.save();
      context.translate(width, 0);
      context.scale(-1, 1);

      context.drawImage(
        video,
        0,
        0,
        width,
        height
      );

      context.restore();

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error(
                "Unable to create the captured image."
              )
            );

            return;
          }

          const imageFile = new File(
            [blob],
            `attendance-${Date.now()}.jpg`,
            {
              type: "image/jpeg",
            }
          );

          resolve(imageFile);
        },
        "image/jpeg",
        0.92
      );
    });
  };

  const recordAttendance = async () => {
    if (!selectedEvent) {
      setError(
        "Select an attendance action first."
      );

      return;
    }

    if (!cameraActive) {
      setError(
        "Start the camera before recording attendance."
      );

      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessResult(null);

    try {
      const imageFile =
        await captureFaceImage();

      const previewUrl =
        URL.createObjectURL(imageFile);

      setCapturedPreview((previousUrl) => {
        if (previousUrl) {
          URL.revokeObjectURL(previousUrl);
        }

        return previewUrl;
      });

      const formData = new FormData();

      formData.append(
        "event_type",
        selectedEvent
      );

      formData.append(
        "face_image",
        imageFile
      );

      /*
       * Do not manually set Content-Type.
       * Axios adds the multipart boundary.
       */
      const response = await apiClient.post(
        "/attendance/verify-and-record",
        formData
      );

      setSuccessResult(response.data);
      stopCamera();
    } catch (requestError) {
      console.error(
        requestError.response?.data ||
          requestError
      );

      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to record attendance."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetClock = async () => {
    setSelectedEvent("");
    setSuccessResult(null);
    setError("");

    setCapturedPreview((previousUrl) => {
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }

      return "";
    });

    await startCamera();
  };

  return (
    <Box className="attendance-clock-page">
      <Box className="attendance-clock-header">
        <Box>
          <Typography component="h1">
            Attendance Clock
          </Typography>

          <Typography component="p">
            Select an action and verify your face
          </Typography>
        </Box>

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

      <Box className="attendance-clock-grid">
        <Paper className="attendance-camera-card">
          <Box className="attendance-card-heading">
            <CameraAltOutlined />

            <Box>
              <Typography component="h2">
                Face Verification
              </Typography>

              <Typography component="p">
                Position your face inside the guide
              </Typography>
            </Box>
          </Box>

          <Box className="attendance-camera-frame">
            {!capturedPreview && (
              <video
                ref={videoRef}
                className={
                  cameraActive
                    ? "attendance-video active"
                    : "attendance-video"
                }
                playsInline
                muted
              />
            )}

            {capturedPreview && (
              <img
                src={capturedPreview}
                alt="Captured employee face"
                className="attendance-captured-image"
              />
            )}

            {!cameraActive &&
              !capturedPreview && (
                <Box className="attendance-camera-placeholder">
                  <CameraAltOutlined />

                  <Typography component="h3">
                    Camera is not active
                  </Typography>

                  <Typography component="p">
                    Start the camera to verify your
                    attendance.
                  </Typography>
                </Box>
              )}

            {cameraActive && (
              <Box className="attendance-face-guide">
                <Box className="attendance-face-oval" />
              </Box>
            )}

            {submitting && (
              <Box className="attendance-processing">
                <CircularProgress />

                <Typography>
                  Verifying your face...
                </Typography>
              </Box>
            )}
          </Box>

          <Box className="attendance-camera-buttons">
            {!cameraActive &&
              !capturedPreview && (
                <Button
                  variant="contained"
                  startIcon={
                    <CameraAltOutlined />
                  }
                  onClick={startCamera}
                >
                  Start Camera
                </Button>
              )}

            {cameraActive && (
              <Button
                variant="outlined"
                startIcon={
                  <StopCircleOutlined />
                }
                onClick={stopCamera}
                disabled={submitting}
              >
                Stop Camera
              </Button>
            )}

            {capturedPreview && (
              <Button
                variant="contained"
                startIcon={
                  <RefreshOutlined />
                }
                onClick={resetClock}
              >
                Record Another Action
              </Button>
            )}
          </Box>

          <canvas
            ref={canvasRef}
            hidden
          />
        </Paper>

        <Paper className="attendance-action-card">
          <Box className="attendance-card-heading">
            <AccessTimeOutlined />

            <Box>
              <Typography component="h2">
                Attendance Action
              </Typography>

              <Typography component="p">
                Logged in as{" "}
                {user?.fullName || "Employee"}
              </Typography>
            </Box>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          {successResult ? (
            <Box className="attendance-success-result">
              <CheckCircleOutlineOutlined />

              <Typography component="h3">
                Attendance Recorded
              </Typography>

              <Typography component="p">
                {successResult.message}
              </Typography>

              <Box className="attendance-success-details">
                <ResultRow
                  label="Employee"
                  value={
                    successResult.employee?.fullName
                  }
                />

                <ResultRow
                  label="Employee code"
                  value={
                    successResult.employee
                      ?.employeeCode
                  }
                />

                <ResultRow
                  label="Event"
                  value={
                    successResult.attendanceEvent
                      ?.eventType
                  }
                />

                <ResultRow
                  label="Time"
                  value={formatDateTime(
                    successResult.attendanceEvent
                      ?.eventTime
                  )}
                />

                <ResultRow
                  label="Face distance"
                  value={
                    successResult.attendanceEvent
                      ?.faceDistance
                  }
                />
              </Box>
            </Box>
          ) : (
            <>
              <Box className="attendance-action-list">
                {ATTENDANCE_ACTIONS.map(
                  (action) => (
                    <button
                      type="button"
                      key={action.eventType}
                      className={
                        selectedEvent ===
                        action.eventType
                          ? "attendance-action selected"
                          : "attendance-action"
                      }
                      onClick={() => {
                        setSelectedEvent(
                          action.eventType
                        );

                        setError("");
                      }}
                    >
                      <span className="attendance-action-icon">
                        {action.icon}
                      </span>

                      <span className="attendance-action-text">
                        <strong>
                          {action.label}
                        </strong>

                        <small>
                          {action.description}
                        </small>
                      </span>
                    </button>
                  )
                )}
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                className="attendance-submit-button"
                disabled={
                  !selectedEvent ||
                  !cameraActive ||
                  submitting
                }
                onClick={recordAttendance}
              >
                {submitting
                  ? "Verifying..."
                  : "Verify Face and Record"}
              </Button>

              {!cameraActive && (
                <Typography className="attendance-instruction">
                  Start the camera before submitting
                  an attendance action.
                </Typography>
              )}
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
}


function ResultRow({ label, value }) {
  return (
    <Box className="attendance-result-row">
      <Typography component="span">
        {label}
      </Typography>

      <Typography component="strong">
        {value ?? "Not available"}
      </Typography>
    </Box>
  );
}


function formatDateTime(value) {
  if (!value) {
    return "Not available";
  }

  return new Date(value).toLocaleString(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "medium",
    }
  );
}


export default AttendanceClock;
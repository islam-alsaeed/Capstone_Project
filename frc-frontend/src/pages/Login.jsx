import {
  LockOutlined,
  LoginOutlined,
  MailOutlineOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import logo from "../assets/logo.png";

import apiClient from "../api/apiClient";
import { useAuth } from "../auth/AuthContext";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    user,
    loading: authLoading,
  } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    redirectByRole(user.role);
  }, [
    authLoading,
    user,
  ]);

  const redirectByRole = (roleValue) => {
    const role = String(
      roleValue || ""
    ).toUpperCase();

    if (role === "EMPLOYEE") {
      navigate(
        "/employee/dashboard",
        {
          replace: true,
        }
      );

      return;
    }

    if (
      [
        "ADMIN",
        "HR",
        "MANAGER",
      ].includes(role)
    ) {
      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

      return;
    }

    navigate(
      "/unauthorized",
      {
        replace: true,
      }
    );
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    const normalizedEmail =
      email.trim().toLowerCase();

    if (
      !normalizedEmail ||
      !password
    ) {
      setError(
        "Enter your email and password."
      );

      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response =
        await apiClient.post(
          "/auth/login",
          {
            email:
              normalizedEmail,
            password,
          }
        );

      const loggedInUser =
        await login(
          response.data
        );

      const requestedPath =
        location.state?.from;

      const role = String(
        loggedInUser?.role || ""
      ).toUpperCase();

      if (
        requestedPath &&
        isPathAllowedForRole(
          requestedPath,
          role
        )
      ) {
        navigate(
          requestedPath,
          {
            replace: true,
          }
        );

        return;
      }

      redirectByRole(role);
    } catch (requestError) {
      console.error(
        "Login failed:",
        requestError.response?.data ||
          requestError
      );

      setError(
        requestError.response?.data
          ?.message ||
          requestError.message ||
          "Unable to sign in. Check your email and password."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <Box className="login-loading-page">
        <CircularProgress />

        <Typography>
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="login-page">
      <Box className="login-container">
        <Box className="login-brand-panel">
          <Box className="login-brand-content">
            <Box className="login-logo-wrapper">
              <img
                src={logo}
                alt="FaceClock logo"
                className="login-logo"
              />
            </Box>

            <Typography
              component="h1"
              className="login-brand-title"
            >
              FRC
            </Typography>

            <Typography
              component="h2"
              className="login-brand-subtitle"
            >
              FaceClock Facial Recognition
              Control System
            </Typography>

            <Typography
              component="p"
              className="login-brand-description"
            >
              Secure employee attendance and
              access management using facial
              recognition technology.
            </Typography>

            <Box className="login-feature-list">
              <Box className="login-feature-item">
                <span className="login-feature-number">
                  01
                </span>

                <Box>
                  <strong>
                    Secure authentication
                  </strong>

                  <p>
                    Role-based access for
                    administrators and employees.
                  </p>
                </Box>
              </Box>

              <Box className="login-feature-item">
                <span className="login-feature-number">
                  02
                </span>

                <Box>
                  <strong>
                    Face verification
                  </strong>

                  <p>
                    Verify employee identity before
                    recording attendance.
                  </p>
                </Box>
              </Box>

              <Box className="login-feature-item">
                <span className="login-feature-number">
                  03
                </span>

                <Box>
                  <strong>
                    Attendance tracking
                  </strong>

                  <p>
                    Record clock-ins, breaks, lunch,
                    and clock-outs.
                  </p>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="login-form-panel">
          <Paper
            component="form"
            onSubmit={handleSubmit}
            className="login-card"
            elevation={0}
          >
            <Box className="login-card-heading">
              <Box className="login-card-icon">
                <LoginOutlined />
              </Box>

              <Box>
                <Typography component="h2">
                  Welcome back
                </Typography>

                <Typography component="p">
                  Sign in to access your FaceClock
                  account.
                </Typography>
              </Box>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2.5 }}
              >
                {error}
              </Alert>
            )}

            <Box className="login-field-group">
              <Typography
                component="label"
                htmlFor="login-email"
              >
                Email address
              </Typography>

              <TextField
                id="login-email"
                fullWidth
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => {
                  setEmail(
                    event.target.value
                  );

                  if (error) {
                    setError("");
                  }
                }}
                autoComplete="email"
                disabled={submitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineOutlined />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box className="login-field-group">
              <Typography
                component="label"
                htmlFor="login-password"
              >
                Password
              </Typography>

              <TextField
                id="login-password"
                fullWidth
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => {
                  setPassword(
                    event.target.value
                  );

                  if (error) {
                    setError("");
                  }
                }}
                autoComplete="current-password"
                disabled={submitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              className="login-submit-button"
              disabled={
                submitting ||
                !email.trim() ||
                !password
              }
              startIcon={
                submitting
                  ? null
                  : <LoginOutlined />
              }
            >
              {submitting ? (
                <>
                  <CircularProgress
                    size={21}
                    color="inherit"
                  />

                  <span>
                    Signing in...
                  </span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <Typography
              component="p"
              className="login-security-message"
            >
              Your account access is protected by
              secure authentication.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

function isPathAllowedForRole(
  path,
  role
) {
  if (role === "EMPLOYEE") {
    return path.startsWith(
      "/employee/"
    );
  }

  if (
    [
      "ADMIN",
      "HR",
      "MANAGER",
    ].includes(role)
  ) {
    return !path.startsWith(
      "/employee/"
    );
  }

  return false;
}

export default Login;
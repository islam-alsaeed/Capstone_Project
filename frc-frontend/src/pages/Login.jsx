import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { LoginOutlined } from "@mui/icons-material";

import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

function Login() {
  const {
    login,
    isAuthenticated,
    user,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  if (isAuthenticated) {
    return (
      <Navigate
        to={getHomeRoute(user?.role)}
        replace
      />
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const loggedInUser = await login(
        email.trim(),
        password
      );

      const requestedRoute =
        location.state?.from?.pathname;

      navigate(
        requestedRoute ||
          getHomeRoute(loggedInUser.role),
        {
          replace: true,
        }
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to log in."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f8fc",
        p: 3,
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 430,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: 28,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Employee Login
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            textAlign: "center",
            mt: 1,
            mb: 3,
          }}
        >
          Sign in to manage your attendance
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            required
            fullWidth
            type="email"
            label="Email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />

          <TextField
            required
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            startIcon={
              submitting
                ? null
                : <LoginOutlined />
            }
            disabled={submitting}
          >
            {submitting ? (
              <CircularProgress
                size={24}
                color="inherit"
              />
            ) : (
              "Sign In"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

function getHomeRoute(role) {
  if (
    role === "ADMIN" ||
    role === "HR" ||
    role === "MANAGER"
  ) {
    return "/dashboard";
  }

  return "/employee/dashboard";
}

export default Login;
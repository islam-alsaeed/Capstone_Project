import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  Box,
  CircularProgress,
} from "@mui/material";

import { useAuth } from "./AuthContext";

function ProtectedRoute({
  allowedRoles = [],
}) {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  const location = useLocation();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f8fc",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (
    !isAuthenticated ||
    !user
  ) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  const normalizedRole =
    String(
      user.role || ""
    ).toUpperCase();

  const normalizedAllowedRoles =
    allowedRoles.map((role) =>
      String(role).toUpperCase()
    );

  if (
    normalizedAllowedRoles.length >
      0 &&
    !normalizedAllowedRoles.includes(
      normalizedRole
    )
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
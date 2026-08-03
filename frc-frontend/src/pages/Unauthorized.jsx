import {
  Box,
  Button,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        component="h1"
        sx={{
          fontSize: 32,
          fontWeight: 700,
        }}
      >
        Access denied
      </Typography>

      <Typography
        sx={{
          mt: 1,
          mb: 3,
          color: "text.secondary",
        }}
      >
        You do not have permission to view this page.
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate(-1)}
      >
        Go Back
      </Button>
    </Box>
  );
}

export default Unauthorized;
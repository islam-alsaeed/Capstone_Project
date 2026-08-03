import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function AdminHeader() {
  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div">
          Admin Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

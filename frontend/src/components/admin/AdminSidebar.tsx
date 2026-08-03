import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        backgroundColor: "#f5f5f5",
        borderRight: "1px solid #ddd",
        paddingTop: 2,
      }}
    >
      <List>
        <ListItemButton component={Link} to="/admin">
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton component={Link} to="/admin/register">
          <ListItemText primary="Register User" />
        </ListItemButton>

        <ListItemButton component={Link} to="/">
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );
}

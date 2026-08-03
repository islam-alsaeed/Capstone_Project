import AddUserForm from "../components/admin/AddUserForm";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

export default function RegisterUserPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <AdminHeader />

      {/* Main layout: sidebar + content */}
      <Box sx={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <Box sx={{ width: 250, borderRight: "1px solid #ddd", padding: 2 }}>
          <AdminSidebar />
        </Box>

        {/* Page Content */}
        <Box sx={{ flex: 1, padding: 3 }}>
          <Typography variant="h4" sx={{ marginBottom: 3 }}>
            Register New User
          </Typography>

          <AddUserForm />
        </Box>
      </Box>
    </Box>
  );
}

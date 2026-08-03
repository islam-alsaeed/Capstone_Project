import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";
import DashboardCards from "../components/admin/DashboardCards";
import EmployeeTable from "../components/admin/EmployeeTable";
import Box from "@mui/material/Box";

export default function AdminPage() {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <AdminSidebar />

      <Box sx={{ flexGrow: 1 }}>
        <AdminHeader />

        <Box sx={{ padding: 3 }}>
          <DashboardCards />
          <EmployeeTable />
        </Box>
      </Box>
    </Box>
  );
}

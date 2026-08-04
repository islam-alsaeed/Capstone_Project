import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./auth/ProtectedRoute";

import Layout from "./components/Layout";
// import EmployeeSidebar from "./components/EmployeeSidebar";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import EmployeeDetails from "./pages/EmployeeDetails";
import FaceRegistration from "./pages/FaceRegistration";
import EditEmployee from "./pages/EditEmployee";

import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AttendanceClock from "./pages/AttendanceClock";

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      {/* Employee portal */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["EMPLOYEE"]}
          />
        }
      >
        <Route element={<Layout />}>
          <Route
            path="/employee/dashboard"
            element={<EmployeeDashboard />}
          />

          <Route
            path="/employee/clock"
            element={<AttendanceClock />}
          />
        </Route>
      </Route>

      {/* Admin, HR, and manager portal */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              "ADMIN",
              "HR",
              "MANAGER",
            ]}
          />
        }
      >
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/employees"
            element={<Employees />}
          />

          <Route
            path="/employees/add"
            element={<AddEmployee />}
          />

          <Route
            path="/employees/:employeeId"
            element={<EmployeeDetails />}
          />

          <Route
            path="/employees/:employeeId/edit"
            element={<EditEmployee />}
          />

          <Route
            path="/employees/:employeeId/face-registration"
            element={<FaceRegistration />}
          />
        </Route>
      </Route>

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import EmployeeDetails from "./pages/EmployeeDetails";
import FaceRegistration from "./pages/FaceRegistration";
import EditEmployee from "./pages/EditEmployee";

import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Unauthorized from "./pages/Unauthorized";

import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      {/* Employee routes */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["EMPLOYEE"]}
          />
        }
      >
        <Route
          path="/employee/dashboard"
          element={<EmployeeDashboard />}
        />
      </Route>

      {/* Admin, HR, and manager routes */}
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

      {/* Default route */}
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      {/* Unknown routes */}
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
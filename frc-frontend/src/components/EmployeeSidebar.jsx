import {
  AccessTimeOutlined,
  DashboardOutlined,
  EventNoteOutlined,
  LogoutOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

import "./Sidebar.css";

const employeeMenuItems = [
  {
    label: "Dashboard",
    path: "/employee/dashboard",
    icon: <DashboardOutlined />,
  },
  {
    label: "Attendance Clock",
    path: "/employee/clock",
    icon: <AccessTimeOutlined />,
  },
  {
    label: "My Attendance",
    path: "/employee/attendance",
    icon: <EventNoteOutlined />,
  },
  {
    label: "My Profile",
    path: "/employee/profile",
    icon: <PersonOutlineOutlined />,
  },
];

function EmployeeSidebar() {
  const {
    user,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          FC
        </div>

        <div>
          <strong>FaceClock</strong>
          <span>Employee Portal</span>
        </div>
      </div>

      <div className="sidebar-user">
        <strong>
          {user?.fullName || "Employee"}
        </strong>

        <span>
          {user?.employeeCode || ""}
        </span>
      </div>

      <nav className="sidebar-navigation">
        {employeeMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >
            {item.icon}

            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        className="sidebar-link sidebar-logout"
        onClick={handleLogout}
      >
        <LogoutOutlined />

        <span>Logout</span>
      </button>
    </aside>
  );
}

export default EmployeeSidebar;
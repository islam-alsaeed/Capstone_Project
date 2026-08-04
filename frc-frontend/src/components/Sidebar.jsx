import {
  AccessTimeOutlined,
  AssessmentOutlined,
  DashboardOutlined,
  EventNoteOutlined,
  LogoutOutlined,
  PeopleAltOutlined,
  PersonAddAltOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import logo from "../assets/logo.png";

import { useAuth } from "../auth/AuthContext";

import "./Sidebar.css";

const adminMenuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardOutlined />,
  },
  {
    label: "Employees",
    path: "/employees",
    icon: <PeopleAltOutlined />,
  },
  {
    label: "Add Employee",
    path: "/employees/add",
    icon: <PersonAddAltOutlined />,
  },
  {
    label: "Attendance",
    path: "/attendance",
    icon: <AccessTimeOutlined />,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: <AssessmentOutlined />,
  },
];

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

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isEmployee = user?.role === "EMPLOYEE";

  const menuItems = isEmployee
    ? employeeMenuItems
    : adminMenuItems;

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-content">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <img
              src={logo}
              alt="FRC logo"
            />
          </div>

          <h2>FRC</h2>

          <p>
            {isEmployee
              ? "FaceClock Employee Portal"
              : "FaceClock Facial Recognition Control System"}
          </p>
        </div>

        <nav className="sidebar-navigation">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={
                item.path === "/dashboard" ||
                item.path === "/employee/dashboard"
              }
              className={({ isActive }) =>
                `sidebar-menu-item ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="sidebar-menu-icon">
                {item.icon}
              </span>

              <span className="sidebar-menu-label">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        type="button"
        className="sidebar-logout"
        onClick={handleLogout}
      >
        <LogoutOutlined />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;
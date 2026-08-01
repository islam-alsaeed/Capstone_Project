import {
  DashboardOutlined,
  PeopleAltOutlined,
  PersonAddAltOutlined,
  ApartmentOutlined,
  AccessTimeOutlined,
  AssessmentOutlined,
  SettingsOutlined,
  LogoutOutlined,
} from "@mui/icons-material";
import logo from "../assets/logo.png";

import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const menuItems = [
  {
    label: "Dashboard",
    path: "/",
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
    label: "Departments",
    path: "/departments",
    icon: <ApartmentOutlined />,
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
  {
    label: "Settings",
    path: "/settings",
    icon: <SettingsOutlined />,
  },
];

function Sidebar() {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-content">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            {/* Replace this path with your actual logo */}
            <img src={logo} alt="FRC logo" />
          </div>

          <h2>FRC</h2>

          <p>
            Facial Recognition Control
            <br />
            System
          </p>
        </div>

        <nav className="sidebar-navigation">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `sidebar-menu-item ${isActive ? "active" : ""}`
              }
            >
              <span className="sidebar-menu-icon">{item.icon}</span>
              <span className="sidebar-menu-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        type="button"
        className="sidebar-logout"
        onClick={() => console.log("Logout clicked")}
      >
        <LogoutOutlined />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;
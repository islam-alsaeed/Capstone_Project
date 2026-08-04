import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Menu,
  NotificationsNone,
} from "@mui/icons-material";

import {
  Avatar,
  Badge,
  IconButton,
} from "@mui/material";

import { useAuth } from "../auth/AuthContext";

import "./Topbar.css";

function Topbar() {
  const { user } = useAuth();

  const [currentDateTime, setCurrentDateTime] =
    useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const day = currentDateTime.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
    }
  );

  const date = currentDateTime.toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  const time = currentDateTime.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }
  );

  const initials = useMemo(() => {
    const fullName = user?.fullName || "User";

    return fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user?.fullName]);

  const roleLabel = getRoleLabel(user?.role);

  return (
    <header className="topbar">
      <div className="topbar-menu">
        <IconButton aria-label="Open navigation menu">
          <Menu />
        </IconButton>
      </div>

      <div className="topbar-clock">
        <div className="clock-time">
          {time}
        </div>

        <div className="clock-date">
          <span>{day}</span>
          <span className="clock-divider">•</span>
          <span>{date}</span>
        </div>
      </div>

      <div className="profile">
        <IconButton
          className="notification-button"
          aria-label="Notifications"
        >
          <Badge badgeContent={3} color="error">
            <NotificationsNone />
          </Badge>
        </IconButton>

        <Avatar className="admin-avatar">
          {initials}
        </Avatar>

        <div className="profile-information">
          <strong>
            {user?.fullName || "User"}
          </strong>

          <p>{roleLabel}</p>
        </div>
      </div>
    </header>
  );
}

function getRoleLabel(role) {
  switch (role) {
    case "ADMIN":
      return "System Administrator";

    case "HR":
      return "Human Resources";

    case "MANAGER":
      return "Manager";

    case "EMPLOYEE":
      return "Employee";

    default:
      return "System User";
  }
}

export default Topbar;
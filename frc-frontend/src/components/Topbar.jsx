import { useEffect, useState } from "react";

import {
  Menu,
  NotificationsNone,
} from "@mui/icons-material";

import {
  Avatar,
  Badge,
  IconButton,
} from "@mui/material";

import "./Topbar.css";

function Topbar() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const day = currentDateTime.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const date = currentDateTime.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const time = currentDateTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

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
          AU
        </Avatar>

        <div className="profile-information">
          <strong>Admin User</strong>
          <p>System Administrator</p>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
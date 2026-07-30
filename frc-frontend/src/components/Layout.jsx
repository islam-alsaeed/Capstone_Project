import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import "./Layout.css";

function Layout() {
  return (
    <div className="layout">

      <Sidebar />

      <div className="main">

        <Topbar />

        <div className="page-content">
          <Outlet />
        </div>

      </div>

    </div>
  );
}

export default Layout;
import {
    Dashboard,
    People,
    Apartment,
    AccessTime,
    Settings,
    Assessment,
    Logout
} from "@mui/icons-material";

import { NavLink } from "react-router-dom";

import "./Sidebar.css";

function Sidebar(){

    return(

        <div className="sidebar">

            <div className="logo">
                <img src="../assets/logo.png" alt="logo"/>

                <h2>FRC</h2>

                <p>Facial Recognition Control System</p>

            </div>

            <nav>

                <NavLink to="/">
                    <Dashboard/> Dashboard
                </NavLink>

                <NavLink to="/employees">
                    <People/> Employees
                </NavLink>

                <NavLink to="/departments">
                    <Apartment/> Departments
                </NavLink>

                <NavLink to="/attendance">
                    <AccessTime/> Attendance
                </NavLink>

                <NavLink to="/reports">
                    <Assessment/> Reports
                </NavLink>

                <NavLink to="/settings">
                    <Settings/> Settings
                </NavLink>

            </nav>

            <div className="logout">

                <Logout/>

                Logout

            </div>

        </div>

    )

}

export default Sidebar;
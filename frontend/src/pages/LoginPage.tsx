import { useNavigate } from "react-router-dom";
import Login from "../components/Camera";
import "./LoginPage.css";

const LoginPage = () => {
    const navigate = useNavigate();
    return (
        <div className="login-container">
            <img
                src="logo.png" alt="Logo"
                className="app-logo"
            />
            <h1>Welcome to Facial Recognition Control System</h1>
            <p style={{ fontSize: "18px", color: "#555", fontWeight: "bold", marginTop: "10px" }}>
                Please look at the camera to authenticate
            </p>
            <div className="button_group">
                <button className="btn-secondary"
                    onClick={() => navigate("/")}>
                    Go back
                </button>
                <button className="btn-primary"
                    onClick={() => navigate("/dashboard/user")}>
                    capture picture
                </button>
            </div>
            <Login />

            <p className="footer">
                System Version 1.0.0  &copy; 2026 Facial Recognition Control System. All rights reserved.
            </p>

        </div>
    );
}

export default LoginPage;
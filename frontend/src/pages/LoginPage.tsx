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
            <button className="start-button"
                onClick={() => navigate("/")}>
                Go back
            </button>
            <Login />
        </div>
    );
}

export default LoginPage;
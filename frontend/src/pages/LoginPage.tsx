import { useNavigate } from "react-router-dom";
import Login from "../components/Camera";
import "./LoginPage.css";

const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <div className="login-container modern-friendly">
            <img src="logo.png" alt="Logo" className="app-logo" />

            <h1 className="page-title">Facial Recognition Login</h1>
            <p className="instruction-text">
                Please look at the camera to authenticate
            </p>

            <div className="camera-section">
                <Login />
            </div>

            <div className="button-group">
                <button className="btn-primary" onClick={() => navigate("/dashboard/user")}>
                    📸 Take Picture
                </button>
                <button className="btn-secondary" onClick={() => navigate("/")}>
                    Go Back
                </button>

            </div>

            <p className="footer">System Version 1.0.0</p>
        </div>
    );
};

export default LoginPage;

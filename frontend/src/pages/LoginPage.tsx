import Login from "../components/Login";
import "./LoginPage.css";

const LoginPage = () => {
    return (
        <div className="login-container">
            {/* <img src="logo.png" alt="Logo" className="login-logo" /> */}
            <img
                src="logo.png" alt="Logo"
                className="login-logo"
            />
            {/* <div className="login-box"></div> */}
            <Login />
        </div>
    );
}

export default LoginPage;
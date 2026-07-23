import { useNavigate } from "react-router";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  return (

    <div className="Home-container">
      <img
        src="logo.png" alt="Logo"
        className="app-logo"
      />

      <h1>Welcome to Facial Recoginition control system </h1>
      <p>Click button below to start.</p>
      <button className="start-button"
        onClick={() => navigate("/login")}>
        I am ready start
      </button>
      <p className="footer">
        System Version 1.0.0  &copy; 2026 Facial Recognition Control System. All rights reserved.
      </p>
    </div>
  );
}
export default Home;
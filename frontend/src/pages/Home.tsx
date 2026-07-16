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
      <button style={{ margin: '30px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        onClick={() => navigate("/login")}>
        I am ready start
      </button>
    </div>
  );
}
export default Home;
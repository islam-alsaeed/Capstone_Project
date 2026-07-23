import { useNavigate } from "react-router-dom";
import Camera from "../components/Camera";
import "./LoginPage.css";
import { useState } from "react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const [popup, setPopup] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });
  const showPopup = (message: string, type: "success" | "error") => {
    setPopup({ message, type });

    setTimeout(() => {
      setPopup({ message: "", type: null });
    }, 3000); // message auto-close after 3 seconds
  };

  // Handle the captured image from the Camera component
  const handleCapture = async (imageData: string) => {
    // setPhoto(imageData);
    try {
      const res = await fetch("http://localhost:5000/face/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await res.json();

      if (data.status === "success") {
        showPopup("Face detected successfully!", "success");
      } else if (data.status === "no_face") {
        showPopup("No face detected. Please try again.", "error");
      } else {
        showPopup(data.message || "Unknown error occurred.", "error");
      }
    } catch (err) {
      showPopup("Failed to connect to server.", "error");
    }
  };


  // Trigger the camera to take a picture
  const triggerCamera = () => {
    const btn = document.getElementById("camera-take-picture");
    btn?.click();
  };

  return (
    <div className="login-container">

      {/* Logo */}
      <img src="logo2.png" alt="Logo" className="app-logo" />

      {/* Title */}
      <h1 className="page-title">Facial Recognition Login</h1>
      <p className="instruction-text">Please look at the camera to authenticate</p>

      {/* Camera Preview */}
      <div className="camera-section">
        <Camera onCapture={handleCapture} />
      </div>

      {/* Buttons */}
      <div className="button-group">
        <button className="btn-primary" onClick={triggerCamera}>
          📸 Authenticate
        </button>

        <button className="btn-secondary" onClick={() => navigate("/")}>
          Home Page
        </button>
      </div>

      {/* Captured Image Preview */}
      {/* {photo && (
        <div className="photo-preview">
          <img src={photo} alt="Captured" />
        </div>
      )} */}

      {/* DeepFace Result
      {result && (
        <pre className="result-box">{JSON.stringify(result, null, 2)}</pre>
      )} */}

      {/* Popup Notification */}
      {popup.type && (
        <div className={`popup ${popup.type}`}>
          <span className="popup-icon">
            {popup.type === "success" ? "✔" : "⚠"}
          </span>

          <p>{popup.message}</p>

          <button
            className="popup-close"
            onClick={() => setPopup({ message: "", type: null })}
          >
            ✖
          </button>
        </div>
      )}


      {/* Footer */}
      <p className="footer">
        System Version 1.0.0  &copy; 2026 Facial Recognition Control System. All rights reserved.
      </p>
    </div>
  );
};

export default LoginPage;

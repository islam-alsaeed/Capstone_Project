import Camera from "../Camera";
import { useState } from "react";

export default function AddUserForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [Role, setRole] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const [popup, setPopup] = useState({
    message: "",
    type: null as "success" | "error" | null,
  });

  const showPopup = (message: string, type: "success" | "error") => {
    setPopup({ message, type });
    setTimeout(() => setPopup({ message: "", type: null }), 3000);
  };

  const handleCapture = async (imageData: string) => {
    setPhoto(imageData);

    try {
      const res = await fetch("http://localhost:5000/face/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await res.json();

      if (data.status === "success") {
        showPopup("Face captured successfully!", "success");
      } else {
        showPopup("Face not detected. Try again.", "error");
      }
    } catch {
      showPopup("Server error. Try again.", "error");
    }
  };

  const triggerCamera = () => {
    document.getElementById("camera-take-picture")?.click();
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName) {
      showPopup("Please enter first and last name.", "error");
      return;
    }

    if (!photo) {
      showPopup("Please capture a face image.", "error");
      return;
    }

    const payload = {
      first_name: firstName,
      last_name: lastName,
      Role: Role,
      faceImage: photo,
    };

    try {
      const res = await fetch("http://localhost:5000/employee/add-employee  ", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === "success") {
        showPopup("User registered successfully!", "success");
      } else {
        showPopup(data.message || "Registration failed.", "error");
      }
    } catch {
      showPopup("Failed to register user.", "error");
    }
  };

  return (
    <div className="register-container">
      <h2>Register New Employee</h2>

      <input
        type="text"
        placeholder="First Name"
        className="text-input"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Last Name"
        className="text-input"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Role"
        className="text-input"
        value={Role}
        onChange={(e) => setRole(e.target.value)}
      />
      <br />
      <div style={{ width: "500px" }}>
        <Camera onCapture={(img: string) => { void (async () => { await handleCapture(img); })(); }} />
      </div>

      <button onClick={triggerCamera} className="btn-primary">
        📸 Capture Face
      </button>

      {photo && (
        <div className="photo-preview">
          <img src={photo} alt="Captured" />
        </div>
      )}

      <button onClick={handleSubmit} className="btn-primary">
        Register Employee
      </button>

      {popup.type && (
        <div className={`popup ${popup.type}`}>
          {popup.message}
        </div>
      )}
    </div>
  );
}

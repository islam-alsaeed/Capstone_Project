import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const videoReference = React.useRef(null);
    const navigate = useNavigate();
    useEffect(() => {
        const startCamera = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoReference.current) {
                videoReference.current.srcObject = stream;
            };
            startCamera();
        }, []);
    const sendFrame = async () => {
        const video = videoReference.current;
        if (!video) return;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");

        const res = await fetch("http://localhost:5000/api/login/detect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: imageData }),
        });

        const data = await res.json();

        if (data.status === "success") {
            navigate("/dashboard/user", { state: { employee: data.employee } });
        }
    };

    useEffect(() => {
        const interval = setInterval(sendFrame, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h2>Face Login</h2>
            <video ref={videoReference} autoPlay style={{ width: "400px" }} />
        </div>
    );
};

export default Login;
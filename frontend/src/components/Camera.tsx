import { useEffect, useRef } from "react";

const Camera = ({ onCapture }: { onCapture: (img: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    };

    startCamera();
  }, []);

  const takePicture = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg");

    onCapture(imageData);
  };

  return (
    <div className="camera-box">
      <video ref={videoRef} autoPlay className="camera-video" />

      <button
        id="camera-take-picture"
        style={{ display: "none" }}
        onClick={takePicture}
      />
    </div>
  );
};

export default Camera;

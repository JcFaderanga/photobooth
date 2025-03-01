import { useEffect, useRef, useState } from "react";

export default function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [isCameraAvailable, setIsCameraAvailable] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      setIsCameraAvailable(true);
    } else {
      setIsCameraAvailable(false);
    }
  }, []);

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Camera access is not supported on this device/browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL("image/png");
    setPhoto(imageUrl);
  };

  const downloadPhoto = () => {
    if (!photo) return;
    const a = document.createElement("a");
    a.href = photo;
    a.download = "captured-image.png";
    a.click();
  };

  return (
    <div className="camera-container">
      {isCameraAvailable ? (
        !photo ? (
          <>
            <video ref={videoRef} autoPlay playsInline className="video-preview"></video>
            <button onClick={startCamera}>Start Camera</button>
            <button onClick={takePhoto}>Take Photo</button>
          </>
        ) : (
          <>
            <img src={photo} alt="Captured" className="captured-image" />
            <button onClick={() => setPhoto(null)}>Retake</button>
            <button onClick={downloadPhoto}>Download</button>
          </>
        )
      ) : (
        <p>Camera access is not supported on this device.</p>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
}

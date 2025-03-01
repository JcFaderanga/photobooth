import { useEffect, useRef, useState } from "react";
import { useGallery } from "@/context/galleryContext";
export default function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { gallery, setGallery } = useGallery();
  const [photo, setPhoto] = useState(null);


  useEffect(() => {
    // Load saved photos from localStorage on page load
    const savedPhotos = JSON.parse(localStorage.getItem("photoGallery")) || [];
    setGallery(savedPhotos);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setTimeout(() => {
        setPhoto(null);
      }, 4000);

    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please check permissions.");
    }
  };

  startCamera();

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

    // Save photo to gallery
    const updatedGallery = [imageUrl, ...gallery]; 
    setGallery(updatedGallery);
    console.log(updatedGallery); 
    localStorage.setItem("photoGallery", JSON.stringify(updatedGallery));
  };

  return (
    <div className="camera-container">
      <div className="camera-section">
        {!photo ? (
          <>
            <video ref={videoRef} autoPlay playsInline className="video-preview"></video>
            <button onClick={takePhoto}>Take Photo</button>
          </>
        ) : (
            <img src={photo} alt="Captured" className="captured-image" />
        )}
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      </div>
    </div>
  );
}

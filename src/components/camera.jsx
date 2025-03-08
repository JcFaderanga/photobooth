import React, { useCallback, useEffect, useRef, useState } from "react";
import { useGallery } from "@/context/galleryContext";

const Camera = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const { gallery, setGallery } = useGallery();
    const [isInverted, setIsInverted] = useState(false);

    useEffect(() => {
        const savedPhotos = JSON.parse(localStorage.getItem("photoGallery")) || [];
        setGallery(savedPhotos);
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: "user",
                },
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Could not access camera. Please check permissions.");
        }
    };

    useEffect(() => {
        startCamera();
    }, []);

    const takePhoto = useCallback(() => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;
  
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      const size = Math.min(videoWidth, videoHeight);
      
      const outputSize = 1000; // Higher resolution for better quality
      
      canvas.width = outputSize;
      canvas.height = outputSize;
  
      const ctx = canvas.getContext("2d");
  
      if (isInverted) {
          ctx.translate(outputSize, 0);
          ctx.scale(-1, 1);
      }
  
      ctx.drawImage(video, (videoWidth - size) / 2, (videoHeight - size) / 2, size, size, 0, 0, outputSize, outputSize);
  
      const imageUrl = canvas.toDataURL("image/png", 1.0);
  
      // Save to gallery (no need for setPhoto)
      const updatedGallery = [imageUrl, ...gallery];
      setGallery(updatedGallery);
      localStorage.setItem("photoGallery", JSON.stringify(updatedGallery));
  });
  
  

    return (
        <div className="text-center">
            <div className="mx-auto max-w-[500px]">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className={`w-[500px] h-[500px] object-cover border-black rounded-lg ${isInverted ? "scale-x-[-1]" : ""}`}
                />
                <div className="mt-2 flex justify-center gap-4">
                    <button
                        onClick={takePhoto}
                        className="rounded-xl bg-amber-100 font-bold px-4 py-2"
                    >
                        Take Photo
                    </button>
                    <button
                        onClick={() => setIsInverted(!isInverted)}
                        className="rounded-xl bg-blue-300 font-bold px-4 py-2"
                    >
                        {isInverted ? "Normal Camera" : "Invert Camera"}
                    </button>
                </div>
                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
        </div>
    );
};

export default React.memo(Camera);

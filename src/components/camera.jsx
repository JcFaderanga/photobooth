import React,{ useCallback, useEffect, useRef, useState } from "react";
import { useGallery } from "@/context/galleryContext";
import { StartCamera } from "@/utils";

const Camera =()=> {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { gallery, setGallery, photo, setPhoto} = useGallery();
 console.log('this is use Ref',canvasRef.current)

  useEffect(() => {
    // Load saved photos from localStorage on page load
    const savedPhotos = JSON.parse(localStorage.getItem("photoGallery")) || [];
    setGallery(savedPhotos);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef?.current) {
        videoRef.current.srcObject = stream;
      }
         setPhoto(null);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please check permissions.");
    }
  };
 
    startCamera();

  const takePhoto = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
  
    // Get video dimensions
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
  
    // Find the smaller dimension to make a square
    const size = Math.min(videoWidth, videoHeight);
  
    // Center the crop (calculate top-left position)
    const sx = (videoWidth - size) / 2;
    const sy = (videoHeight - size) / 2;
  
    // Set canvas to a fixed square size
    const outputSize = 500; // Change this if you want a different square size
    canvas.width = outputSize;
    canvas.height = outputSize;
  
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, sx, sy, size, size, 0, 0, outputSize, outputSize);
  
    const imageUrl = canvas.toDataURL("image/png");
    setPhoto(imageUrl);
  
    // Save photo to gallery
    const updatedGallery = [imageUrl, ...gallery];
    setGallery(updatedGallery);
    localStorage.setItem("photoGallery", JSON.stringify(updatedGallery));
  });
  

  return (
    <div className="">
      <div className="mx-auto max-w-[500px]">
        {!photo ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-[300px] h-[300px] object-cover border-black rounded-[10px]"
            />
          </>
        ) : (
            <img
              src={photo} 
              alt="Captured" 
              className="w-full max-w-[320px] border-black rounded-[10px]" 
            />
        )}
        <button 
            onClick={takePhoto}
            className=" w-full rounded-xl bg-amber-100 font-bold"
        >
          Take Photo
        </button>
      
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </div>
  );
}

export default React.memo(Camera);
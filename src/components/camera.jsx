import React, { useCallback, useEffect, useRef, useState } from "react";
import { useGallery } from "@/context/galleryContext";

const Camera = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const { gallery, setGallery } = useGallery();
    const [timer, setTimer] = useState(3);
    const [photoCount, setPhotoCount] = useState(4);
    console.log(timer);
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [isInverted, setIsInverted] = useState(false);
 console.log(timer);
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
      
      const outputSize = 1200; // Higher resolution for better quality
      
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
  
  const takePhotoWithTimer = useCallback(() => {
    if (isCountingDown) return; // Prevent multiple triggers

    setIsCountingDown(true);
    let countdown = timer;

    const interval = setInterval(() => {
        if (countdown > 1) {
            countdown -= 1;
            setTimer(countdown);
        } else {
            clearInterval(interval);
            takePhoto();
            setIsCountingDown(false);
            setTimer(3); // Reset timer after photo
        }
    }, 1000);
}, [timer, takePhoto]);


    const takeMultiplePhotos = () => {
      
       takePhotoWithTimer(); 
     
    
    };
  

    return (
        <div className="text-center">
            <div className="mx-auto max-w-[500px]">
                <div className="relative">
                  {isCountingDown &&
                      <div className="absolute h-full w-full flex justify-center items-center">
                          <h1 className=" text-[200px] font-bold text-white">{timer}</h1>
                      </div>
                  }
                    <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className={`w-[500px] h-[500px] object-cover border-black px-4 rounded-xl ${isInverted ? "scale-x-[-1]" : ""}`}
                      />
                </div>
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
                
                <div className="mt-4">
                    <button
                      onClick={takeMultiplePhotos}
                      className="rounded-xl bg-blue-300 font-bold px-4 py-2"
                    >
                        Set Timer
                    </button>
                    <select
                        className="px-4 py-2 mx-2 bg-slate-100 rounded-xl border"
                        value={timer}
                        onChange={(e) => setTimer(Number(e.target.value))}
                    >
                        <option value="3">3s</option>
                        <option value="5">5s</option>
                        <option value="10">10s</option>
                    </select>
                    {/* <select
                        className="px-4 py-2 bg-slate-100 rounded-xl border"
                        value={photoCount}
                        onChange={(e) => setPhotoCount(Number(e.target.value))}
                    >
                        <option value="4">4 picture</option>
                        <option value="6">6 picture</option>
                    </select> */}
                   
                </div>
                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
        </div>
    );
};

export default React.memo(Camera);

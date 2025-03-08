"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGallery } from "@/context/galleryContext";

const Gallery = () => {
    const { gallery, setGallery } = useGallery();
    const [isReversed, setIsReversed] = useState(true); // Toggle inversion
    const canvasRef = useRef(null);

    useEffect(() => {
        if (gallery.length === 0) return;
    
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
    
        // Use device pixel ratio for best quality
        const scaleFactor = window.devicePixelRatio || 2; 
        const imgWidth = 170 * scaleFactor;
        const imgHeight = 170 * scaleFactor;
        const gap = 10 * scaleFactor;
        const padding = 20 * scaleFactor;
        const textHeight = 40 * scaleFactor; // Space for "PicaBooth" footer
        const cols = 2;
        const orderedGallery = isReversed ? gallery.slice().reverse() : gallery;
    
        const rows = Math.ceil(orderedGallery.length / cols);
        canvas.width = cols * (imgWidth + gap) - gap + 2 * padding;
        canvas.height = rows * (imgHeight + gap) - gap + 2 * padding + textHeight; // Add space for text
    
        canvas.style.width = `${canvas.width / scaleFactor}px`;
        canvas.style.height = `${canvas.height / scaleFactor}px`;
        ctx.scale(scaleFactor, scaleFactor);
        ctx.imageSmoothingEnabled = false;
    
        // Fill background with light blue
        ctx.fillStyle = "#ADD8E6";
        ctx.fillRect(0, 0, canvas.width / scaleFactor, canvas.height / scaleFactor);
    
        // Load and draw images
        orderedGallery.forEach((item, index) => {
            const image = new Image();
            image.src = item;
            image.crossOrigin = "anonymous";
    
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = col * (imgWidth + gap) / scaleFactor + padding / scaleFactor;
            const y = row * (imgHeight + gap) / scaleFactor + padding / scaleFactor;
    
            image.onload = () => {
                ctx.drawImage(image, x, y, imgWidth / scaleFactor, imgHeight / scaleFactor);
            };
        });
    
        // Draw "PicaBooth" footer
        ctx.fillStyle = "black";
        ctx.font = `${20 * (scaleFactor / 1)}px poppins`;
        ctx.textAlign = "center";
        ctx.fillText("March 3, 2025 9:20PM", canvas.width / (2 * scaleFactor), canvas.height / scaleFactor - 15);
    }, [gallery, isReversed]);
    

    // Download the high-quality merged image
    const downloadMergedImage = () => {
        const canvas = canvasRef.current;
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png", 1.0); // High-quality PNG
        link.download = "gallery.png";
        link.click();
    };

    // Reset gallery & clear canvas
    const resetGallery = () => {
        setGallery([]);
        localStorage.removeItem("photoGallery");

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ADD8E6";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div className="text-center mx-auto">
            <h1 className="font-bold text-2xl mb-4">Picabooth</h1>
            <h2 className="font-bold mt-5">Captured Photos</h2>
            <canvas ref={canvasRef} className="border border-black my-2 p-4 mx-auto"></canvas>
            <div className="flex justify-center gap-4 mt-4">
                <button
                    onClick={() => setIsReversed(!isReversed)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                    {isReversed ? "Show Normal Order" : "Show Reversed Order"}
                </button>
                <button
                    onClick={downloadMergedImage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Download Image
                </button>
                <button
                    onClick={resetGallery}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default React.memo(Gallery);

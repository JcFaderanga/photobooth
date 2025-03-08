"use client";
import React, { useEffect, useRef } from "react";
import { useGallery } from "@/context/galleryContext";

const Gallery = () => {
    const { gallery, setGallery } = useGallery();
    const revereGallery = gallery.slice().reverse(); // Maintain reversed order
    const canvasRef = useRef(null);
    
    useEffect(() => {
        if (gallery.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Image & Grid Settings
        const imgWidth = 150;
        const imgHeight = 150;
        const gap = 10; // Space between images
        const padding = 10; // Padding around content
        const cols = 2; // 2-column grid
        const rows = Math.ceil(revereGallery.length / cols);

        // Set canvas size dynamically (including padding)
        canvas.width = cols * (imgWidth + gap) - gap + 2 * padding;
        canvas.height = rows * (imgHeight + gap) - gap + 2 * padding;

        // Fill canvas background with light blue
        ctx.fillStyle = "#ADD8E6"; // Light blue
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Load and draw images
        revereGallery.forEach((item, index) => {
            const image = new Image();
            image.src = item;
            image.crossOrigin = "anonymous"; // Prevent CORS issues

            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = col * (imgWidth + gap) + padding;
            const y = row * (imgHeight + gap) + padding;

            image.onload = () => {
                ctx.drawImage(image, x, y, imgWidth, imgHeight);
            };
        });
    }, [gallery]);

    // Function to download the merged image
    const downloadMergedImage = () => {
        const canvas = canvasRef.current;
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "gallery.png";
        link.click();
    };

    // Function to reset the gallery & clear the canvas
    const resetGallery = () => {
        setGallery([]); // Clear the gallery state
        localStorage.removeItem("photoGallery"); // Remove from local storage

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.fillStyle = "#ADD8E6"; // Reset to light blue
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div className="text-center">
            <h1 className="font-bold text-2xl mb-4">Picabooth</h1>
            <h2 className="font-bold mt-5">Captured Photos</h2>
            <canvas ref={canvasRef} className=" my-2 p-4"></canvas>
            <div className="flex justify-center gap-4 mt-8">
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

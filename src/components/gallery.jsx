"use client";
import React,{useState} from "react";
import { useGallery } from "@/context/galleryContext";

const Gallery = () => {
    const { gallery, setGallery } = useGallery();

    const downloadPhoto = (image) => {
        const a = document.createElement("a");
        a.href = image;
        a.download = "captured-image.png";
        a.click();
      };
    
      const clearGallery = () => {
        setGallery([]);
        localStorage.removeItem("photoGallery");
      };
    
    return (
    <div className="gallery-section">
        <h2>Captured Photos</h2>
        <button onClick={clearGallery}>Clear Gallery</button>
        <div className="gallery">
            {gallery.map((img, index) => (
                <div key={index} className="gallery-item">
                    <img src={img} alt={`Captured ${index}`} className="gallery-image" />
                    <button onClick={() => downloadPhoto(img)}>Download</button>
                </div>
            ))}
        </div>
    </div>
    );
    }

    export default Gallery;
    
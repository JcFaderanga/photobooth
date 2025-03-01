"use client";
import React,{useState} from "react";
import { useGallery } from "@/context/galleryContext";
import Image from "next/image";
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
    <div className="">
        <h2 className="font-bold text-center mt-5">Captured Photos</h2>
        <button onClick={clearGallery} className="bg-red-300 font-bold px-4 py-1 text-white rounded-xl my-2">Clear Gallery</button>
        <div className="flex justify-center flex-wrap">
            {gallery.map((img, index) => (
                <div key={index} className=" ">
                    <Image 
                        src={img} 
                        alt={`Captured ${index}`} 
                        width={150} 
                        height={150} 
                        className="  mx-4 rounded-xl" 
                    />
                    <button onClick={() => downloadPhoto(img)}>Download</button>
                </div>
            ))}
        </div>
    </div>
    );
    }

    export default Gallery;
    
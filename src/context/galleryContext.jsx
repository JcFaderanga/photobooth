"use client"
import React, { useState, useEffect, useContext, createContext } from "react";

// Create the context
const GalleryContext = createContext();

// GalleryProvider component to provide the context
export const GalleryProvider = ({ children }) => {
    const [gallery, setGallery] = useState([]);

    useEffect(() => {
        const savedPhotos = JSON.parse(localStorage.getItem("photoGallery")) || [];
        setGallery(savedPhotos);
    }, []);

    return (
        <GalleryContext.Provider value={{ gallery, setGallery }}>
            {children}
        </GalleryContext.Provider>
    );
};

// Custom hook to use the GalleryContext
export const useGallery = () => {
    return useContext(GalleryContext);
};

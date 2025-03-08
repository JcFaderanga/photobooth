"use client"
import React, { useState, useEffect, useContext, createContext } from "react";

// Create the context
const GalleryContext = createContext();

// GalleryProvider component to provide the context
export const GalleryProvider = ({ children }) => {
    const [gallery, setGallery] = useState([]);
    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        const savedPhotos = JSON.parse(localStorage.getItem("photoGallery")) || [];
        setGallery(savedPhotos);
    }, []);

    return (
        <GalleryContext.Provider value={{ gallery, setGallery,photo, setPhoto }}>
            {children}
        </GalleryContext.Provider>
    );
};

// Custom hook to use the GalleryContext
export const useGallery = () => {
    return useContext(GalleryContext);
};

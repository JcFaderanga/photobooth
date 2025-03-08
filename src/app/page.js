"use client"
import Camera from "../components/camera";
import Gallery from "../components/gallery";
import { useGallery } from "@/context/galleryContext";
export default function Home() {
const { gallery} = useGallery();
return (
    <>
    <h1>Take a Photo & Download</h1>
        <div className="lg:flex">
                <div className=" lg:w-1/2 flex justify-center"> 
                    <Camera />
                </div>
            <div className=" lg:w-1/2 flex justify-center"> 
            {gallery.length > 0 &&  <Gallery />}
            </div>
        </div>
    </>
);
}


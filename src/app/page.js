"use client"
import Camera from "../components/camera";
import Gallery from "../components/gallery";
import { useGallery } from "@/context/galleryContext";
export default function Home() {
const { gallery} = useGallery();
return (
    <>
        <div className="lg:h-screen w-full lg:flex bg-slate-100">
                <div className="h-full lg:w-1/2 py-4 flex justify-center lg:items-center"> 
                    <Camera />
                </div>
            <div className=" lg:w-1/2 flex justify-center lg:items-center"> 
            {gallery.length > 0 &&  <Gallery />}
            </div>
        </div>
    </>
);
}


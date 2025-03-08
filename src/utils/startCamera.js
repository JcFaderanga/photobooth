// export const startCamera = async (videoRef) => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//            return videoRef.current.srcObject = stream;
//       }
//         //  setPhoto(null);
//     } catch (error) {
//       console.error("Error accessing camera:", error);
//       alert("Could not access camera. Please check permissions.");
//     }
//   };

//   startCamera();
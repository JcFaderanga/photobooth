export const downloadPhoto = (image) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = "captured-image.png";
    a.click();
  };
"use client";

import { useState, useEffect } from "react";

export default function ImageUploader() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch images on load
  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    const res = await fetch("/api/images");
    const data = await res.json();
    setImages(data);
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;

      setLoading(true);
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          img1: base64String,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success) {
        fetchImages(); // refresh the list
      } else {
        alert("Upload failed: " + data.error);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="mt-24 mb-10 flex flex-col justify-center items-center">
      <h2 className="text-xl font-bold mb-4">Upload Image</h2>
      <input type="file" onChange={handleUpload} className="border-2 border-cyan-300 cursor-pointer text-center"/>
      {loading && <p>Uploading...</p>}

      <h3 className="mt-6 text-lg font-semibold">Uploaded Images:</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
        {images.map((img) => (
          <div key={img._id} className="border p-2 rounded">
            <img src={img.img1} alt={img.fileName || "image"} className="w-full h-auto text-center" />
            <p className="text-sm mt-1">{img.fileName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

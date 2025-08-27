"use client";

import { useState, useEffect } from "react";

export default function ImageUploader() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null); // store clicked image

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
    <div className="mt-24 mb-10 flex flex-col justify-center items-center px-6">
      {/* Title */}
      <h2 className="text-3xl font-bold text-cyan-400 drop-shadow-lg mb-6">
        🚀 Upload Your Image
      </h2>

      {/* File Input */}
      <label className="flex flex-col items-center justify-center w-80 h-32 
        border-2 border-dashed border-cyan-400 rounded-2xl 
        cursor-pointer bg-white/10 backdrop-blur-xl shadow-lg 
        hover:bg-cyan-400/10 hover:border-cyan-300 transition-all duration-300">
        <span className="text-cyan-300 font-semibold">
          📂 Choose an image to upload
        </span>
        <input type="file" onChange={handleUpload} className="hidden" />
      </label>

      {loading && (
        <p className="mt-4 text-cyan-200 font-medium animate-pulse">
          ⏳ Uploading...
        </p>
      )}

      {/* Uploaded Images */}
      <h3 className="mt-10 text-2xl font-semibold text-cyan-300">
        🌌 Uploaded Images
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {images.map((img) => (
          <div
            key={img._id}
            className="p-3 rounded-2xl bg-white/10 backdrop-blur-xl 
                       border border-cyan-300/30 shadow-md hover:shadow-cyan-400/50 
                       transition-transform hover:scale-[1.03] cursor-pointer"
            onClick={() => setSelectedImg(img.img1)} // set clicked image
          >
            <img
              src={img.img1}
              alt={img.fileName || "image"}
              className="w-full h-40 object-cover rounded-xl"
            />
            
          </div>
        ))}
      </div>

      {/* Fullscreen Image Modal */}
      {selectedImg && (
        <div
          className="fixed inset-0 flex items-center justify-center 
                     bg-black/80 backdrop-blur-xl z-50 transition-opacity duration-300"
          onClick={() => setSelectedImg(null)} // close when clicked
        >
          <img
            src={selectedImg}
            alt="preview"
            className="max-w-4xl max-h-[80vh] rounded-2xl shadow-2xl border-4 border-cyan-300"
          />
        </div>
      )}
    </div>
  );
}

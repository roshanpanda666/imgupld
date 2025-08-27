"use client";
import React, { useEffect } from "react";
import ImageUploader from "./components/imgup";
import Nav from "./components/nav";

const Page = () => {
  // 👇 hit NLPengine once on page load
  useEffect(() => {
    fetch("/api/NLPengine")
      .then((res) => console.log("✅ NLPengine triggered"))
      .catch((err) => console.error("❌ Failed to start NLPengine:", err));
  }, []);

  return (
    <div>
      <Nav />
      <div>
        <ImageUploader />
      </div>
    </div>
  );
};

export default Page;

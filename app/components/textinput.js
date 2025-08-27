"use client";
import React, { useRef } from "react";

const Textinput = () => {
  const inputRef = useRef(null);
  const userRef = useRef(null);

  const submitfun = async () => {
    const value = inputRef.current.value;
    const value2 = userRef.current.value;

    if (!value.trim()) {
      alert("Please enter some text before posting!");
      return;
    }
    if (!value2.trim()) {
      alert("Please enter user name before posting!");
      return;
    }

    let response = await fetch("/api/userget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: value2,
        content: value,
        badword: "false",
      }),
    });

    const result = await response.json();
    if (result.success) {
      alert("✅ Data posted successfully!");
      inputRef.current.value = "";
      userRef.current.value = "";
    } else {
      alert("❌ Failed to post data");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 rounded-2xl shadow-lg 
                    bg-white/10 backdrop-blur-xl border border-white/20 w-full max-w-xl mx-auto">
      {/* Username */}
      <div className="w-full">
        <label className="block mb-2 text-white font-semibold text-lg">
          👤 Username
        </label>
        <input
          type="text"
          ref={userRef}
          placeholder="Enter your username"
          className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white 
                     placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 
                     focus:border-cyan-400 transition-all"
        />
      </div>

      {/* Content */}
      <div className="w-full">
        <label className="block mb-2 text-white font-semibold text-lg">
          📝 Post Content
        </label>
        <textarea
          ref={inputRef}
          placeholder="What’s on your mind?"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white 
                     placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 
                     focus:border-pink-400 transition-all resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={submitfun}
        className="px-6 py-3 rounded-full font-bold text-white text-lg 
                   bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500
                   shadow-lg hover:scale-105 hover:shadow-xl 
                   transition-transform duration-300 ease-in-out"
      >
        🚀 Post
      </button>
    </div>
  );
};

export default Textinput;

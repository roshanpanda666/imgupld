"use client";
import React, { useRef } from "react";

const Textinput = () => {
  const inputRef = useRef(null);
  const userRef=useRef(null)

  const submitfun = async() => {
    const value = inputRef.current.value;
    const value2=userRef.current.value
    if (!value.trim()) {
      alert("Please enter some text before posting!");
      return;
    }
    if (!value2.trim()) {
        alert("Please enter user name before posting!");
        return;
      }

      let response= await fetch("/api/userget",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            user:value2,
            content:value,
            badword:"false",
        }),
      })
      const result=await response.json()
      if(result.success){
        alert("data posted successfully")
        alert(`You posted: ${value}`);
        alert(`user name: ${value2}`)
        inputRef.current.value = ""; // clear after posting
        userRef.current.value = ""; // clear after posting
      }
      else{
        alert("failed to post data")
      }

  };

  return (
    <div className="flex flex-col justify-center items-center">
        <div className="flex-col">
        <div className="mb-2 font-semibold">Text Input</div>
      <input
        type="text"
        ref={inputRef}
        placeholder="Enter your text you want to post"
        className="w-96 text-center h-16 border-2 rounded"
      />
        <div className="mb-2 font-semibold mt-3">User Name</div>
        <input
        type="text"
        ref={userRef}
        placeholder="Enter your username"
        className="w-96 text-center h-16 border-2 rounded"
      />
        </div>
      
      <button
        className="bg-black hover:text-cyan-200 text-white mt-7 border-2 w-20 rounded-3xl"
        onClick={submitfun}
      >
        Post
      </button>
    </div>
  );
};

export default Textinput;

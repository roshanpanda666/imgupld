"use client";

import { useEffect, useState } from "react";
import Textinput from "../components/textinput";
import Nav from "../components/nav";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState({});

  // 🔥 Fetch users + sort latest first
  async function fetchUsers() {
    try {
      const res = await fetch("/api/userget");
      const data = await res.json();
      const sorted = data.sort((a, b) => (a._id < b._id ? 1 : -1));
      setUsers(sorted);
      setLoading(false);
    } catch (err) {
      console.error("⚠️ Failed to fetch users:", err);
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchUsers();

    // ⏳ Poll every 2s
    const interval = setInterval(fetchUsers, 2000);

    // 🔥 Live change listener (SSE)
    const eventSource = new EventSource("/api/userstream");
    eventSource.onmessage = (event) => {
      const change = JSON.parse(event.data);
      console.log("📡 Change:", change);

      if (change.operationType === "insert") {
        setUsers((prev) => [change.fullDocument, ...prev]);
      }
      if (change.operationType === "delete") {
        setUsers((prev) =>
          prev.filter((u) => u._id !== change.documentKey._id)
        );
      }
      if (change.operationType === "update") {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === change.documentKey._id
              ? { ...u, ...change.updateDescription.updatedFields }
              : u
          )
        );
      }
    };

    return () => {
      eventSource.close();
      clearInterval(interval);
    };
  }, []);

  // 🗑️ Delete Handler
  const handleDelete = async (id) => {
    if (!confirm("⚠️ Are you sure you want to delete this user?")) return;

    const res = await fetch("/api/userget", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (data.success) {
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } else {
      alert("❌ Failed to delete user");
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading users...</p>;
  if (!users.length)
    return <p className="text-center text-gray-500">No users found.</p>;

  return (
    <div className="grid gap-6 px-4 max-w-2xl mx-auto">
      <Nav />
      <div className="mt-6">
        <Textinput />
      </div>

      {users.map((user) => {
        const isBad = user?.badword === "true";
        const isRevealed = revealed[user._id];

        return (
          <div
            key={user._id}
            className="relative p-6 rounded-2xl shadow-lg border border-white/20 
                       bg-white/10 backdrop-blur-3xl 
                       transition-transform duration-300 hover:scale-[1.02] 
                       flex justify-between items-start gap-4"
          >
            {/* Card Content */}
            <div className="flex-1">
              <h3 className="font-semibold text-xl text-white">{user.user}</h3>
              <p className="text-gray-200 mt-2">📜 {user.content}</p>
              <p className="text-sm text-gray-400 mt-1">
                badword: {String(user.badword)}
              </p>
            </div>

            {/* 🗑️ Delete Button */}
            <button
              onClick={() => handleDelete(user._id)}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 
                         text-white text-sm font-bold rounded-lg shadow-md transition-all"
            >
              Delete
            </button>

            {/* Overlay for NSFW */}
            {isBad && !isRevealed && (
              <div
                className="absolute inset-0 flex items-center justify-center 
                           rounded-2xl bg-black/90 backdrop-blur-3xl 
                           transition-opacity duration-500"
                onClick={() =>
                  setRevealed((prev) => ({ ...prev, [user._id]: true }))
                }
              >
                <button className="px-6 py-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 
                                   text-white font-bold rounded-full shadow-xl 
                                   hover:scale-110 transition-transform">
                  🔞 Tap to reveal
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

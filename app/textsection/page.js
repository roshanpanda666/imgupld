"use client";

import { useEffect, useState } from "react";
import Textinput from "../components/textinput";
import Nav from "../components/nav";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch existing users once
    fetch("/api/userget")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false); // ✅ fix loading state
      });

    // Listen for DB changes via SSE
    const eventSource = new EventSource("/api/userstream");

    eventSource.onmessage = (event) => {
      const change = JSON.parse(event.data);
      console.log("📡 Change:", change);

      if (change.operationType === "insert") {
        const newUser = change.fullDocument;
        setUsers(prev => [newUser, ...prev]);
      }
      if (change.operationType === "delete") {
        setUsers(prev => prev.filter(u => u._id !== change.documentKey._id));
      }
      if (change.operationType === "update") {
        // you can fetch again or patch the user in state
      }
    };

    // cleanup on unmount
    return () => eventSource.close();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (!users.length) return <p>No users found.</p>;

  return (
    <div className="grid gap-4">
      <Nav />
      <div className="mt-9">
        <Textinput />
      </div>

      {users.map((user) => {
  const isBad = user?.badword === "true"; // ✅ only true is "bad"

  return (
    <div
      key={user._id}
      className={`p-4 rounded shadow border-2 ${
        isBad ? "border-red-500" : "border-green-500"
      }`}
    >
      <h3 className="font-bold text-lg">{user.user}</h3>
      <p>content: {user.content}</p>
      <p>badword: {String(user.badword)}</p>
    </div>
  );
})}

    </div>
  );
}

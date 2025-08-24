"use client";

import { useEffect, useState } from "react";
import Textinput from "../components/textinput";
import Nav from "../components/nav";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/userget");
      const data = await res.json();
      setUsers(data); // assuming data is an array of users
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setLoading(false);
    }
  }

  if (loading) return <p>Loading users...</p>;
  if (!users.length) return <p>No users found.</p>;

  return (
    <div className="grid gap-4">
        <Nav></Nav>
            <div className="mt-9">
                <Textinput></Textinput>
            </div>
      {users.map((user) => (
        <div key={user._id} className="border p-4 rounded shadow">
          <h3 className="font-bold text-lg">{user.user}</h3>
          <p>content: {user.content}</p>
        </div>
      ))}
    </div>
  );
}

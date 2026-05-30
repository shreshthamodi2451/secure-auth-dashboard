"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    email: "",
    role: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setUser({
      username: localStorage.getItem("username") || "",
      email: localStorage.getItem("email") || "",
      role: localStorage.getItem("role") || "user"
    });
  }, [router]);

  return (
    <div className="glass-card">

      <h1 className="title">Profile</h1>

      <div className="form-group">
        <label>Username</label>
        <p>{user.username}</p>
      </div>

      <div className="form-group">
        <label>Email</label>
        <p>{user.email}</p>
      </div>

      <div className="form-group">
        <label>Role</label>
        <p>{user.role}</p>
      </div>

      <button
        className="glass-btn"
        onClick={() => router.push("/dashboard")}
      >
        Back to Dashboard
      </button>

    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePassword() {

  const router = useRouter();

  const [formData, setFormData] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
});

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        if (formData.newPassword !== formData.confirmPassword) {
  setMessage("New passwords do not match.");
  return;
}

        

      const token = localStorage.getItem("token");

      if (formData.newPassword.length < 6) {
  setMessage("Password must be at least 6 characters.");
  return;
}

      const response = await fetch(
        "http://localhost:5001/api/change-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setMessage("Password updated successfully!");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);

    } catch (err) {

      setMessage(err.message);
    }
  };

  return (
    <div className="glass-card">

      <h1 className="title">
        Change Password
      </h1>

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <input
            className="glass-input"
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={formData.currentPassword}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <input
            className="glass-input"
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
  <input
    className="glass-input"
    type="password"
    name="confirmPassword"
    placeholder="Confirm New Password"
    value={formData.confirmPassword}
    onChange={handleChange}
  />
</div>

        <button className="glass-btn" type="submit">
          Update Password
        </button>

      </form>

      {message && (
        <p style={{ marginTop: "1rem" }}>
          {message}
        </p>
      )}

    </div>
  );
}
// User enters signup details
// ↓
// React stores values in state
// ↓
// Frontend validates inputs
// ↓
// POST request sent to backend
// ↓
// Backend creates account
// ↓
// Success message shown
// ↓
// Redirect to login page
"use strict";
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, UserPlus, AlertCircle, CheckCircle } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
  username: "",
  email: "",
  password: "",
  role: "user"
}); //stores form input values for username, email, password, and confirm password. We use the useState hook to create a state variable called formData, which is an object that holds the values of these input fields. The setFormData function is used to update this state whenever the user types into the input fields. This allows us to keep track of what the user has entered and use that information when they submit the form to register with the backend API.
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // If already authenticated, skip registration and redirect to dashboard
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, [router]);
  //checks if already logged in by looking for token in local storage when the component mounts. If a token is found, it means the user is already authenticated, and we redirect them to the dashboard page. This prevents authenticated users from accessing the registration page unnecessarily and provides a smoother user experience by taking them directly to their dashboard if they are already logged in.

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Clear errors on keystroke
  }; //Update only the field user changed while keeping all others. 



  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields.");
      return false;
    }
    if (formData.username.trim().length < 3) {
      setError("Username must be at least 3 characters long.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    //e.preventDefault() is used to prevent the default form submission behavior, which would cause a page reload. If the validation passes, we proceed with sending the registration request to the backend API.

    setLoading(true);
    setError("");
    setSuccess("");

    //send api request
    try {
      const response = await fetch("http://localhost:5001/api/register", {
        method: "POST", //frontend is sending data to backend to create a new user, so we use POST method
        headers: { "Content-Type": "application/json" }, //tells backend json is coming in request body
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }) //converts js object to json string
      });

      const data = await response.json();

      console.log("Register Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Registration failed. Please try again.");
      }

      localStorage.setItem(
  "pendingUserId",
  data.userId
);

setSuccess(
  "Verification code sent to your email."
);

setTimeout(() => {
  router.push("/verify-email");
}, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
        <div className="user-avatar-placeholder" style={{ width: "60px", height: "60px", fontSize: "1.5rem", marginBottom: 0 }}>
          <UserPlus size={24} />
        </div>
      </div>

      <h1 className="title">Create Account</h1>
      <p className="subtitle">Sign up now to explore your secure, personal workspace portal</p>

      {error && (
        <div className="alert-box alert-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert-box alert-success">
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="username">
            <User size={14} /> Username
          </label>
          <div className="input-wrapper">
            <input
              className="glass-input"
              type="text"
              id="username"
              name="username"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <User className="input-icon" size={18} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">
            <Mail size={14} /> Email Address
          </label>
          <div className="input-wrapper">
            <input
              className="glass-input"
              type="email"
              id="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Mail className="input-icon" size={18} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            <Lock size={14} /> Password
          </label>
          <div className="input-wrapper">
            <input
              className="glass-input"
              type="password"
              id="password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Lock className="input-icon" size={18} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">
            <Lock size={14} /> Confirm Password
          </label>
          <div className="input-wrapper">
            <input
              className="glass-input"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <Lock className="input-icon" size={18} />
          </div>
        </div>

        {/* role dropdown */}
        <div className="form-group">
            <label className="form-label">
              Select Role
            </label>

          <select
            className="glass-input"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
         </select>
        </div>

        <button className="glass-btn" type="submit" disabled={loading}>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <>
              Sign Up <UserPlus size={18} />
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account?
        <Link href="/login" className="auth-link">
          Sign in instead
        </Link>
      </div>
    </div>
  );
}
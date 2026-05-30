"use strict";
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; //for client-side navigation in nextjs app router. Link is a component provided by Next.js that allows us to create links between different pages in our application. It enables client-side navigation, which means that when a user clicks on a Link, Next.js will load the new page without doing a full page refresh, resulting in a faster and smoother user experience. In this login page, we will use Link to provide a link to the registration page for users who do not have an account yet.
import { Mail, Lock, LogIn, AlertCircle, Sparkles } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" }); //stores from input values for email and password. We use the useState hook to create a state variable called formData, which is an object that holds the values of the email and password fields. The setFormData function is used to update this state whenever the user types into the input fields. This allows us to keep track of what the user has entered and use that information when they submit the form to authenticate with the backend API.
  const [error, setError] = useState(""); //stores any error messages that may occur during the login process. We use the useState hook to create a state variable called error, which is initially an empty string. If there is an error during the login process (such as invalid credentials or a network issue), we will set this error state to an appropriate error message. This allows us to display feedback to the user about what went wrong, so they can take corrective action (like checking their email and password or trying again later).
  const [success, setSuccess] = useState(""); //stores success messages, similar to error state
  const [loading, setLoading] = useState(false); //tracks whether the login request is running. used for spinner and to disable the login button while the request is in progress. We use the useState hook to create a state variable called loading, which is initially set to false. Once we receive a response from the backend API (whether it's a success or an error), we set loading back to false to allow the user to interact with the form again if needed.

  // If already authenticated, skip login and redirect to dashboard
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Clear error when user starts typing
  };
  //e is event object, contains info abt input evnt 
  //this function works everytime a user types in the input fields, react automatically passes it using e  and e.target becomes the input element, so in this e.target.name is email and e.target.value is the entered input so its like "email": abc@gm.com, and we use the spread operator ...formData to keep the other field values unchanged when we update one field. it copies old object value setformdata updates react state. 
//   //Whenever user types:
// ↓
// Find which input changed
// ↓
// Get its value
// ↓
// Update only that field in state
// ↓
// Keep all other fields unchanged
// ↓
// Clear old errors


  
// 1. Form submission
// 2. Validation
// 3. API request
// 4. Backend authentication
// 5. Error handling
// 6. Token storage
// 7. Redirecting user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    // Basic email format validation, this async runs whenevr user submits form, we first prevent the default form submission behavior using e.preventDefault() to handle the submission with our custom logic. We then check if both the email and password fields are filled out. If either field is empty, we set an error message prompting the user to fill in all fields and return early to prevent further processing. This ensures that we don't attempt to authenticate with the backend API if the user hasn't provided the necessary information, which can help reduce unnecessary API calls and provide immediate feedback to the user about what they need to do.aysnc coz api request take time.

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5001/api/login", 
        
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      //await fetch waits for backend response before moving to next line of code. This allows us to handle the asynchronous nature of API calls in a more readable way. We send a POST request to the /api/login endpoint of our backend server, including the email and password from the formData state in the request body as JSON. The backend will process this request, authenticate the user, and respond with either a success message and token or an error message if authentication fails.

    //Receive credentials
    // ↓
    // Search user in database
    // ↓
    // Compare password
    // ↓
    // Generate JWT token
    // ↓
    // Return token + user data

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed. Please check your credentials.");
      }

      setSuccess("OTP sent to your email.");

localStorage.setItem(
  "pendingUserId",
  data.userId
);

setTimeout(() => {
  router.push("/otp");
}, 1000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
        <div className="user-avatar-placeholder animate-spin-slow" style={{ width: "60px", height: "60px", fontSize: "1.5rem", marginBottom: 0 }}>
          <Sparkles size={24} />
        </div>
      </div>
      
      <h1 className="title">Welcome Back</h1>
      <p className="subtitle">Securely log in to access your custom visual dashboard metrics</p>

      {error && (
        <div className="alert-box alert-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert-box alert-success">
          <LogIn size={20} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Lock className="input-icon" size={18} />
          </div>
        </div>

        <button className="glass-btn" type="submit" disabled={loading}>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <>
              Sign In <LogIn size={18} />
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        Don&apos;t have an account?
        <Link href="/register" className="auth-link">
          Register here
        </Link>
      </div>
    </div>
  );
}
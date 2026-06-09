"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmailOTPPage() {

  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Send OTP automatically when page loads
  useEffect(() => {

    const sendOTP = async () => {

      try {

        const userId =
          localStorage.getItem(
            "pendingUserId"
          );

        await fetch(
          "http://localhost:5001/api/send-login-otp",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              userId
            })
          }
        );

      } catch (error) {

        console.error(error);

      }

    };

    sendOTP();

  }, []);

  const handleVerify = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const userId =
        localStorage.getItem(
          "pendingUserId"
        );

      const response = await fetch(
        "http://localhost:5001/api/verify-login-otp",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            userId,
            otp
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.error ||
          "Verification failed."
        );

      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "username",
        data.username
      );

      localStorage.setItem(
        "email",
        data.email
      );

      localStorage.setItem(
        "role",
        data.role
      );

      localStorage.removeItem(
        "pendingUserId"
      );

      router.push(
        "/dashboard"
      );

    } catch (err) {

      setError(
        err.message
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="glass-card">

      <h1 className="title">
        Email Verification
      </h1>

      <p className="subtitle">
        Enter the OTP sent to your email.
      </p>

      {error && (
        <div className="alert-box alert-error">
          {error}
        </div>
      )}

      <form onSubmit={handleVerify}>

        <div className="form-group">

          <label className="form-label">
            OTP Code
          </label>

          <input
            className="glass-input"
            type="text"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
            placeholder="123456"
            required
          />

        </div>

        <button
          className="glass-btn"
          type="submit"
          disabled={loading}
        >

          {loading
            ? "Verifying..."
            : "Verify OTP"}

        </button>

      </form>

    </div>
  );
}
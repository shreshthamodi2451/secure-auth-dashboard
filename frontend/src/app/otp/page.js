"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OTPPage() {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const userId =
        localStorage.getItem("pendingUserId");

      const response = await fetch(
        "http://localhost:5001/api/login/verify-2fa",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId,
            otp
          })
        }
      );

      const data = await response.json();

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

      router.push("/dashboard");

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="glass-card">
      <h1 className="title">
        Two-Factor Authentication
      </h1>

      <p className="subtitle">
        Open Microsoft Authenticator and enter
        the 6-digit verification code.
      </p>

      {error && (
        <div className="alert-box alert-error">
          {error}
        </div>
      )}

      <form onSubmit={handleVerify}>
        <div className="form-group">
          <label className="form-label">
            Verification Code
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
            : "Verify Code"}
        </button>
      </form>
    </div>
  );
}
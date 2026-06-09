"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmail() {

  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {

    try {

      const userId =
        localStorage.getItem(
          "pendingUserId"
        );

      const response = await fetch(
        "http://localhost:5001/api/verify-email",
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
          data.error
        );
      }

      router.push("/login");

    } catch (err) {

      setError(
        err.message
      );

    }

  };

  return (
    <div>
      <h1>
        Verify Email
      </h1>

      <input
        type="text"
        value={otp}
        onChange={(e) =>
          setOtp(e.target.value)
        }
        placeholder="Enter OTP"
      />

      <button
        onClick={handleVerify}
      >
        Verify Email
      </button>

      {error && (
        <p>{error}</p>
      )}
    </div>
  );

}
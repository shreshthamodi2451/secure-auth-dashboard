'use client';

import { useState } from 'react';
import { useRouter } from "next/navigation";

export default function Setup2FA() {

  const router = useRouter();
    const [qrCode, setQrCode] = useState('');
    const [otp, setOtp] = useState('');
const [message, setMessage] = useState('');

 const generateQR = async () => {
  try {

    const userId =
      localStorage.getItem("userId");

    console.log("UserId:", userId);

    const response = await fetch(
      "http://localhost:5001/api/enable-2fa",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId
        })
      }
    );

    const data = await response.json();

    console.log("Response:", data);

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to generate QR"
      );
    }

    setQrCode(data.qrCode);

  } catch (error) {

    console.error(error);

  }
};



const verify2FA = async () => {

  try {

    const userId =
      localStorage.getItem("userId");
      

    const response = await fetch(
      "http://localhost:5001/api/verify-2fa",
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
        data.error || "Verification failed"
      );
    }

    // 2FA successfully enabled

    setMessage(
      "2FA Enabled Successfully!"
    );

    // Store pending user for login step
    localStorage.setItem(
      "pendingUserId",
      userId
    );

    // Redirect to OTP login page
    setTimeout(() => {
      router.push("/otp");
    }, 1000);

  } catch (error) {

    setMessage(
      error.message
    );

  }

};



  return (
    <div>
      <h1>Setup Two Factor Authentication</h1>

      {message && (
  <p>{message}</p>
)}

      <button onClick={generateQR}>
        Generate QR Code
      </button>

      {qrCode && (
  <>
    <img
      src={qrCode}
      alt="2FA QR Code"
      style={{ width: "300px" }}
    />

    <br />
    <br />

    <input
      type="text"
      placeholder="Enter 6-digit code"
      value={otp}
      onChange={(e) =>
        setOtp(e.target.value)
      }
    />

    <br />
    <br />

    <button
      onClick={verify2FA}
    >
      Verify & Enable 2FA
    </button>
  </>
)}

    </div>
  );

}
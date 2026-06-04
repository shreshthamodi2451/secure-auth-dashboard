'use client';

import { useState } from 'react';

export default function Setup2FA() {

    const [qrCode, setQrCode] = useState('');

  const generateQR = async () => {

  const userId =
    localStorage.getItem('pendingUserId');

  const response = await fetch(
    'http://localhost:5001/api/enable-2fa',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId
      })
    }
  );

  const data = await response.json();

 setQrCode(data.qrCode);

};

  return (
    <div>
      <h1>Setup Two Factor Authentication</h1>

      <button onClick={generateQR}>
        Generate QR Code
      </button>

      {qrCode && (
  <img
    src={qrCode}
    alt="2FA QR Code"
    style={{ width: '300px' }}
  />
)}

    </div>
  );

}
// 1. Registering users
// 2. Logging users in
// 3. Creating JWT tokens
// 4. Verifying tokens
// 5. Protecting routes
// 6. Returning authenticated user data
require('dotenv').config(); //for pw and keys

const nodemailer = require("nodemailer");
const express = require('express'); //import express framework for building backend server
const cors = require('cors'); //allows fe and be to communicate 
const bcrypt = require('bcryptjs'); //for password hashing
const jwt = require('jsonwebtoken');// used for jwt authentication, jwt- json web token, creates secure login tokens.

const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const transporter = require("./config/email");
const connectDB = require("./config/db");
const User = require("./models/User");

const app = express(); //creates backend server app
const PORT = process.env.PORT || 5000; //be server port, if enc missing use 5000 as default. We will run this server on port 5000, and our frontend will run on port 3000. This separation allows us to develop and test the frontend and backend independently while still enabling them to communicate with each other through API calls. The PORT variable is set to either the value from the environment variable (which can be configured in a .env file) or defaults to 5000 if the environment variable is not set. This flexibility allows us to easily change the port number without modifying the code, which can be useful in different deployment environments or when running multiple services locally.
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_12345'; //used to sign and verify JWT tokens. In a production environment, you should set this to a strong, unique value in your .env file and never hardcode it in your codebase. The JWT_SECRET is crucial for the security of your authentication system, as it is used to create the signature of the JWT tokens. If an attacker gains access to this secret, they could potentially forge valid tokens and gain unauthorized access to protected routes. Therefore, it's important to keep this value secure and not expose it in your code or version control.

connectDB();

// Middleware- imp express concept runs before route handlers to process incoming requests. We use cors middleware to enable cross-origin resource sharing, allowing our frontend (running on a different port) to communicate with our backend API. The express.json() middleware is used to parse incoming JSON request bodies, making it easier to access the data sent from the frontend in our route handlers. By using these middlewares, we ensure that our backend can handle requests from the frontend and process the data correctly before it reaches our route handlers for registration, login, and protected routes. route handlers are funtions in the backend that handle incoming api requests, process them, and send back responses. They are defined for specific endpoints (like /api/register or /api/login) and HTTP methods (like POST or GET). In these handlers, we will implement the logic for user registration, authentication, token generation, and protected route access. The middlewares we set up will run before these handlers to ensure that the requests are properly processed and that our backend can communicate effectively with our frontend.
app.use(cors()); //allows fe requests to be accepted by be, enables cross-origin resource sharing, allowing our frontend (running on a different port) to communicate with our backend API.
app.use(express.json()); //parses incoming JSON request bodies, making it easier to access the data sent from the frontend in our route handlers. By using express.json(), we can easily access this data in our route handlers through req.body, allowing us to implement the logic for user registration and authentication effectively.

// Request logging middleware for debugging ease
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next(); //continue to next middleware or route handler after logging request details. This middleware will log the HTTP method and path of each incoming request, along with a timestamp. This can be helpful for debugging and monitoring the activity on our backend server, allowing us to see which endpoints are being accessed and when.
}); //to get time method and route of each incoming request, which can be helpful for debugging and monitoring the activity on our backend server. 

// // In-memory data store for temporary user records
// const users = [];

// Helper to validate email format
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// 1. REGISTRATION ROUTE
// Frontend Register Form
// ↓
// POST /api/register
// ↓
// Backend validates input
// ↓
// Password hashed
// ↓
// User stored
// ↓
// Success response returned
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body; //object destructring to get username email and password from request body sent by frontend when user submits registration form. This data will be used to create a new user account in our backend. We will validate this input, hash the password for security, and then store the user information in our in-memory data store (users array) before sending a response back to the frontend indicating whether the registration was successful or if there were any errors (like missing fields or existing user). req contains incoming request data and res is used to send back responses to the client.

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields (username, email, password) are required.' }); //400 means bad request
    }

    if (username.trim().length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address format.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check if user already exists
    // const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    // if (emailExists) {
    //   return res.status(400).json({ error: 'User with this email already exists.' });
    // }

    const emailExists = await User.findOne({
  email: email.toLowerCase()
});

if (emailExists) {
  return res.status(400).json({
    error: "User with this email already exists."
  });
}


  // some to check if any element matches condition

    // const usernameExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
    // if (usernameExists) {
    //   return res.status(400).json({ error: 'Username is already taken.' });
    // }

    const usernameExists = await User.findOne({
  username: username.toLowerCase()
});
if (usernameExists) {
  return res.status(400).json({
    error: "Username is already taken."
  });
}

    // Hash the password, salt is extra randomness added before hashing, 10 is salt rounds
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); //converts pw to secured hash, which is what we will store in our data store instead of the plain text password. When a user tries to log in later, we will hash the password they provide and compare it to the stored hash to verify their credentials without ever exposing the original password.


    //email verification otp generation
    const otp = Math.floor(
  100000 + Math.random() * 900000
).toString();

    // Create and save user, ID NOT REQ AS MONGODB ALREADY CREATES ID
    const newUser = {
  username: username.trim(),
  email: email.trim(),
  password: hashedPassword,
  role: role || "user",

  isVerified: false,

  emailOTP: otp,

  emailOTPExpires:
    Date.now() + 10 * 60 * 1000
};

    const user = await User.create(
  newUser
);

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: user.email,
  subject: "Email Verification",
  text: `Your verification code is ${otp}`
});
console.log("works")

    console.log(`[SUCCESS] User registered: ${newUser.username} (${newUser.email})`);

    return res.status(201).json({
  message: "Verification code sent.",
  userId: user._id
});

  } catch (error) {
    console.error('Error in registration route:', error);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
});



//VERIFY EMAIL
app.post('/api/verify-email', async (req, res) => {
  try {

    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    if (user.emailOTP !== otp) {
      return res.status(400).json({
        error: 'Invalid OTP'
      });
    }

    if (user.emailOTPExpires < Date.now()) {
      return res.status(400).json({
        error: 'OTP expired'
      });
    }

    user.isVerified = true;
    user.emailOTP = null;
    user.emailOTPExpires = null;

    await user.save();

    return res.json({
      message: 'Email verified successfully'
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: 'Verification failed'
    });

  }
});





// 2. LOGIN ROUTE
// Frontend Login Form
// ↓
// POST /api/login
// ↓
// Backend checks credentials
// ↓
// JWT token generated
// ↓
// Token returned to frontend
// ↓
// Frontend stores token in localStorage
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user
    const user = await User.findOne({
  email: email.toLowerCase()
});

if (!user) {
  return res.status(401).json({
    error: "Invalid email or password."
  });
}

if (!user.isVerified) {
  return res.status(401).json({
    error: "Please verify your email first."
  });
}

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    

    // Create secure token (JWT) containing id, username, email, password is not included in token for security reasons, we only include non-sensitive user information. The JWT_SECRET is used to sign the token, ensuring that it cannot be tampered with. The expiresIn option sets the token to expire after 1 hour, which adds an extra layer of security by limiting the time window in which a stolen token could be used. okay this is for normal login using token ive commented it, now ive to add 2fa
    

    //generate otp
//     const otp = Math.floor(
//   100000 + Math.random() * 900000
// ).toString();

// // Save OTP in MongoDB
// user.otpCode = otp;

// user.otpExpires =
//   Date.now() + 5 * 60 * 1000;

// await user.save();

// // SEND EMAIL HERE
// await transporter.sendMail({
//   from: process.env.EMAIL_USER,
//   to: user.email,
//   subject: "Login OTP",
//   text: `Your OTP is ${otp}`
// });

// console.log("EMAIL SENT");

// // Return response
// return res.json({
//   message: "OTP sent successfully.",
//   userId: user._id
// });


//for 2fa
// User has 2FA enabled
if (user.twoFactorEnabled) {

  return res.json({
    requires2FA: true,
    method:
      user.twoFactorMethod,
    userId:
      user._id
  });

}

return res.json({
  requiresSetup2FA: true,
  userId: user._id
});

// User does not have 2FA enabled
const token = jwt.sign(
  {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  },
  process.env.JWT_SECRET,
  {
    expiresIn: '1h'
  }
);

console.log({
  email: user.email,
  twoFactorEnabled: user.twoFactorEnabled,
  secret: user.twoFactorSecret
});

return res.json({
  token,
  userId: user._id,
  username: user.username,
  email: user.email,
  role: user.role
});



  } catch (error) {
    console.error('Error in login route:', error);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
});



// Set 2FA Method
app.post(
  "/api/set-2fa-method",
  async (req, res) => {

    try {

      const {
        userId,
        method
      } = req.body;

      const user =
        await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          error: "User not found"
        });
      }

      if (
        method !== "email" &&
        method !== "authenticator"
      ) {
        return res.status(400).json({
          error: "Invalid 2FA method"
        });
      }

      user.twoFactorMethod =
        method;

      user.twoFactorEnabled =
        true;

      await user.save();

      return res.json({
        success: true,
        method: user.twoFactorMethod
      });

    } catch (error) {

      console.error(
        "Set 2FA Method Error:",
        error
      );

      return res.status(500).json({
        error: "Server error"
      });

    }

  }
);


//send login otp route
app.post('/api/send-login-otp', async (req, res) => {

  try {

    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.loginOTP = otp;

    user.loginOTPExpires =
      Date.now() + 5 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Login OTP',
      text: `Your OTP is ${otp}`
    });

    return res.json({
      message: 'OTP sent'
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: 'Failed to send OTP'
    });

  }

});



//verify login otp
app.post('/api/verify-login-otp', async (req, res) => {

  try {

    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    if (user.loginOTP !== otp) {
      return res.status(400).json({
        error: 'Invalid OTP'
      });
    }

    if (user.loginOTPExpires < Date.now()) {
      return res.status(400).json({
        error: 'OTP expired'
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    user.loginOTP = null;
    user.loginOTPExpires = null;

    await user.save();

    return res.json({
      token,
      username: user.username,
      email: user.email,
      role: user.role
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: 'Verification failed'
    });

  }

});



//authenticator
app.post("/api/enable-2fa", async (req, res) => {
  try {

    console.log("========== ENABLE 2FA ==========");

    const { userId } = req.body;

    console.log("Received userId:", userId);

    if (!userId) {
      return res.status(400).json({
        error: "User ID is required"
      });
    }

    const user = await User.findById(userId);

    console.log("Found user:", user?.email);

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    const secret = speakeasy.generateSecret({
      name: `SecureAuth (${user.email})`
    });

    console.log("Generated secret");

    user.twoFactorSecret = secret.base32;

    await user.save();

    console.log("Secret saved to database");

    const qrCode = await QRCode.toDataURL(
      secret.otpauth_url
    );

    console.log("QR generated successfully");

    return res.status(200).json({
      success: true,
      qrCode
    });

  } catch (error) {

    console.error(
      "Enable 2FA Error:",
      error
    );

    return res.status(500).json({
      error: "Server error"
    });

  }
});


//verify 2fa
app.post('/api/verify-2fa', async (req, res) => {
  try {

    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    console.log("User Secret:", user.twoFactorSecret);
console.log("OTP Received:", otp);

    const verified = speakeasy.totp.verify({
  secret: user.twoFactorSecret,
  encoding: 'base32',
  token: otp,
  window: 1
});

    if (!verified) {
      return res.status(401).json({
        error: 'Invalid code'
      });
    }

    user.twoFactorEnabled = true;

    await user.save();

    return res.json({
      message: '2FA enabled successfully'
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: 'Server error'
    });

  }
});




//verify to login
app.post('/api/login/verify-2fa', async (req, res) => {
  try {

    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: otp,
      window: 1
    });

    if (!verified) {
      return res.status(401).json({
        error: 'Invalid code'
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    return res.json({
      token,
      username: user.username,
      email: user.email,
      role: user.role
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: 'Server error'
    });

  }
});




//verify otp route
app.post('/api/verify-otp', async (req, res) => {
  try {

    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found."
      });
    }

    if (user.otpCode !== otp) {
      return res.status(400).json({
        error: "Invalid OTP."
      });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        error: "OTP expired."
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    user.otpCode = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.json({
      message: "Login successful!",
      token,
      user: {
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    return res.status(500).json({
      error: "OTP verification failed."
    });

  }
});




// Middleware for token validation on protected routes, only authenticated users can access protected apis
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Expecting format: Bearer <token>, from dashboard when we make api request to protected route, we will include the token in the Authorization header in this format. This middleware will extract the token from the header, verify it using the JWT_SECRET, and if valid, allow the request to proceed to the protected route handler. If the token is missing or invalid, it will return an appropriate error response, preventing unauthorized access to protected resources.
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token missing.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(`[AUTH FAILED] Invalid or expired token: ${err.message}`);
      return res.status(403).json({ error: 'Token is invalid or expired.' });
    }
    
    req.user = decoded; //attach decoded user info to request object for use in protected route handlers, this allows us to access the authenticated user's information (like id, username, email) in any route that uses this middleware, enabling personalized responses or further authorization checks based on the user's identity.
    next(); //proceed to the next middleware or route handler if token is valid
  });
};




const requireAdmin= (req, res, next) => {
  if(req.user.role != "admin")
  {
    return res.status(403).json({
      error: "admin access required."
    });
  }
  next();
};




// 3. PROTECTED ME ROUTE api/me protected authenticated user route, get/ backenend health check
app.get('/api/me', authenticateToken, (req, res) => {
  // Returns authenticated user details
  return res.json({
  id: req.user.id,
  username: req.user.username,
  email: req.user.email,
  role: req.user.role
});
});

//UISNG DB NOW THIS WAS FOR MEMORY ARRAY
// app.get(
//   "/api/users",
//   authenticateToken,
//   requireAdmin,
//   (req, res) => {

//     const safeUsers = users.map(user => ({
//       id: user.id,
//       username: user.username,
//       email: user.email,
//       role: user.role
//     }));

//     res.json(safeUsers);
// }); using db now instead of memory array



// User clicks Update Password
// ↓
// Frontend sends currentPassword + newPassword
// ↓
// authenticateToken middleware verifies JWT
// ↓
// Find logged-in user
// ↓
// Verify current password
// ↓
// Hash new password
// ↓
// Replace old password hash
// ↓
// Return success
app.post(
  '/api/change-password',
  authenticateToken,
  async (req, res) => {

    try {

      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(
  req.user.id
);

      if (!user) {
        return res.status(404).json({
          error: "User not found."
        });
      }

      const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isMatch) {
        return res.status(401).json({
          error: "Current password incorrect."
        });
      }

      const hashedPassword = await bcrypt.hash(
        newPassword,
        10
      );

      user.password = hashedPassword;
await user.save();;

      return res.json({
        message: "Password updated successfully."
      });

    } catch (err) {

      return res.status(500).json({
        error: "Password update failed."
      });
    }
});

app.get(
  "/api/users",
  authenticateToken,
  requireAdmin,
  async (req, res) => {

    const safeUsers = await User.find()
      .select("-password");

    res.json(safeUsers);
});

// Root check route to verify backend is running and accepting requests, this can be useful for quickly checking if the backend server is up and running without needing to access a protected route or perform authentication. It provides a simple endpoint that can be accessed to confirm that the server is operational and ready to handle requests from the frontend.
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Secure Auth Dashboard Backend is running.'
  });
});

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`Backend server successfully listening on port ${PORT}`);
  console.log(`Registered routes:`);
  console.log(`  POST /api/register`);
  console.log(`  POST /api/login`);
  console.log(`  GET  /api/me (Protected)`);
  console.log(`========================================`);
}); // Start the server and wait for incming req. listen on the specified port, when the server starts successfully, it will log a message to the console indicating that it is listening on the specified port and also list the registered routes for easy reference. This helps us confirm that our backend server is up and running and ready to handle incoming requests from the frontend application. 
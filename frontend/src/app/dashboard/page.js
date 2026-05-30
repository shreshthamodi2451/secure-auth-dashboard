"use strict";
"use client";

import { useState, useEffect } from "react"; //usesate stores chaning data, useeffect runs code after component mounts
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  LogOut, 
  ShieldCheck, 
  Calendar, 
  KeyRound, 
  Cpu, 
  Layers, 
  LockKeyhole,
  CheckCircle,
  Activity
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);//stores logged in user info retrieved from the backend. Initially set to null until we fetch the data. Once we have the user data, we can display it in the dashboard, such as the username and email. This state will be updated after we successfully fetch the user information from the backend API using the token for authentication.
  const [error, setError] = useState(""); //stores error message
  const [loading, setLoading] = useState(true); //indicates whether the dashboard is still loading data. Initially set to true, and we will set it to false once we have finished fetching the user data from the backend. While loading is true, we can show a loading spinner or message to indicate that the dashboard is being prepared. Once loading is false, we can display the actual dashboard content with the user information and metrics.
  // const [passwordData, setPasswordData] = useState({
  // currentPassword: "",
  // newPassword: ""
  //       });

  // const [passwordMessage, setPasswordMessage] = useState("");
  const [sessionTime, setSessionTime] = useState(0);//tracks how long the user has been active in the current session. This is just a dynamic micro-interaction feature to show how long the user has been logged in. 

  // Measure session active time just as a dynamic micro-interaction feature
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer); // Clean up the timer when component unmounts
  }, []);

  //auth + api data fetching
//   1. Session authentication
// 2. Protected route access
// 3. Token validation
// 4. API communication
// 5. User data fetching
// 6. Error handling
// 7. Logout logic
// 8. Session timing
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token"); ///async func is a js func designed to handle operations that take time ti complete and await means ti pause this function until result comes back. In this case, we are fetching user data from the backend API, which is an asynchronous operation. We use await to wait for the response from the fetch call before proceeding to the next lines of code. This allows us to handle the asynchronous nature of API calls in a more readable and manageable way. The token is retrieved from localStorage, and we will use it to authenticate our request to the backend API to get the user information. If the token is missing or invalid, we will handle that case by redirecting the user back to the login page.
      
      // Enforce auth check
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5001/api/me", //sends http request to backend api to get user data. We include the token in the Authorization header as a Bearer token, which is a common way to send authentication tokens in API requests. The backend will check this token to verify the user's identity and return the corresponding user data if the token is valid. If the token is missing, invalid, or expired, the backend will respond with an error, and we will handle that case by redirecting the user back to the login page.
          {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}` // Include the token in the Authorization header as a Bearer token
          }
        });

        if (!response.ok) {
          // Token is invalid or expired
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("email");
          router.push("/login");
          return;
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error("Dashboard data fetching error:", err);
        setError("Unable to connect to security database. Retrying...");
      } finally {
        setLoading(false); //stops loading spinner
      }
    };

    fetchUserData(); //actually executes async function to fetch user data from backend api. We call this function inside the useEffect so that it runs when the component mounts. This will allow us to retrieve the user information as soon as the dashboard loads, and we can then display that information in the dashboard UI. If there is an error during fetching, we will set the error state, which can be used to show an error message to the user. Once we have either successfully fetched the data or encountered an error, we set loading to false to stop showing the loading spinner and display the appropriate content based on whether we have user data or an error message.
  }, [router]);
//   User opens /dashboard
// ↓
// Dashboard component mounts
// ↓
// useEffect runs
// ↓
// Get token from localStorage
// ↓
// If no token → redirect to login
// ↓
// If token exists → send GET request to backend
// ↓
// Backend verifies token
// ↓
// If token invalid → logout + redirect
// ↓
// If valid → return user data
// ↓
// Frontend stores user data in React state
// ↓
// Dashboard UI renders user info

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    router.push("/login");
  };

  const formatSessionTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

//   const handlePasswordChange = async (e) => {
//   e.preventDefault();

//   try {

//     const token = localStorage.getItem("token");

//     const response = await fetch(
//       "http://localhost:5001/api/change-password",
//       {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },

//         body: JSON.stringify(passwordData)
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error);
//     }

//     setPasswordMessage("Password updated successfully!");

//     setPasswordData({
//       currentPassword: "",
//       newPassword: ""
//     });

//   } catch (err) {
//     setPasswordMessage(err.message);
//   }
// };

  const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:5001/api/users",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    console.log(data);

    alert(JSON.stringify(data, null, 2));

  } catch (err) {
    console.error("Failed to fetch users:", err);
  }
};

  if (loading)//if api is still fteching data from backend, show loading spinner and message. This provides feedback to the user that the dashboard is being prepared and that they should wait momentarily. Once loading is false, we will either show the dashboard content if we have user data or an error message if there was an issue fetching the data.
  {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
        <div className="spinner spinner-large"></div>
        <p style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
          Decrypting secure dashboard environment...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card" style={{ textAlign: "center" }}>
        <div className="alert-box alert-error">
          <span>{error}</span>
        </div>
        <button className="glass-btn" onClick={() => window.location.reload()}>
          Retry Server Sync
        </button>
      </div>
    );
  }

  // Get initial letters for avatar placeholder
  const initial = userData?.username ? userData.username.charAt(0).toUpperCase() : "U";

  const role = localStorage.getItem("role");
  

  return (
    <div className="dashboard-container">
      {/* 1. Header Bar */}
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <LockKeyhole size={24} style={{ color: "var(--accent-purple)" }} />
          <span>SecureAuth<span style={{ color: "var(--accent-pink)", fontSize: "0.85rem", marginLeft: "0.3rem" }}>V1.0</span></span>
        </div>
        

        {/* <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button> */}
      </header>

      {/* 2. Grid Dashboard */}
      <div className="dashboard-grid">
        
        {/* Left column: Profile Summary */}
        <aside className="dashboard-side-card">
          <div className="user-avatar-placeholder">
            {initial}
            <div className="user-avatar-badge" title="Active secure session"></div>
          </div>
          
          <h2 className="profile-username">{userData?.username}</h2>
          <p className="profile-email">{userData?.email}</p>
          
          <div className="profile-info-divider"></div>
          
          <div className="profile-stat-box">
            <div className="profile-stat-item">
              <span className="profile-stat-value">Active</span>
              <span className="profile-stat-label">Session Status</span>
            </div>
            <div className="profile-stat-item">
              <span className="profile-stat-value">{formatSessionTime(sessionTime)}</span>
              <span className="profile-stat-label">Session Age</span>
            </div>
          </div>

          <div className="sidebar-menu">

  <button
    className="sidebar-btn"
    onClick={() => router.push("/dashboard")}
  >
    Dashboard
  </button>

  <button
    className="sidebar-btn"
    onClick={() => router.push("/profile")}
  >
    Profile
  </button>

  <button
    className="sidebar-btn"
    onClick={() => router.push("/change-password")}
  >
    Change Password
  </button>

  {role === "admin" && (
    <button
      className="sidebar-btn"
      onClick={() => router.push("/users")}
    >
      Users
    </button>
  )}

  <button
    className="sidebar-btn logout"
    onClick={handleLogout}
  >
    Logout
  </button>

</div>

        </aside>

        {/* Right column: Main Portal Cards */}
        <main className="dashboard-main-panel">
          
          {/* Welcome Banner */}
          <div className="dashboard-card welcome-banner">
            <h1 className="welcome-title">Welcome Back, {userData?.username}!</h1>

            <p className="welcome-desc">
              Your connection is fully encrypted using RSA standards, and your authentication records are secured in the server-side memory environment. Explore the panel metrics below.
            </p>

            {/* <div className="dashboard-card">

          <h3>Account</h3>

          <button
            className="glass-btn"
            onClick={() => router.push("/change-password")}
          >
            Change Password
          </button>

        </div> */}


            {role === "admin" && (
              <button
                className="glass-btn"
                onClick={fetchUsers}
                style={{ marginTop: "1rem" }}
              >
                View All Users
              </button>
            )}
          </div>

          {/* Metrics grid */}
          <div className="dashboard-card">
            <h3 className="panel-title">
              <ShieldCheck size={20} style={{ color: "var(--accent-purple)" }} />
              Security Metrics & Environment parameters
            </h3>
            
            <div className="metric-card-grid">
              
              <div className="metric-card">
                <div className="metric-icon">
                  <KeyRound size={20} />
                </div>
                <div className="metric-info">
                  <span className="metric-label">Access Token Type</span>
                  <span className="metric-value">JWT Signed</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon pink">
                  <Activity size={20} />
                </div>
                <div className="metric-info">
                  <span className="metric-label">Backend Environment</span>
                  <span className="metric-value">Express + Node.js</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon pink">
                  <Cpu size={20} />
                </div>
                <div className="metric-info">
                  <span className="metric-label">Memory Database Type</span>
                  <span className="metric-value">In-Memory Arrays</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <Layers size={20} />
                </div>
                <div className="metric-info">
                  <span className="metric-label">API Status</span>
                  <span className="metric-value" style={{ color: "var(--success)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <CheckCircle size={14} /> Operational
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* <div className="dashboard-card">

            <h3 className="panel-title">
              Change Password
            </h3>

          <form onSubmit={handlePasswordChange}>

            <div className="form-group">
              <input
                className="glass-input"
                type="password"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value
                  })
                }
              />
            </div> */}

            {/* <div className="form-group">
              <input
                className="glass-input"
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value
                  })
                }
              />
            </div> */}

            {/* <button className="glass-btn" type="submit">
              Update Password
            </button>

          </form>

          {passwordMessage && (
            <p style={{ marginTop: "1rem" }}>
              {passwordMessage}
            </p>
          )}

        </div> */}

        </main>
      </div>
    </div>
  );
}
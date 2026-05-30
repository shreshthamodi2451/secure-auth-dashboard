"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Users() {

  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {

    const role = localStorage.getItem("role");

    if (role !== "admin") {
      router.push("/dashboard");
      return;
    }

    const fetchUsers = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5001/api/users",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        setUsers(data);

      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();

  }, [router]);

  return (
    <div className="glass-card">

      <h1 className="title">
        Registered Users
      </h1>

      {error && (
        <p>{error}</p>
      )}

      {users.map((user) => (

        <div
          key={user.id}
          className="dashboard-card"
          style={{ marginBottom: "1rem" }}
        >

          <h3>{user.username}</h3>

          <p>{user.email}</p>

          <p>
            Role: {user.role}
          </p>

        </div>

      ))}

      <button
        className="glass-btn"
        onClick={() => router.push("/dashboard")}
      >
        Back to Dashboard
      </button>

    </div>
  );
}
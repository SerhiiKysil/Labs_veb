import React, { useEffect, useState } from "react";
import Loading from "../layout/Loading";

type Role = {
  id: number;
  name: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  telegram: string;
  password: string;
  role: Role;
  verificationCode: string;
  createdAt: string;
  verified: boolean;
};

type ApiError = {
  message: string;
};

const UserControl: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setError(apiError.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (id: number, role: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}/role?role=${role}`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("Failed to update role");
      }
      fetchUsers();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      alert(apiError.message || "Failed to update user role");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      fetchUsers();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      alert(apiError.message || "Failed to delete user");
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <h1 style={{ color: "black" }}>Користувачі</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
              position: "relative",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ color: "black" }}>{user.name}</h2>
            <p style={{ color: "#000" }}>{user.email}</p>
            <p style={{ color: "#000" }}>{user.telegram}</p>
            <p style={{ color: "#000" }}>{user.role.name}</p>
            <p style={{ fontSize: "0.9rem", marginTop: "8px", color: "black" }}>
              {user.verified ? "Верифіковано" : "Не верифіковано"}
            </p>
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
                background: "#f0f0f0",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                color: "black",
              }}
              onClick={(e) => {
                const menu = (e.target as HTMLElement).nextSibling as HTMLElement;
                menu.style.display = menu.style.display === "block" ? "none" : "block";
              }}
            >
              •••
            </div>
            <div
              style={{
                display: "none",
                position: "absolute",
                top: "40px",
                right: "10px",
                background: "#fff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
                              <button
                style={{
                  display: "block",
                  padding: "10px 16px",
                  textAlign: "left",
                  width: "100%",
                  border: "none",
                  background: "#fff",
                  color: "black",
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                }}
                onClick={() => handleUpdateRole(user.id, "publisher")}
              >
                Змінити на організатора
              </button>
              <button
                style={{
                  display: "block",
                  padding: "10px 16px",
                  textAlign: "left",
                  width: "100%",
                  border: "none",
                  background: "#fff",
                  color: "black",
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                }}
                onClick={() => handleUpdateRole(user.id, "superadmin")}
              >
                Змінити на адміністратора
              </button>
              <button
                style={{
                  display: "block",
                  padding: "10px 16px",
                  textAlign: "left",
                  width: "100%",
                  border: "none",
                  background: "#fff",
                  color: "black",
                  cursor: "pointer",
                }}
                onClick={() => handleDelete(user.id)}
              >
                Видалити
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserControl;
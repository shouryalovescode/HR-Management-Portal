import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  // ============================
  // State
  // ============================
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // ============================
  // Fetch Employees
  // ============================
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/users?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Session expired. Please login again.");
        navigate("/", { replace: true });
        return;
      }

      const data = await response.json();

      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // ============================
  // Check Login
  // ============================
  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.removeItem("user");
        alert("Please login first!");
        navigate("/", { replace: true });
        return;
      }

      await fetchUsers();
    };

    checkLogin();
  }, [navigate, page, search]);

  // ============================
  // Register Employee
  // ============================
  const handleFormSubmit = async (userData) => {
    try {
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
  setMessage(data.message);
  setMessageType("error");
  return;
}

setMessage(data.message);
setMessageType("success");

fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  };

  // ============================
  // Delete Employee
  // ============================
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Session expired. Please login again.");
        navigate("/", { replace: true });
        return;
      }

      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // ============================
  // Edit Employee
  // ============================
  const handleEdit = (user) => {
    setEditingUser(user);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================
  // Cancel Edit
  // ============================
  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  return (
    <div className="home-page">
      <Header subtitle="Employee Registration Portal" />

      <div className="home-banner">
        <h1 className="banner-title">
          Employee Registration Portal
        </h1>

        <p className="banner-sub">
          Register, manage, and track employees efficiently
        </p>
      </div>

      {/* Search */}
      <div
        style={{
          maxWidth: "600px",
          margin: "20px auto",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>

      <div className="home-content">
        {message && (
  <div
    style={{
      maxWidth: "700px",
      margin: "20px auto",
      padding: "15px",
      borderRadius: "10px",
      textAlign: "center",
      fontWeight: "600",
      color: "#fff",
      backgroundColor:
        messageType === "success" ? "#16a34a" : "#dc2626",
    }}
  >
    {message}
  </div>
)}
        <UserForm
          onSubmit={handleFormSubmit}
          editingUser={editingUser}
          onCancelEdit={handleCancelEdit}
        />

        <UserTable
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            margin: "30px 0",
          }}
        >
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            ◀ Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
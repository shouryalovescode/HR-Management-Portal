import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  };

  return (
    <header
      style={{
        width: "100%",
        height: "80px",
        background: "#1f2b38",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 40px",
        boxSizing: "border-box",
      }}
    >
      {/* Left */}
      <h1
        style={{
          color: "#fff",
          margin: 0,
          fontSize: "2.2rem",
          fontWeight: "700",
        }}
      >
        Infinite Computer Solutions
      </h1>

      {/* Right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          👋 {user?.name}
        </span>

        <button
          onClick={handleLogout}
          style={{
            background: "linear-gradient(135deg,#ff4d4d,#d90429)",
            border: "none",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "30px",
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
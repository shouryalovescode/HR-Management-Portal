import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { authApi } from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // =========================
  // Restore user from storage
  // =========================
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  // =========================
  // Restore token
  // =========================
  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // =========================
  // Store token
  // =========================
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // =========================
  // Store user
  // =========================
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // =========================
  // Login
  // =========================
  async function login(email, password) {
    setLoading(true);
    setError(null);

    try {
      const { data } = await authApi.login({
        email,
        password,
      });

      const receivedToken =
        data.token || data.accessToken;

      // Backend now returns:
      // id, name, email, role
      const receivedUser = data.user || {
        email,
        role: "user",
      };

      setToken(receivedToken);
      setUser(receivedUser);

      return {
        success: true,
        user: receivedUser,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Invalid email or password.";

      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // Logout
  // =========================
  function logout() {
    setToken(null);
    setUser(null);
    setError(null);
  }

  // =========================
  // Authentication Context
  // =========================
  return (
    <AuthContext.Provider
      value={{
        user,
        token,

        isAuthenticated: Boolean(token),

        // Convenient RBAC helpers
        isAdmin: user?.role === "admin",
        isUser: user?.role === "user",

        loading,
        error,

        login,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================
// useAuth Hook
// =========================
export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
}
import axios from "axios";

// =====================================================
// API BASE URL
// =====================================================

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

const api = axios.create({
  baseURL,

  headers: {
    "Content-Type": "application/json"
  }
});

// =====================================================
// ATTACH JWT TOKEN
// =====================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// HANDLE EXPIRED / INVALID JWT
// =====================================================

api.interceptors.response.use(
  (response) => response,

  (error) => {

    if (error?.response?.status === 401) {

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// =====================================================
// AUTH API
// =====================================================

export const authApi = {

  login: (payload) =>
    api.post("/auth/login", payload),

  signup: (payload) =>
    api.post("/auth/signup", payload)
};

// =====================================================
// EMPLOYEE API
// =====================================================

export const employeesApi = {

  list: (params) =>
    api.get("/users", { params }),

  create: (payload) =>
    api.post("/users", payload),

  update: (id, payload) =>
    api.put(`/users/${id}`, payload),

  remove: (id) =>
    api.delete(`/users/${id}`)
};

// =====================================================
// DEPARTMENT API
// =====================================================

export const departmentsApi = {

  list: () =>
    api.get("/api/departments"),

  create: (payload) =>
    api.post("/api/departments", payload),

  update: (id, payload) =>
    api.put(`/api/departments/${id}`, payload),

  remove: (id) =>
    api.delete(`/api/departments/${id}`)
};

export default api;
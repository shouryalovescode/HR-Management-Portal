const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const pool = require("./db");

const roleMiddleware = require("./middleware/roleMiddleware");
const verifyToken = require("./middleware/authMiddleware");

const authRoutes = require("./routes/auth");
const analyticsRoutes = require("./routes/analytics");
const attendanceRoutes = require("./routes/attendance");
const departmentRoutes = require("./routes/department");
const leaveRoutes = require("./routes/leave");
const recruitmentRoutes = require("./routes/recruitment");

require("dotenv").config();

const app = express();

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());
app.use(express.json());

// ============================================================
// ROUTES
// ============================================================

app.use("/auth", authRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/leaves", leaveRoutes);
app.use("/recruitment", recruitmentRoutes);
// ============================================================
// TEST ROUTE
// ============================================================

app.get("/hello", (req, res) => {
  res.send("Hello from Server");
});

// ============================================================
// DATABASE TEST
// ============================================================

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connected successfully!",
      time: result.rows[0].now,
    });
  } catch (err) {
    console.error("Database Error:", err);

    res.status(500).json({
      message: "Database connection failed",
      error: err.message,
    });
  }
});

// ============================================================
// CREATE EMPLOYEE
// POST /users
// ============================================================

app.post("/users", verifyToken, async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      department,
      designation,
      age,
      role,
      status,
    } = req.body;

    // ========================================================
    // VALIDATION
    // ========================================================

    if (
      !name ||
      !email ||
      !mobile ||
      !department ||
      !designation ||
      age === undefined ||
      age === null ||
      age === ""
    ) {
      return res.status(400).json({
        message: "All employee fields are required.",
      });
    }

    // ========================================================
    // EMAIL VALIDATION
    // ========================================================

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(String(email).trim())) {
      return res.status(400).json({
        message: "Invalid email format.",
      });
    }

    // ========================================================
    // AGE VALIDATION
    // ========================================================

    const ageNumber = Number(age);

    if (
      !Number.isInteger(ageNumber) ||
      ageNumber < 18 ||
      ageNumber > 100
    ) {
      return res.status(400).json({
        message: "Age must be between 18 and 100.",
      });
    }

    // ========================================================
    // MOBILE VALIDATION
    // ========================================================

    const mobileRegex = /^\d{10}$/;

    if (!mobileRegex.test(String(mobile).trim())) {
      return res.status(400).json({
        message: "Mobile number must contain exactly 10 digits.",
      });
    }

    // ========================================================
    // CHECK DUPLICATE EMAIL
    // ========================================================

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = LOWER($1)",
      [email.trim()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists.",
      });
    }

    // ========================================================
    // TEMPORARY PASSWORD
    // ========================================================

    const temporaryPassword = crypto.randomBytes(8).toString("hex");

    const hashedPassword = await bcrypt.hash(
      temporaryPassword,
      10
    );

    // ========================================================
    // ROLE
    // ========================================================

    const employeeRole = role || "executive";

    // ========================================================
    // CREATE EMPLOYEE
    // ========================================================

    const newUser = await pool.query(
      `
      INSERT INTO users
      (
        name,
        email,
        password,
        age,
        mobile,
        role,
        department,
        designation,
        status
      )
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING
        id,
        name,
        email,
        age,
        mobile,
        role,
        department,
        designation,
        status,
        created_at
      `,
      [
        name.trim(),
        email.trim(),
        hashedPassword,
        ageNumber,
        mobile.trim(),
        employeeRole,
        department.trim(),
        designation.trim(),
        status || "active",
      ]
    );

    res.status(201).json({
      message: "Employee added successfully.",
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error("Create Employee Error:", err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
});

// ============================================================
// GET USERS
// GET /users
// ============================================================

app.get("/users", verifyToken, async (req, res) => {
  try {
    // ========================================================
    // NORMAL USER
    // ========================================================

    if (req.user.role === "user") {
      const result = await pool.query(
        `
        SELECT
          id,
          name,
          email,
          age,
          mobile,
          role,
          department,
          designation,
          status,
          created_at
        FROM users
        WHERE id = $1
        `,
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "User profile not found.",
        });
      }

      return res.status(200).json({
        users: result.rows,
        totalUsers: 1,
        totalPages: 1,
        currentPage: 1,
      });
    }

    // ========================================================
    // ADMIN
    // ========================================================

    if (req.user.role === "admin") {
      const page = Math.max(
        parseInt(req.query.page) || 1,
        1
      );

      const limit = Math.min(
        Math.max(parseInt(req.query.limit) || 8, 1),
        100
      );

      const search = String(req.query.search || "").trim();

      const offset = (page - 1) * limit;

      // ======================================================
      // COUNT
      // ======================================================

      const totalResult = await pool.query(
        `
        SELECT COUNT(*)
        FROM users
        WHERE
          name ILIKE $1
          OR email ILIKE $1
          OR department ILIKE $1
          OR designation ILIKE $1
          OR role ILIKE $1
        `,
        [`%${search}%`]
      );

      const totalUsers = parseInt(
        totalResult.rows[0].count,
        10
      );

      // ======================================================
      // USERS
      // ======================================================

      const usersResult = await pool.query(
        `
        SELECT
          id,
          name,
          email,
          age,
          mobile,
          role,
          department,
          designation,
          status,
          created_at
        FROM users
        WHERE
          name ILIKE $1
          OR email ILIKE $1
          OR department ILIKE $1
          OR designation ILIKE $1
          OR role ILIKE $1
        ORDER BY id ASC
        LIMIT $2
        OFFSET $3
        `,
        [
          `%${search}%`,
          limit,
          offset,
        ]
      );

      return res.status(200).json({
        users: usersResult.rows,
        totalUsers,
        totalPages: Math.max(
          Math.ceil(totalUsers / limit),
          1
        ),
        currentPage: page,
      });
    }

    // ========================================================
    // INVALID ROLE
    // ========================================================

    return res.status(403).json({
      message: "Invalid user role.",
    });
  } catch (err) {
    console.error("Get Users Error:", err);

    res.status(500).json({
      message: "Error fetching users.",
      error: err.message,
    });
  }
});

// ============================================================
// UPDATE USER
// PUT /users/:id
//
// IMPORTANT:
// This endpoint supports PARTIAL updates.
// This is what allows your inline editing to work.
//
// Example:
// {
//   "department": "IT",
//   "designation": "Software Engineer",
//   "role": "manager"
// }
//
// The other employee fields remain unchanged.
// ============================================================

app.put("/users/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      mobile,
      department,
      designation,
      age,
      role,
      status,
    } = req.body;

    // ========================================================
    // AUTHORIZATION
    // ========================================================

    if (
      req.user.role !== "admin" &&
      Number(req.user.id) !== Number(id)
    ) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    // ========================================================
    // FIND EXISTING EMPLOYEE
    // ========================================================

    const existingUser = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        age,
        mobile,
        role,
        department,
        designation,
        status
      FROM users
      WHERE id = $1
      `,
      [id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        message: "Employee not found.",
      });
    }

    const current = existingUser.rows[0];

    // ========================================================
    // USE OLD VALUES WHEN FRONTEND DOESN'T SEND THEM
    // ========================================================

    const finalName =
      name !== undefined && name !== null
        ? String(name).trim()
        : current.name;

    const finalEmail =
      email !== undefined && email !== null
        ? String(email).trim()
        : current.email;

    const finalMobile =
      mobile !== undefined &&
      mobile !== null &&
      String(mobile).trim() !== ""
        ? String(mobile).trim()
        : current.mobile;

    const finalDepartment =
      department !== undefined &&
      department !== null &&
      String(department).trim() !== ""
        ? String(department).trim()
        : current.department;

    const finalDesignation =
      designation !== undefined &&
      designation !== null &&
      String(designation).trim() !== ""
        ? String(designation).trim()
        : current.designation;

    const finalAge =
      age !== undefined &&
      age !== null &&
      age !== ""
        ? Number(age)
        : current.age;

    const finalRole =
      role !== undefined &&
      role !== null &&
      String(role).trim() !== ""
        ? String(role).trim().toLowerCase()
        : current.role;

    const finalStatus =
      status !== undefined &&
      status !== null &&
      String(status).trim() !== ""
        ? String(status).trim().toLowerCase()
        : current.status || "active";

    // ========================================================
    // BASIC VALIDATION
    // ========================================================

    if (!finalName) {
      return res.status(400).json({
        message: "Employee name is required.",
      });
    }

    if (!finalEmail) {
      return res.status(400).json({
        message: "Employee email is required.",
      });
    }

    // ========================================================
    // EMAIL VALIDATION
    // ========================================================

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(finalEmail)) {
      return res.status(400).json({
        message: "Invalid email format.",
      });
    }

    // ========================================================
    // AGE VALIDATION
    // ========================================================

    const ageNumber = Number(finalAge);

    if (
      !Number.isInteger(ageNumber) ||
      ageNumber < 18 ||
      ageNumber > 100
    ) {
      return res.status(400).json({
        message: "Age must be between 18 and 100.",
      });
    }

    // ========================================================
    // MOBILE VALIDATION
    // ========================================================

    if (
      finalMobile !== null &&
      finalMobile !== undefined &&
      String(finalMobile).trim() !== ""
    ) {
      const mobileRegex = /^\d{10}$/;

      if (!mobileRegex.test(String(finalMobile).trim())) {
        return res.status(400).json({
          message:
            "Mobile number must contain exactly 10 digits.",
        });
      }
    }

    // ========================================================
    // EMAIL DUPLICATE CHECK
    // ========================================================

    const emailCheck = await pool.query(
      `
      SELECT id
      FROM users
      WHERE LOWER(email) = LOWER($1)
      AND id != $2
      `,
      [
        finalEmail,
        id,
      ]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        message: "Another employee already uses this email.",
      });
    }

    // ========================================================
    // UPDATE EMPLOYEE
    // ========================================================

    const updatedUser = await pool.query(
      `
      UPDATE users
      SET
        name = $1,
        email = $2,
        age = $3,
        mobile = $4,
        role = $5,
        department = $6,
        designation = $7,
        status = $8
      WHERE id = $9
      RETURNING
        id,
        name,
        email,
        age,
        mobile,
        role,
        department,
        designation,
        status,
        created_at
      `,
      [
        finalName,
        finalEmail,
        ageNumber,
        finalMobile,
        finalRole,
        finalDepartment,
        finalDesignation,
        finalStatus,
        id,
      ]
    );

    // ========================================================
    // RESPONSE
    // ========================================================

    return res.status(200).json({
      message: "Employee updated successfully.",
      user: updatedUser.rows[0],
    });
  } catch (err) {
    console.error("Update Employee Error:", err);

    return res.status(500).json({
      message: "Update failed.",
      error: err.message,
    });
  }
});

// ============================================================
// DELETE USER
// DELETE /users/:id
// ============================================================

app.delete(
  "/users/:id",
  verifyToken,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      // ======================================================
      // CHECK USER
      // ======================================================

      const existingUser = await pool.query(
        "SELECT id FROM users WHERE id = $1",
        [id]
      );

      if (existingUser.rows.length === 0) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      // ======================================================
      // PREVENT ADMIN SELF DELETE
      // ======================================================

      if (Number(id) === Number(req.user.id)) {
        return res.status(400).json({
          message:
            "You cannot delete your own admin account.",
        });
      }

      // ======================================================
      // DELETE
      // ======================================================

      await pool.query(
        "DELETE FROM users WHERE id = $1",
        [id]
      );

      res.status(200).json({
        message: "Employee deleted successfully.",
      });
    } catch (err) {
      console.error("Delete Employee Error:", err);

      res.status(500).json({
        message: "Delete failed.",
        error: err.message,
      });
    }
  }
);

// ============================================================
// START SERVER
// ============================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
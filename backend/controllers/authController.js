const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ======================================================
// Validation Helpers
// ======================================================

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidMobile = (mobile) => {
  return /^[6-9]\d{9}$/.test(String(mobile));
};

const isValidName = (name) => {
  return /^[A-Za-z\s.'-]{2,50}$/.test(name);
};

// ======================================================
// SIGNUP
// ======================================================

const signup = async (req, res) => {
  try {
    let {
      name,
      email,
      password,
      age,
      mobile,
    } = req.body;

    // --------------------------------------------------
    // Required fields
    // --------------------------------------------------

    if (
      !name ||
      !email ||
      !password ||
      age === undefined ||
      age === null ||
      !mobile
    ) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // --------------------------------------------------
    // Clean input
    // --------------------------------------------------

    name = String(name).trim();
    email = String(email).trim().toLowerCase();
    password = String(password);
    mobile = String(mobile).trim();

    // --------------------------------------------------
    // Name validation
    // --------------------------------------------------

    if (!isValidName(name)) {
      return res.status(400).json({
        message:
          "Name must be 2-50 characters and contain only letters and spaces.",
      });
    }

    // --------------------------------------------------
    // Email validation
    // --------------------------------------------------

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    // --------------------------------------------------
    // Password validation
    // --------------------------------------------------

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    if (password.length > 100) {
      return res.status(400).json({
        message: "Password cannot exceed 100 characters.",
      });
    }

    // --------------------------------------------------
    // Age validation
    // --------------------------------------------------

    const numericAge = Number(age);

    if (!Number.isInteger(numericAge)) {
      return res.status(400).json({
        message: "Age must be a valid whole number.",
      });
    }

    if (numericAge < 18 || numericAge > 100) {
      return res.status(400).json({
        message: "Age must be between 18 and 100.",
      });
    }

    // --------------------------------------------------
    // Mobile validation
    // --------------------------------------------------

    if (!isValidMobile(mobile)) {
      return res.status(400).json({
        message:
          "Mobile number must be a valid 10-digit Indian mobile number.",
      });
    }

    // --------------------------------------------------
    // Check duplicate email
    // --------------------------------------------------

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = LOWER($1)",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    // --------------------------------------------------
    // Hash password
    // --------------------------------------------------

    const hashedPassword = await bcrypt.hash(password, 10);

    // New accounts are normal users
    const role = "user";

    // --------------------------------------------------
    // Store user
    // --------------------------------------------------

    const newUser = await pool.query(
      `INSERT INTO users
      (name, email, password, age, mobile, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, email, age, mobile, role`,
      [
        name,
        email,
        hashedPassword,
        numericAge,
        mobile,
        role,
      ]
    );

    // --------------------------------------------------
    // Success
    // --------------------------------------------------

    return res.status(201).json({
      message: "Signup successful.",
      user: newUser.rows[0],
    });

  } catch (err) {
    console.error("Signup Error:", err);

    // PostgreSQL duplicate key
    if (err.code === "23505") {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

// ======================================================
// LOGIN
// ======================================================

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // --------------------------------------------------
    // Required fields
    // --------------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // --------------------------------------------------
    // Clean input
    // --------------------------------------------------

    email = String(email).trim().toLowerCase();
    password = String(password);

    // --------------------------------------------------
    // Email validation
    // --------------------------------------------------

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    // --------------------------------------------------
    // Password validation
    // --------------------------------------------------

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    // --------------------------------------------------
    // Find user
    // --------------------------------------------------

    const result = await pool.query(
      "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
      [email]
    );

    // --------------------------------------------------
    // User not found
    // --------------------------------------------------

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];

    // --------------------------------------------------
    // Compare password
    // --------------------------------------------------

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // --------------------------------------------------
    // Check JWT secret
    // --------------------------------------------------

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing.");

      return res.status(500).json({
        message: "Authentication service is not configured.",
      });
    }

    // --------------------------------------------------
    // Generate JWT
    // --------------------------------------------------

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // --------------------------------------------------
    // Success
    // --------------------------------------------------

    return res.status(200).json({
      message: "Login successful.",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Login Error:", err);

    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  signup,
  login,
};
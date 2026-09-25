const pool = require("../db");
const bcrypt = require("bcrypt");

// =====================================================
// GET ALL USERS / EMPLOYEES
// GET /users
// =====================================================
const getUsers = async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 8
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const pageSize = Math.max(Number(limit) || 8, 1);
    const offset = (pageNumber - 1) * pageSize;

    const searchValue = `%${search.trim()}%`;

    // -------------------------------------------------
    // COUNT ALL MATCHING USERS
    // -------------------------------------------------
    const countResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM users
      WHERE
        name ILIKE $1
        OR email ILIKE $1
        OR COALESCE(department, '') ILIKE $1
        OR COALESCE(designation, '') ILIKE $1
      `,
      [searchValue]
    );

    const total = Number(countResult.rows[0].total);

    // -------------------------------------------------
    // GET USERS
    // -------------------------------------------------
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
      WHERE
        name ILIKE $1
        OR email ILIKE $1
        OR COALESCE(department, '') ILIKE $1
        OR COALESCE(designation, '') ILIKE $1
      ORDER BY id DESC
      LIMIT $2 OFFSET $3
      `,
      [searchValue, pageSize, offset]
    );

    return res.status(200).json({
      users: result.rows,
      total,
      page: pageNumber,
      limit: pageSize
    });

  } catch (error) {
    console.error("GET USERS ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


// =====================================================
// GET USER BY ID
// GET /users/:id
// =====================================================
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

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
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      user: result.rows[0]
    });

  } catch (error) {
    console.error("GET USER ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


// =====================================================
// CREATE USER / EMPLOYEE
// POST /users
// =====================================================
const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      mobile,
      department,
      designation,
      status
    } = req.body;

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------
    if (
      !name ||
      !email ||
      age === undefined ||
      age === "" ||
      !mobile ||
      !department ||
      !designation
    ) {
      return res.status(400).json({
        message: "Please provide all required employee fields"
      });
    }

    // -------------------------------------------------
    // CHECK EMAIL
    // -------------------------------------------------
    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "A user with this email already exists"
      });
    }

    // -------------------------------------------------
    // PASSWORD
    // -------------------------------------------------
    const plainPassword = password || "Employee@123";

    const hashedPassword = await bcrypt.hash(
      plainPassword,
      10
    );

    // -------------------------------------------------
    // INSERT EMPLOYEE
    // -------------------------------------------------
    const result = await pool.query(
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
        name,
        email,
        hashedPassword,
        age,
        mobile,
        "user",
        department,
        designation,
        status || "active"
      ]
    );

    return res.status(201).json({
      message: "Employee created successfully",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("CREATE USER ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


// =====================================================
// UPDATE USER / EMPLOYEE
// PUT /users/:id
// =====================================================
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      age,
      mobile,
      department,
      designation,
      status,
      role,
      password
    } = req.body;

    // -------------------------------------------------
    // CHECK USER
    // -------------------------------------------------
    const existingUser = await pool.query(
      `
      SELECT *
      FROM users
      WHERE id = $1
      `,
      [id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // -------------------------------------------------
    // CHECK DUPLICATE EMAIL
    // -------------------------------------------------
    if (email) {
      const emailCheck = await pool.query(
        `
        SELECT id
        FROM users
        WHERE email = $1
        AND id != $2
        `,
        [email, id]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          message: "Another user already uses this email"
        });
      }
    }

    // -------------------------------------------------
    // PASSWORD
    // -------------------------------------------------
    let hashedPassword =
      existingUser.rows[0].password;

    if (password) {
      hashedPassword = await bcrypt.hash(
        password,
        10
      );
    }

    // -------------------------------------------------
    // UPDATE
    // -------------------------------------------------
    const result = await pool.query(
      `
      UPDATE users
      SET
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        password = COALESCE($3, password),
        age = COALESCE($4, age),
        mobile = COALESCE($5, mobile),
        role = COALESCE($6, role),
        department = COALESCE($7, department),
        designation = COALESCE($8, designation),
        status = COALESCE($9, status)
      WHERE id = $10
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
        name || null,
        email || null,
        password ? hashedPassword : null,
        age !== undefined && age !== "" ? age : null,
        mobile || null,
        role || null,
        department || null,
        designation || null,
        status || null,
        id
      ]
    );

    return res.status(200).json({
      message: "Employee updated successfully",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


// =====================================================
// DELETE USER / EMPLOYEE
// DELETE /users/:id
// =====================================================
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING id, name, email
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "Employee deleted successfully",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


// =====================================================
// EXPORT
// =====================================================
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
const pool = require("../db");

// =====================================================
// GET ALL DEPARTMENTS
// =====================================================

const getDepartments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        description,
        head,
        created_at
      FROM departments
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Get departments error:", error);

    res.status(500).json({
      message: "Failed to fetch departments"
    });
  }
};

// =====================================================
// CREATE DEPARTMENT
// =====================================================

const createDepartment = async (req, res) => {
  try {
    const {
      name,
      description,
      head
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Department name is required"
      });
    }

    const existing = await pool.query(
      `
      SELECT id
      FROM departments
      WHERE LOWER(name) = LOWER($1)
      `,
      [name.trim()]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        message: "Department already exists"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO departments
        (name, description, head)
      VALUES
        ($1, $2, $3)
      RETURNING
        id,
        name,
        description,
        head,
        created_at
      `,
      [
        name.trim(),
        description?.trim() || null,
        head?.trim() || null
      ]
    );

    res.status(201).json({
      message: "Department created successfully",
      department: result.rows[0]
    });
  } catch (error) {
    console.error("Create department error:", error);

    res.status(500).json({
      message: "Failed to create department"
    });
  }
};

// =====================================================
// UPDATE DEPARTMENT
// =====================================================

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      head
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Department name is required"
      });
    }

    const result = await pool.query(
      `
      UPDATE departments
      SET
        name = $1,
        description = $2,
        head = $3
      WHERE id = $4
      RETURNING
        id,
        name,
        description,
        head,
        created_at
      `,
      [
        name.trim(),
        description?.trim() || null,
        head?.trim() || null,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    res.json({
      message: "Department updated successfully",
      department: result.rows[0]
    });
  } catch (error) {
    console.error("Update department error:", error);

    res.status(500).json({
      message: "Failed to update department"
    });
  }
};

// =====================================================
// DELETE DEPARTMENT
// =====================================================

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM departments
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    res.json({
      message: "Department deleted successfully"
    });
  } catch (error) {
    console.error("Delete department error:", error);

    res.status(500).json({
      message: "Failed to delete department"
    });
  }
};

module.exports = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
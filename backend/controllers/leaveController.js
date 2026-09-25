const pool = require("../db");

// ============================================================
// GET ALL LEAVES
// ============================================================

const getLeaves = async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = `
      SELECT
        l.id,
        l.employee_id,
        u.name AS employee_name,
        u.email AS employee_email,
        u.department,
        u.designation,
        l.leave_type,
        l.start_date,
        l.end_date,
        l.reason,
        l.status,
        l.applied_at,
        l.reviewed_at,
        l.reviewed_by
      FROM leaves l
      LEFT JOIN users u
        ON l.employee_id = u.id
      WHERE 1 = 1
    `;

    const values = [];
    let index = 1;

    if (status && status.toLowerCase() !== "all") {
      query += ` AND LOWER(l.status) = LOWER($${index})`;
      values.push(status);
      index++;
    }

    if (search && search.trim()) {
      query += `
        AND (
          u.name ILIKE $${index}
          OR u.email ILIKE $${index}
          OR l.leave_type ILIKE $${index}
        )
      `;

      values.push(`%${search.trim()}%`);
      index++;
    }

    query += `
      ORDER BY l.applied_at DESC, l.id DESC
    `;

    const result = await pool.query(query, values);

    res.status(200).json({
      leaves: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error("GET LEAVES ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch leave requests",
      error: error.message
    });
  }
};


// ============================================================
// GET SINGLE LEAVE
// ============================================================

const getLeaveById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        l.id,
        l.employee_id,
        u.name AS employee_name,
        u.email AS employee_email,
        u.department,
        u.designation,
        l.leave_type,
        l.start_date,
        l.end_date,
        l.reason,
        l.status,
        l.applied_at,
        l.reviewed_at,
        l.reviewed_by
      FROM leaves l
      LEFT JOIN users u
        ON l.employee_id = u.id
      WHERE l.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Leave request not found"
      });
    }

    res.json({
      leave: result.rows[0]
    });

  } catch (error) {
    console.error("GET LEAVE ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch leave request",
      error: error.message
    });
  }
};


// ============================================================
// CREATE LEAVE
// ============================================================

const createLeave = async (req, res) => {
  try {

    let {
      employee_id,
      employee,
      employeeId,
      leave_type,
      leaveType,
      start_date,
      startDate,
      end_date,
      endDate,
      reason
    } = req.body;


    // ========================================================
    // NORMALIZE FRONTEND DATA
    // ========================================================

    leave_type = leave_type || leaveType;
    start_date = start_date || startDate;
    end_date = end_date || endDate;

    employee_id =
      employee_id ||
      employeeId ||
      null;


    // ========================================================
    // VALIDATION
    // ========================================================

    if (!employee_id && !employee) {
      return res.status(400).json({
        message: "Employee is required"
      });
    }

    if (!leave_type || !String(leave_type).trim()) {
      return res.status(400).json({
        message: "Leave type is required"
      });
    }

    if (!start_date) {
      return res.status(400).json({
        message: "Start date is required"
      });
    }

    if (!end_date) {
      return res.status(400).json({
        message: "End date is required"
      });
    }

    if (!reason || !String(reason).trim()) {
      return res.status(400).json({
        message: "Reason is required"
      });
    }


    // ========================================================
    // DATE VALIDATION
    // ========================================================

    if (new Date(end_date) < new Date(start_date)) {
      return res.status(400).json({
        message: "End date cannot be before start date"
      });
    }


    // ========================================================
    // FIND EMPLOYEE
    // ========================================================

    let employeeResult;

    if (employee_id) {

      employeeResult = await pool.query(
        `
        SELECT id, name, email
        FROM users
        WHERE id = $1
        `,
        [employee_id]
      );

    } else {

      employeeResult = await pool.query(
        `
        SELECT id, name, email
        FROM users
        WHERE
          LOWER(name) = LOWER($1)
          OR LOWER(email) = LOWER($1)
        LIMIT 1
        `,
        [String(employee).trim()]
      );
    }


    if (employeeResult.rows.length === 0) {
      return res.status(404).json({
        message: `Employee "${employee || employee_id}" not found`
      });
    }


    const actualEmployeeId =
      employeeResult.rows[0].id;


    // ========================================================
    // CHECK OVERLAPPING LEAVE
    // ========================================================

    const overlapping = await pool.query(
      `
      SELECT id
      FROM leaves
      WHERE
        employee_id = $1
        AND LOWER(status) IN ('pending', 'approved')
        AND start_date <= $3
        AND end_date >= $2
      `,
      [
        actualEmployeeId,
        start_date,
        end_date
      ]
    );


    if (overlapping.rows.length > 0) {
      return res.status(409).json({
        message:
          "This employee already has a pending or approved leave during these dates"
      });
    }


    // ========================================================
    // INSERT LEAVE
    // ========================================================

    const result = await pool.query(
      `
      INSERT INTO leaves
      (
        employee_id,
        leave_type,
        start_date,
        end_date,
        reason,
        status,
        applied_at
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        'pending',
        NOW()
      )
      RETURNING
        id,
        employee_id,
        leave_type,
        start_date,
        end_date,
        reason,
        status,
        applied_at
      `,
      [
        actualEmployeeId,
        String(leave_type).trim(),
        start_date,
        end_date,
        String(reason).trim()
      ]
    );


    res.status(201).json({
      message: "Leave request submitted successfully",
      leave: result.rows[0]
    });

  } catch (error) {

    console.error("CREATE LEAVE ERROR:", error);

    res.status(500).json({
      message: "Failed to submit leave request",
      error: error.message
    });
  }
};


// ============================================================
// UPDATE LEAVE
// ============================================================

const updateLeave = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      employee_id,
      employeeId,
      leave_type,
      leaveType,
      start_date,
      startDate,
      end_date,
      endDate,
      reason,
      status,
      reviewed_by
    } = req.body;


    const finalStatus =
      status
        ? String(status).toLowerCase()
        : null;


    const result = await pool.query(
      `
      UPDATE leaves
      SET
        employee_id = COALESCE($1, employee_id),
        leave_type = COALESCE($2, leave_type),
        start_date = COALESCE($3, start_date),
        end_date = COALESCE($4, end_date),
        reason = COALESCE($5, reason),
        status = COALESCE($6, status),
        reviewed_by = COALESCE($7, reviewed_by),
        reviewed_at =
          CASE
            WHEN $6 IN ('approved', 'rejected')
            THEN NOW()
            ELSE reviewed_at
          END
      WHERE id = $8
      RETURNING
        id,
        employee_id,
        leave_type,
        start_date,
        end_date,
        reason,
        status,
        applied_at,
        reviewed_at,
        reviewed_by
      `,
      [
        employee_id || employeeId || null,
        leave_type || leaveType || null,
        start_date || startDate || null,
        end_date || endDate || null,
        reason || null,
        finalStatus,
        reviewed_by || null,
        id
      ]
    );


    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Leave request not found"
      });
    }


    res.json({
      message: "Leave request updated successfully",
      leave: result.rows[0]
    });

  } catch (error) {

    console.error("UPDATE LEAVE ERROR:", error);

    res.status(500).json({
      message: "Failed to update leave request",
      error: error.message
    });
  }
};


// ============================================================
// APPROVE LEAVE
// ============================================================

const approveLeave = async (req, res) => {
  try {

    const { id } = req.params;

    const reviewedBy =
      req.body.reviewed_by ||
      req.user?.name ||
      req.user?.email ||
      "Admin";


    const result = await pool.query(
      `
      UPDATE leaves
      SET
        status = 'approved',
        reviewed_at = NOW(),
        reviewed_by = $1
      WHERE id = $2
      RETURNING *
      `,
      [reviewedBy, id]
    );


    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Leave request not found"
      });
    }


    res.json({
      message: "Leave request approved successfully",
      leave: result.rows[0]
    });

  } catch (error) {

    console.error("APPROVE LEAVE ERROR:", error);

    res.status(500).json({
      message: "Failed to approve leave request",
      error: error.message
    });
  }
};


// ============================================================
// REJECT LEAVE
// ============================================================

const rejectLeave = async (req, res) => {
  try {

    const { id } = req.params;

    const reviewedBy =
      req.body.reviewed_by ||
      req.user?.name ||
      req.user?.email ||
      "Admin";


    const result = await pool.query(
      `
      UPDATE leaves
      SET
        status = 'rejected',
        reviewed_at = NOW(),
        reviewed_by = $1
      WHERE id = $2
      RETURNING *
      `,
      [reviewedBy, id]
    );


    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Leave request not found"
      });
    }


    res.json({
      message: "Leave request rejected successfully",
      leave: result.rows[0]
    });

  } catch (error) {

    console.error("REJECT LEAVE ERROR:", error);

    res.status(500).json({
      message: "Failed to reject leave request",
      error: error.message
    });
  }
};


// ============================================================
// DELETE LEAVE
// ============================================================

const deleteLeave = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM leaves
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );


    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Leave request not found"
      });
    }


    res.json({
      message: "Leave request deleted successfully"
    });

  } catch (error) {

    console.error("DELETE LEAVE ERROR:", error);

    res.status(500).json({
      message: "Failed to delete leave request",
      error: error.message
    });
  }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getLeaves,
  getLeaveById,
  createLeave,
  updateLeave,
  approveLeave,
  rejectLeave,
  deleteLeave
};
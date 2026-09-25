const pool = require("../db");

// =====================================================
// GET ATTENDANCE
// GET /attendance
// Supports:
// ?date=2026-08-18
// ?employee_id=1
// ?status=present
// =====================================================
const getAttendance = async (req, res) => {
  try {
    const {
      date,
      employee_id,
      status
    } = req.query;

    let query = `
      SELECT
        a.id,
        a.employee_id,
        u.name AS employee_name,
        u.email AS employee_email,
        u.department,
        u.designation,
        a.attendance_date,
        a.status,
        a.check_in,
        a.check_out,
        a.notes,
        a.created_at
      FROM attendance a
      INNER JOIN users u
        ON a.employee_id = u.id
      WHERE 1 = 1
    `;

    const values = [];
    let index = 1;

    if (date) {
      query += ` AND a.attendance_date = $${index}`;
      values.push(date);
      index++;
    }

    if (employee_id) {
      query += ` AND a.employee_id = $${index}`;
      values.push(employee_id);
      index++;
    }

    if (status) {
      query += ` AND a.status = $${index}`;
      values.push(status);
      index++;
    }

    query += `
      ORDER BY
        a.attendance_date DESC,
        u.name ASC
    `;

    const result = await pool.query(query, values);

    return res.status(200).json({
      attendance: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error("GET ATTENDANCE ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


// =====================================================
// GET ATTENDANCE BY ID
// GET /attendance/:id
// =====================================================
const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        a.id,
        a.employee_id,
        u.name AS employee_name,
        u.email AS employee_email,
        u.department,
        u.designation,
        a.attendance_date,
        a.status,
        a.check_in,
        a.check_out,
        a.notes,
        a.created_at
      FROM attendance a
      INNER JOIN users u
        ON a.employee_id = u.id
      WHERE a.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Attendance record not found"
      });
    }

    return res.status(200).json({
      attendance: result.rows[0]
    });

  } catch (error) {
    console.error("GET ATTENDANCE BY ID ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


// =====================================================
// CREATE ATTENDANCE
// POST /attendance
// =====================================================
const createAttendance = async (req, res) => {
  try {
    const {
      employee_id,
      attendance_date,
      status = "present",
      check_in,
      check_out,
      notes
    } = req.body;

    // -------------------------------------------------
    // REQUIRED FIELDS
    // -------------------------------------------------
    if (!employee_id || !attendance_date) {
      return res.status(400).json({
        message: "Employee and attendance date are required"
      });
    }

    // -------------------------------------------------
    // VALID STATUS
    // -------------------------------------------------
    const validStatuses = [
      "present",
      "absent",
      "late",
      "half-day"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid attendance status. Use present, absent, late, or half-day."
      });
    }

    // -------------------------------------------------
    // CHECK EMPLOYEE
    // -------------------------------------------------
    const employee = await pool.query(
      `
      SELECT id, name
      FROM users
      WHERE id = $1
      `,
      [employee_id]
    );

    if (employee.rows.length === 0) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    // -------------------------------------------------
    // CHECK DUPLICATE
    // -------------------------------------------------
    const duplicate = await pool.query(
      `
      SELECT id
      FROM attendance
      WHERE employee_id = $1
      AND attendance_date = $2
      `,
      [employee_id, attendance_date]
    );

    if (duplicate.rows.length > 0) {
      return res.status(400).json({
        message:
          "Attendance has already been marked for this employee on this date"
      });
    }

    // -------------------------------------------------
    // CREATE RECORD
    // -------------------------------------------------
    const result = await pool.query(
      `
      INSERT INTO attendance
      (
        employee_id,
        attendance_date,
        status,
        check_in,
        check_out,
        notes
      )
      VALUES
      ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        employee_id,
        attendance_date,
        status,
        check_in,
        check_out,
        notes,
        created_at
      `,
      [
        employee_id,
        attendance_date,
        status,
        check_in || null,
        check_out || null,
        notes || null
      ]
    );

    return res.status(201).json({
      message: "Attendance marked successfully",
      attendance: result.rows[0]
    });

  } catch (error) {
    console.error("CREATE ATTENDANCE ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


// =====================================================
// UPDATE ATTENDANCE
// PUT /attendance/:id
// =====================================================
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      employee_id,
      attendance_date,
      status,
      check_in,
      check_out,
      notes
    } = req.body;

    // -------------------------------------------------
    // CHECK RECORD
    // -------------------------------------------------
    const existing = await pool.query(
      `
      SELECT *
      FROM attendance
      WHERE id = $1
      `,
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        message: "Attendance record not found"
      });
    }

    // -------------------------------------------------
    // VALID STATUS
    // -------------------------------------------------
    if (status) {
      const validStatuses = [
        "present",
        "absent",
        "late",
        "half-day"
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid attendance status"
        });
      }
    }

    // -------------------------------------------------
    // UPDATE
    // -------------------------------------------------
    const result = await pool.query(
      `
      UPDATE attendance
      SET
        employee_id = COALESCE($1, employee_id),
        attendance_date = COALESCE($2, attendance_date),
        status = COALESCE($3, status),
        check_in = COALESCE($4, check_in),
        check_out = COALESCE($5, check_out),
        notes = COALESCE($6, notes)
      WHERE id = $7
      RETURNING
        id,
        employee_id,
        attendance_date,
        status,
        check_in,
        check_out,
        notes,
        created_at
      `,
      [
        employee_id || null,
        attendance_date || null,
        status || null,
        check_in || null,
        check_out || null,
        notes || null,
        id
      ]
    );

    return res.status(200).json({
      message: "Attendance updated successfully",
      attendance: result.rows[0]
    });

  } catch (error) {
    console.error("UPDATE ATTENDANCE ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


// =====================================================
// DELETE ATTENDANCE
// DELETE /attendance/:id
// =====================================================
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM attendance
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Attendance record not found"
      });
    }

    return res.status(200).json({
      message: "Attendance record deleted successfully"
    });

  } catch (error) {
    console.error("DELETE ATTENDANCE ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


// =====================================================
// ATTENDANCE SUMMARY
// GET /attendance/summary
// =====================================================
const getAttendanceSummary = async (req, res) => {
  try {
    const { date } = req.query;

    const attendanceDate =
      date ||
      new Date().toISOString().split("T")[0];

    const result = await pool.query(
      `
      SELECT
        COUNT(*) FILTER (
          WHERE status = 'present'
        ) AS present,

        COUNT(*) FILTER (
          WHERE status = 'absent'
        ) AS absent,

        COUNT(*) FILTER (
          WHERE status = 'late'
        ) AS late,

        COUNT(*) FILTER (
          WHERE status = 'half-day'
        ) AS half_day

      FROM attendance
      WHERE attendance_date = $1
      `,
      [attendanceDate]
    );

    return res.status(200).json({
      date: attendanceDate,
      summary: {
        present: Number(result.rows[0].present),
        absent: Number(result.rows[0].absent),
        late: Number(result.rows[0].late),
        half_day: Number(result.rows[0].half_day)
      }
    });

  } catch (error) {
    console.error("ATTENDANCE SUMMARY ERROR:", error);

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
  getAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceSummary
};
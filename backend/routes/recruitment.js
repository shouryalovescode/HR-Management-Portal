const express = require("express");
const router = express.Router();
const pool = require("../db");

// =====================================================
// GET ALL JOB OPENINGS
// GET /recruitment/jobs
// =====================================================

router.get("/jobs", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM job_openings
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("GET JOBS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch job openings"
    });
  }
});

// =====================================================
// CREATE JOB OPENING
// POST /recruitment/jobs
// =====================================================

router.post("/jobs", async (req, res) => {
  try {
    const {
      position,
      department,
      location,
      employment_type,
      openings,
      status
    } = req.body;

    if (!position || !department || !location) {
      return res.status(400).json({
        message: "Position, department and location are required"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO job_openings
      (
        position,
        department,
        location,
        employment_type,
        openings,
        applicants,
        status
      )
      VALUES ($1, $2, $3, $4, $5, 0, $6)
      RETURNING *
      `,
      [
        position,
        department,
        location,
        employment_type || "Full Time",
        Number(openings) || 1,
        status || "Open"
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);

    res.status(500).json({
      message: "Failed to create job opening"
    });
  }
});

// =====================================================
// UPDATE JOB OPENING
// PUT /recruitment/jobs/:id
// =====================================================

router.put("/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      position,
      department,
      location,
      employment_type,
      openings,
      status
    } = req.body;

    const result = await pool.query(
      `
      UPDATE job_openings
      SET
        position = $1,
        department = $2,
        location = $3,
        employment_type = $4,
        openings = $5,
        status = $6
      WHERE id = $7
      RETURNING *
      `,
      [
        position,
        department,
        location,
        employment_type || "Full Time",
        Number(openings) || 1,
        status || "Open",
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Job opening not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("UPDATE JOB ERROR:", error);

    res.status(500).json({
      message: "Failed to update job opening"
    });
  }
});

// =====================================================
// DELETE JOB OPENING
// DELETE /recruitment/jobs/:id
// =====================================================

router.delete("/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM job_openings
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Job opening not found"
      });
    }

    res.json({
      message: "Job opening deleted successfully"
    });
  } catch (error) {
    console.error("DELETE JOB ERROR:", error);

    res.status(500).json({
      message: "Failed to delete job opening"
    });
  }
});

// =====================================================
// GET ALL CANDIDATES
// GET /recruitment/candidates
// =====================================================

router.get("/candidates", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM candidates
      ORDER BY applied_date DESC, created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("GET CANDIDATES ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch candidates"
    });
  }
});

// =====================================================
// CREATE CANDIDATE
// POST /recruitment/candidates
// =====================================================

router.post("/candidates", async (req, res) => {
  try {
    const {
      name,
      email,
      position,
      experience,
      applied_date,
      stage
    } = req.body;

    if (!name || !position) {
      return res.status(400).json({
        message: "Candidate name and position are required"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO candidates
      (
        name,
        email,
        position,
        experience,
        applied_date,
        stage
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        name,
        email || null,
        position,
        experience || "Fresher",
        applied_date || new Date().toISOString().split("T")[0],
        stage || "Applied"
      ]
    );

    // Automatically increase applicant count
    await pool.query(
      `
      UPDATE job_openings
      SET applicants = applicants + 1
      WHERE position = $1
      `,
      [position]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("CREATE CANDIDATE ERROR:", error);

    res.status(500).json({
      message: "Failed to create candidate"
    });
  }
});

// =====================================================
// UPDATE CANDIDATE
// PUT /recruitment/candidates/:id
// =====================================================

router.put("/candidates/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      position,
      experience,
      applied_date,
      stage
    } = req.body;

    const result = await pool.query(
      `
      UPDATE candidates
      SET
        name = $1,
        email = $2,
        position = $3,
        experience = $4,
        applied_date = $5,
        stage = $6
      WHERE id = $7
      RETURNING *
      `,
      [
        name,
        email || null,
        position,
        experience || "Fresher",
        applied_date,
        stage || "Applied",
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("UPDATE CANDIDATE ERROR:", error);

    res.status(500).json({
      message: "Failed to update candidate"
    });
  }
});

// =====================================================
// DELETE CANDIDATE
// DELETE /recruitment/candidates/:id
// =====================================================

router.delete("/candidates/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await pool.query(
      `
      SELECT position
      FROM candidates
      WHERE id = $1
      `,
      [id]
    );

    if (candidate.rows.length === 0) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }

    const position = candidate.rows[0].position;

    await pool.query(
      `
      DELETE FROM candidates
      WHERE id = $1
      `,
      [id]
    );

    await pool.query(
      `
      UPDATE job_openings
      SET applicants = GREATEST(applicants - 1, 0)
      WHERE position = $1
      `,
      [position]
    );

    res.json({
      message: "Candidate deleted successfully"
    });
  } catch (error) {
    console.error("DELETE CANDIDATE ERROR:", error);

    res.status(500).json({
      message: "Failed to delete candidate"
    });
  }
});

// =====================================================
// UPDATE CANDIDATE STAGE
// PATCH /recruitment/candidates/:id/stage
// =====================================================

router.patch("/candidates/:id/stage", async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;

    const allowedStages = [
      "Applied",
      "Screening",
      "Interview",
      "Selected",
      "Rejected",
      "Hired"
    ];

    if (!allowedStages.includes(stage)) {
      return res.status(400).json({
        message: "Invalid candidate stage"
      });
    }

    const result = await pool.query(
      `
      UPDATE candidates
      SET stage = $1
      WHERE id = $2
      RETURNING *
      `,
      [stage, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("UPDATE STAGE ERROR:", error);

    res.status(500).json({
      message: "Failed to update candidate stage"
    });
  }
});

// =====================================================
// RECRUITMENT DASHBOARD STATS
// GET /recruitment/stats
// =====================================================

router.get("/stats", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*)
         FROM job_openings
         WHERE LOWER(status) = 'open') AS open_positions,

        (SELECT COUNT(*)
         FROM candidates) AS total_applicants,

        (SELECT COUNT(*)
         FROM candidates
         WHERE LOWER(stage) = 'interview') AS interviews,

        (SELECT COUNT(*)
         FROM candidates
         WHERE LOWER(stage) = 'hired') AS hired
    `);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("RECRUITMENT STATS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch recruitment statistics"
    });
  }
});

module.exports = router;
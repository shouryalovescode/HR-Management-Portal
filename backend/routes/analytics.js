const express = require("express");
const pool = require("../db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();


// ============================================================
// GET ANALYTICS
// GET /analytics
// ============================================================

router.get("/", verifyToken, async (req, res) => {
  try {

    // ========================================================
    // TOTAL EMPLOYEES
    // ========================================================

    const totalResult = await pool.query(`
      SELECT COUNT(*) AS total
      FROM users
    `);


    // ========================================================
    // ACTIVE / INACTIVE
    // ========================================================

    const statusResult = await pool.query(`
      SELECT
        status,
        COUNT(*) AS count
      FROM users
      GROUP BY status
      ORDER BY status
    `);


    // ========================================================
    // AVERAGE AGE
    // ========================================================

    const ageResult = await pool.query(`
      SELECT
        ROUND(AVG(age), 0) AS average_age
      FROM users
      WHERE age IS NOT NULL
    `);


    // ========================================================
    // HEADCOUNT BY DEPARTMENT
    // ========================================================

    const departmentResult = await pool.query(`
      SELECT
        COALESCE(department, 'Unassigned') AS department,
        COUNT(*) AS employees
      FROM users
      GROUP BY department
      ORDER BY employees DESC
    `);


    // ========================================================
    // AGE DISTRIBUTION
    // ========================================================

    const ageDistributionResult = await pool.query(`
      SELECT
        CASE
          WHEN age BETWEEN 18 AND 25 THEN '18–25'
          WHEN age BETWEEN 26 AND 35 THEN '26–35'
          WHEN age BETWEEN 36 AND 45 THEN '36–45'
          WHEN age >= 46 THEN '46+'
          ELSE 'Unknown'
        END AS age_group,
        COUNT(*) AS value
      FROM users
      GROUP BY age_group
      ORDER BY age_group
    `);


    // ========================================================
    // RESPONSE
    // ========================================================

    res.status(200).json({

      totalEmployees:
        Number(totalResult.rows[0].total),

      averageAge:
        Number(ageResult.rows[0].average_age) || 0,

      status: statusResult.rows.map((item) => ({
        status: item.status,
        count: Number(item.count)
      })),

      departments:
        departmentResult.rows.map((item) => ({
          department: item.department,
          employees: Number(item.employees)
        })),

      ageDistribution:
        ageDistributionResult.rows.map((item) => ({
          name: item.age_group,
          value: Number(item.value)
        }))

    });

  } catch (err) {

    console.error("Analytics Error:", err);

    res.status(500).json({
      message: "Unable to load analytics.",
      error: err.message
    });

  }
});


module.exports = router;
const express = require("express");

const router = express.Router();

const attendanceController = require("../controllers/attendanceController");
const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// ATTENDANCE ROUTES
// =====================================================

// GET /attendance
router.get("/", authMiddleware, attendanceController.getAttendance);

// GET /attendance/summary
router.get(
  "/summary",
  authMiddleware,
  attendanceController.getAttendanceSummary
);

// GET /attendance/:id
router.get(
  "/:id",
  authMiddleware,
  attendanceController.getAttendanceById
);

// POST /attendance
router.post(
  "/",
  authMiddleware,
  attendanceController.createAttendance
);

// PUT /attendance/:id
router.put(
  "/:id",
  authMiddleware,
  attendanceController.updateAttendance
);

// DELETE /attendance/:id
router.delete(
  "/:id",
  authMiddleware,
  attendanceController.deleteAttendance
);

module.exports = router;
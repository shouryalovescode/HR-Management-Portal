const express = require("express");

const router = express.Router();

const {
  getLeaves,
  getLeaveById,
  createLeave,
  updateLeave,
  approveLeave,
  rejectLeave,
  deleteLeave
} = require("../controllers/leaveController");

const verifyToken = require("../middleware/authMiddleware");

// GET ALL
router.get("/", verifyToken, getLeaves);

// GET ONE
router.get("/:id", verifyToken, getLeaveById);

// CREATE
router.post("/", verifyToken, createLeave);

// UPDATE
router.put("/:id", verifyToken, updateLeave);

// APPROVE
router.put("/:id/approve", verifyToken, approveLeave);

// REJECT
router.put("/:id/reject", verifyToken, rejectLeave);

// DELETE
router.delete("/:id", verifyToken, deleteLeave);

module.exports = router;
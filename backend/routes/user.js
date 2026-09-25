const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

// =========================
// GET ALL EMPLOYEES
// GET /users
// =========================
router.get(
  "/",
  authMiddleware,
  getUsers
);

// =========================
// GET SINGLE EMPLOYEE
// GET /users/:id
// =========================
router.get(
  "/:id",
  authMiddleware,
  getUserById
);

// =========================
// ADD EMPLOYEE
// POST /users
// =========================
router.post(
  "/",
  authMiddleware,
  createUser
);

// =========================
// UPDATE EMPLOYEE
// PUT /users/:id
// =========================
router.put(
  "/:id",
  authMiddleware,
  updateUser
);

// =========================
// DELETE EMPLOYEE
// DELETE /users/:id
// =========================
router.delete(
  "/:id",
  authMiddleware,
  deleteUser
);

module.exports = router;
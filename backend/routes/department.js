const express = require("express");

const {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require("../controllers/departmentController");

const router = express.Router();

// GET all departments
router.get("/", getDepartments);

// CREATE department
router.post("/", createDepartment);

// UPDATE department
router.put("/:id", updateDepartment);

// DELETE department
router.delete("/:id", deleteDepartment);

module.exports = router;
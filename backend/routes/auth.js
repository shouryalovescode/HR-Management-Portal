const express = require("express");
const router = express.Router();

console.log("✅ Auth Routes Loaded");

router.get("/test", (req, res) => {
  res.json({
    message: "Auth Route Working",
  });
});

const {
  signup,
  login,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
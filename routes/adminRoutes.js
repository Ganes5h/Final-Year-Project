const express = require("express");
const {
  registerUser,
  bulkRegisterUsers,
  login,
} = require("../controllers/adminController");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "/uploads" });

// Register a single user

router.post("/register", registerUser);

// Bulk register users
router.post("/bulk-register", upload.single("file"), bulkRegisterUsers);

// Login route
router.post("/login", login);
module.exports = router;

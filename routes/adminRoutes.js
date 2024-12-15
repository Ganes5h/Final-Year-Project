const express = require("express");
const {
  registerUser,
  bulkRegisterUsers,
  login,
  adminLogin,
  getUserNamesAndIds,
} = require("../controllers/adminController");

const { getAllClubs, deleteClub } = require("../controllers/clubController.js");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "/uploads" });

// Register a single user

router.post("/register", registerUser);

// Bulk register users
router.post("/bulk-register", upload.single("file"), bulkRegisterUsers);

// Login route
router.post("/login", login);
// Admin Login
router.post("/super-admin", adminLogin);

router.get("/users/names-ids", getUserNamesAndIds);

// Get all clubs
router.get("/clubs", getAllClubs);

// Delete a club by ID
router.delete("/clubs/:id", deleteClub);
module.exports = router;

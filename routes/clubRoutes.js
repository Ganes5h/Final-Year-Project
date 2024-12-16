// routes/clubRoutes.js
const express = require("express");
const multer = require("multer");
const { createClub } = require("../controllers/clubController");
const router = express.Router();
const path = require("path");
// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized access" });
  }
};

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/clubLogos"); // Set the destination folder for logo uploads
  },
  filename: (req, file, cb) => {
    // Set the file name to be unique
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Route to create a new club with logo upload
router.post("/create", upload.single("logo"), createClub);

module.exports = router;

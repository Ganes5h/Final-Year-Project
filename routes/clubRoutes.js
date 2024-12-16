// // routes/clubRoutes.js
// const express = require("express");
// const multer = require("multer");
// const { createClub } = require("../controllers/clubController");
// const router = express.Router();
// const path = require("path");
// // Middleware to check if user is authenticated
// const isAuthenticated = (req, res, next) => {
//   if (req.session.user) {
//     return next();
//   } else {
//     return res.status(401).json({ message: "Unauthorized access" });
//   }
// };

// // Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/clubLogos"); // Set the destination folder for logo uploads
//   },
//   filename: (req, file, cb) => {
//     // Set the file name to be unique
//     const uniqueName = Date.now() + path.extname(file.originalname);
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

// // Route to create a new club with logo upload
// router.post("/create", upload.single("logo"), createClub);

// module.exports = router;

// routes/clubRoutes.js
const express = require("express");
const multer = require("multer");
const { createClub } = require("../controllers/clubController");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized access" });
  }
};

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads", "clubLogos");
try {
  // Create directory if it doesn't exist, including nested directories
  fs.mkdirSync(uploadDir, { recursive: true });
} catch (err) {
  console.error("Error creating upload directory:", err);
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename to remove potential security risks
    const sanitizedOriginalName = file.originalname.replace(
      /[^a-zA-Z0-9.]/g,
      ""
    );
    const uniqueName = `${Date.now()}-${sanitizedOriginalName}`;
    cb(null, uniqueName);
  },
});

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  // Accept image files only
  const allowedFileTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Configure multer with storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 5MB file size limit
  },
});

// Middleware to handle multer errors
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    return res.status(400).json({
      message: err.message || "File upload error",
      error: err,
    });
  } else if (err) {
    // An unknown error occurred
    return res.status(500).json({
      message: err.message || "Unknown error occurred during file upload",
      error: err,
    });
  }
  next();
};

// Route to create a new club with logo upload
// Apply authentication middleware if needed
router.post(
  "/create",
  // Uncomment the next line if you want to enforce authentication
  // isAuthenticated,
  upload.single("logo"),
  createClub,
  multerErrorHandler
);

module.exports = router;

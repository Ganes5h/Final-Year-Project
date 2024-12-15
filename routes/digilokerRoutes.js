// Routes setup
const express = require("express");
const {
  getAllDocuments,
  uploadDocument,
  viewDocument,
  upload,
} = require("../controllers/digiLoker.js");

const router = express.Router();

router.post("/upload", upload, uploadDocument);
router.get("/documents/:userId", getAllDocuments);
router.get("/view/:userId/:documentId", viewDocument);

module.exports = router;

// Required imports
const express = require("express");
const multer = require("multer");
const path = require("path");
const { DigiLocker, User } = require("../models/userModel"); // Import DigiLocker model

// Multer configuration

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/digilocker");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("file"); // Expecting a field named "file"

// Controller methods
const uploadDocument = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { title, description, fileType, source, category } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    if (!title || !fileType || !source || !category) {
      return res
        .status(400)
        .json({ message: "Missing required document fields." });
    }

    // Validate user existence
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find or create DigiLocker for the user
    let digiLocker = await DigiLocker.findOne({ user: userId });
    if (!digiLocker) {
      digiLocker = new DigiLocker({ user: userId }); // Initialize a new DigiLocker
    }

    const fileSize = req.file.size;
    const filePath = `/uploads/digilocker/${req.file.filename}`;

    // Check DigiLocker size limit
    if (digiLocker.totalSize + fileSize > digiLocker.maxSize) {
      return res
        .status(400)
        .json({ message: "Upload exceeds DigiLocker size limit." });
    }

    // Check DigiLocker document limit
    if (digiLocker.documentCount >= digiLocker.maxDocuments) {
      return res.status(400).json({
        message: "DigiLocker has reached the maximum document limit.",
      });
    }

    // Create document object
    const document = {
      title,
      description,
      fileType,
      fileName: req.file.filename,
      filePath,
      fileSize,
      source,
      category,
    };

    // Add document to DigiLocker
    digiLocker.documents.push(document);
    digiLocker.totalSize += fileSize;
    digiLocker.documentCount += 1;

    // Save updated DigiLocker
    await digiLocker.save();

    res.status(201).json({
      message: "Document uploaded successfully.",
      document,
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

const getAllDocuments = async (req, res) => {
  try {
    const userId = req.params.userId;

    const digiLocker = await DigiLocker.findOne({ user: userId });
    if (!digiLocker) {
      return res
        .status(404)
        .json({ message: "No DigiLocker found for this user." });
    }

    res.status(200).json({ documents: digiLocker.documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

const viewDocument = async (req, res) => {
  try {
    const { userId, documentId } = req.params;

    const digiLocker = await DigiLocker.findOne({ user: userId });
    if (!digiLocker) {
      return res.status(404).json({ message: "DigiLocker not found." });
    }

    const document = digiLocker.documents.id(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found." });
    }

    const filePath = path.join(__dirname, `..${document.filePath}`);
    res.sendFile(filePath);
  } catch (error) {
    console.error("Error viewing document:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

module.exports = {
  getAllDocuments,
  uploadDocument,
  viewDocument,
  upload,
};

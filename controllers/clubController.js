// controllers/clubController.js
const { Club } = require("../models/userModel");
const { User } = require("../models/userModel");
const path = require("path");
const fs = require("fs");

// Ensure the clubLogos directory exists
const logoDir = path.join(__dirname, "../uploads/clubLogos");
if (!fs.existsSync(logoDir)) {
  fs.mkdirSync(logoDir, { recursive: true });
}

exports.createClub = async (req, res) => {
  try {
    const { name, description, coordinators } = req.body;
    const createdBy = req.session.user?.id; // Ensure the user is logged in
    const logo = req.file?.filename; // Get the filename of the uploaded logo

    // Check if the user has the role to create a club
    if (
      req.session.user.role !== "admin" &&
      req.session.user.role !== "club_coordinator"
    ) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions" });
    }

    // Check if a club with the same name already exists
    const existingClub = await Club.findOne({ name });
    if (existingClub) {
      return res
        .status(400)
        .json({ message: "Club with this name already exists." });
    }

    // Create the club
    const newClub = new Club({
      name,
      description,
      logo, // Save the filename in the database
      coordinators,
      createdBy,
    });

    await newClub.save();

    res.status(201).json({
      message: "Club created successfully.",
      club: newClub,
    });
  } catch (error) {
    console.error("Error creating club:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

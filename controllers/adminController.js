const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { User, Club } = require("../models/userModel");
const { sendMail } = require("../utils/mail");
const { generateToken } = require("../utils/token"); // If token verification is needed
const jwt = require("jsonwebtoken");
// Bulk Registration Controller
exports.bulkRegisterUsers = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "CSV file is required." });
  }

  const users = [];

  // Parse CSV file
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      // Push each row (user data) into users array
      users.push(row);
    })
    .on("end", async () => {
      const registeredUsers = [];
      const failedUsers = [];

      // Loop through each user and register
      for (const user of users) {
        const { name, email, role, department, registrationNumber, phone } =
          user;

        try {
          // Check if user already exists
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            failedUsers.push({ email, error: "User already exists" });
            continue;
          }

          // Generate temporary password
          const tempPassword = crypto.randomBytes(8).toString("hex");
          const hashedPassword = await bcrypt.hash(tempPassword, 10);

          // Create new user
          const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            department,
            registrationNumber,
            phone,
          });
          await newUser.save();

          // Send registration email with temporary password
          await sendMail({
            to: email,
            subject: "Welcome to the Certificate Platform",
            text: `Hello ${name},\n\nYour account has been created. Use the following temporary password to log in: ${tempPassword}\nPlease change it upon first login.\n\nRegards,\nAdmin`,
          });

          registeredUsers.push(email);
        } catch (error) {
          console.error(`Failed to register user ${email}:`, error);
          failedUsers.push({ email, error: "Registration failed" });
        }
      }

      res.status(200).json({
        message: "Bulk registration completed",
        registeredUsers,
        failedUsers,
      });
    });
};

// Register and automatically log in the user by setting up a session

exports.registerUser = async (req, res) => {
  try {
    const { name, email, role, department, registrationNumber, phone } =
      req.body;

    // Check for existing user by email or registration number
    const existingUser = await User.findOne({
      $or: [{ email }, { registrationNumber }],
    });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or registration number already exists.",
      });
    }

    // Generate a temporary password and hash it
    const tempPassword = crypto.randomBytes(8).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      registrationNumber,
      phone,
      firstLogin: true, // Mark first login for setting a new password later
    });
    await newUser.save();

    // Set up session for the registered user
    // req.session.user = {
    // 	id: newUser._id,
    // 	email: newUser.email,
    // 	role: newUser.role,
    // };

    // Send registration email with temporary credentials
    await sendMail({
      to: email,
      subject: "Welcome to the Certificate Platform",
      text: `Hello ${name},\n\nYour account has been created. Use the following temporary password to log in: ${tempPassword}\nPlease change it upon first login.\n\nRegards,\nAdmin`,
    });

    res.status(201).json({
      message:
        "User registered and logged in successfully, check email for login credentials.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Secret key for JWT (store securely, e.g., in environment variables)
const JWT_SECRET = process.env.JWT_SECRET;

// Login Controller
// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user by email and include the password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the user's password is defined before comparing
    if (!user.password) {
      return res.status(500).json({ message: "User password is missing" });
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" } // Set expiration for the token
    );

    // Prepare user data for response
    const { password: _, ...userData } = user.toObject();

    let clubDetails = null;

    // If the user is a club coordinator, fetch the club details
    if (user.role === "club_coordinator") {
      clubDetails = await Club.findOne({ coordinators: user._id }).populate(
        "coordinators",
        "name email"
      );
    }

    // Respond with the token, user data, and club details if applicable
    res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
      club: clubDetails, // Include club details if the user is a coordinator
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user by email and include the password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the user's role is admin
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Only admins can log in via this endpoint.",
      });
    }

    // Check if the user's password is defined before comparing
    if (!user.password) {
      return res.status(500).json({ message: "User password is missing" });
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" } // Set expiration for the token
    );

    // Prepare user data for response
    const { password: _, ...userData } = user.toObject();

    // Respond with the token and user data
    res.status(200).json({
      message: "Admin login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserNamesAndIds = async (req, res) => {
  try {
    // Fetch users, selecting only `name` and `_id` fields
    const users = await User.find({}, "name _id role");

    // Check if users exist
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    // Respond with the user data
    res.status(200).json({
      message: "User names and IDs retrieved successfully.",
      users,
    });
  } catch (error) {
    console.error("Error fetching user names and IDs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Log out user and destroy session
exports.logoutUser = (req, res) => {
  req.session = null; // Clears the session cookie
  res.status(200).json({ message: "Logged out successfully" });
};

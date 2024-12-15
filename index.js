// Import dependencies
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectDB } = require("./config/config");
const adminRoutes = require("./routes/adminRoutes");
const clubRoutes = require("./routes/clubRoutes");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes//userRoutes");
const pushNotificationRoutes = require("./routes/pushNotificationRoutes");
const digiLoker = require("./routes/digilokerRoutes");

const certificateRoutes = require("./routes/certificateRoutes");
const errorController = require("./controllers/errorController");
const cookieSession = require("cookie-session");
require("dotenv").config();
// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Configure session middleware
// app.use(
// 	cookieSession({
// 		name: "session",
// 		keys: [process.env.SESSION_SECRET || "default_secret_key"], // Replace with a secure key
// 		maxAge: 24 * 60 * 60 * 1000, // Session expires in 24 hours
// 	})
// );
// app.use(express.json()); // Ensures Express can handle JSON request bodies

app.use("/api/admin", adminRoutes);
app.use("/api/club", clubRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/certificate", certificateRoutes);
app.use("/api/notifications", pushNotificationRoutes);
app.use("/api/digiLoker", digiLoker);

// Testing Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// app.use("/api/auth", require("./routes/userRoute"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(errorController);

const express = require("express");
const {
  createEvent,
  updateEventStatus,
  saveFCMToken,
  initFirebase,
} = require("../controllers/pushNotifications");
const router = express.Router();

// Initialize Firebase
initFirebase();

// Define routes with their respective controllers
router.post("/create-event", createEvent);
router.put("/update-event-status/:eventId", updateEventStatus);
router.post("/save-fcm-token", saveFCMToken);

module.exports = router;

const mongoose = require("mongoose");
const { Event, Notification, User } = require("../models/userModel");
const admin = require("firebase-admin");
const cron = require("node-cron");

// Firebase Cloud Messaging Setup (Add this to your initialization file)
const initFirebase = () => {
  const serviceAccount = require("./final-year-project-9be57-firebase-adminsdk-rxxeb-9f24d51897.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
};

// Create Notification for All Users
const createBroadcastNotification = async (eventId, title, message, type) => {
  try {
    // Fetch all active users
    const users = await User.find({ isActive: true });

    // Bulk create notifications
    const notifications = users.map((user) => ({
      recipient: user._id,
      title,
      message,
      type,
      relatedTo: {
        model: "Event",
        id: eventId,
      },
    }));

    // Insert notifications
    await Notification.insertMany(notifications);

    // Send Push Notifications
    await sendPushNotificationsToAllUsers(title, message, eventId);
  } catch (error) {
    console.error("Error creating broadcast notifications:", error);
  }
};

const { getMessaging } = require("firebase-admin/messaging");

const sendPushNotificationsToAllUsers = async (title, body, eventId) => {
  try {
    const users = await User.find({
      isActive: true,
      fcmToken: { $exists: true },
    });

    const tokens = users.map((user) => user.fcmToken).filter((token) => token);
    console.log("Fetched Tokens:", tokens);

    if (tokens.length === 0) return;

    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: {
        type: "event",
        eventId: eventId.toString(),
      },
      tokens: tokens,
      webpush: {
        fcm_options: {
          // Optional: specify a link to open when notification is clicked
          link: `https://yourdomain.com/events/${eventId}`,
        },
        notification: {
          // Additional web-specific notification options
          requireInteraction: "true",
        },
      },
    };

    // Send multicast message to multiple devices
    const response = await getMessaging().sendEachForMulticast(message);

    console.log(
      `Successfully sent notification to ${response.successCount} devices`
    );
    console.log(`Failed to send to ${response.failureCount} devices`);

    // Optional: Log details of failed tokens
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
        }
      });
      console.log("Failed tokens:", failedTokens);
    }
  } catch (error) {
    console.error("Error sending push notifications:", error);
  }
};

// Enhanced Event Creation Controller
const createEvent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create event
    const newEvent = new Event({
      title: req.body.title,
      description: req.body.description,
      club: req.body.club,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      registrationDeadline: req.body.registrationDeadline,
      maxParticipants: req.body.maxParticipants,
      activityPoints: req.body.activityPoints,
      venue: req.body.venue,
      whatsappLink: req.body.whatsappLink,
      status: req.body.status || "upcoming",
      createdBy: req.body.createdBy,
    });
    await newEvent.save({ session });

    // Create broadcast notification
    await createBroadcastNotification(
      newEvent._id,
      "New Event Created",
      `A new event "${newEvent.title}" has been created. Check it out!`,
      "event"
    );

    // Schedule registration opening (2 hours later)
    // scheduleEventRegistration(newEvent._id);

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      status: "success",
      event: newEvent,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      status: "error",
      message: "Failed to create event",
      error: error.message,
    });
  }
};

// Event Status Change Notification
const updateEventStatus = async (req, res) => {
  const { eventId } = req.params;
  const { status } = req.body;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    // Update status
    event.status = status;
    await event.save();

    // Create notification based on status
    let notificationTitle, notificationMessage;
    switch (status) {
      case "ongoing":
        notificationTitle = "Event Started";
        notificationMessage = `Event "${event.title}" has started!`;
        break;
      case "completed":
        notificationTitle = "Event Completed";
        notificationMessage = `Event "${event.title}" has been completed.`;
        break;
      case "cancelled":
        notificationTitle = "Event Cancelled";
        notificationMessage = `Event "${event.title}" has been cancelled.`;
        break;
    }

    // Create broadcast notification
    await createBroadcastNotification(
      event._id,
      notificationTitle,
      notificationMessage,
      "event"
    );

    res.status(200).json({
      status: "success",
      event,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update event status",
      error: error.message,
    });
  }
};

// Schedule Event Registration Opening
const scheduleEventRegistration = (eventId) => {
  // Schedule a task to update event registration status after 2 hours
  const scheduledTime = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now

  cron.schedule(scheduledTime.toISOString(), async () => {
    try {
      const event = await Event.findById(eventId);

      if (event && event.status === "upcoming") {
        // Enable registration logic
        event.registrationOpen = true;
        await event.save();

        // Notify users about registration opening
        await createBroadcastNotification(
          eventId,
          "Registration Open",
          `Registration for "${event.title}" is now open!`,
          "registration"
        );
      }
    } catch (error) {
      console.error("Error in event registration scheduling:", error);
    }
  });
};

// Update User Model to include FCM Token
// const updateUserSchema = new mongoose.Schema({
//   // ... existing fields
//   fcmToken: {
//     type: String,
//     required: false,
//   },
// });

// Endpoint to save FCM Token
const saveFCMToken = async (req, res) => {
  try {
    const { fcmToken, userId } = req.body;

    // Update user's FCM token
    await User.findByIdAndUpdate(userId, {
      $set: { fcmToken },
    });

    res.status(200).json({
      status: "success",
      message: "FCM Token saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to save FCM Token",
    });
  }
};

// At the end of the file
module.exports = {
  createEvent,
  updateEventStatus,
  saveFCMToken,
  initFirebase,
};

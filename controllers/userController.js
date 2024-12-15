const {
  Event,
  Certificate,
  User,
  ActivityPoints,
} = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const getUserEvents = catchAsync(async (req, res, next) => {
  const userId = req.params.userId; // Assuming authenticated user

  // Find all events where the user is in the participants array
  const events = await Event.find({
    "participants.student": userId,
  })
    .populate({
      path: "club",
      select: "name logo", // Only select club name and logo
    })
    .select(
      "title description startDate endDate venue status participants activityPoints"
    );

  // Transform the events to include registration and attendance details
  const userEvents = events.map((event) => {
    const userParticipation = event.participants.find(
      (p) => p.student.toString() === userId.toString()
    );

    return {
      _id: event._id,
      title: event.title,
      description: event.description,
      club: event.club,
      startDate: event.startDate,
      endDate: event.endDate,
      venue: event.venue,
      status: event.status,
      activityPoints: event.activityPoints,
      registrationDate: userParticipation.registrationDate,
      attendance: userParticipation.attendance,
      certificateIssued: userParticipation.certificateIssued,
    };
  });

  res.status(200).json({
    status: "success",
    results: userEvents.length,
    data: userEvents,
  });
});

const getUserStatistics = catchAsync(async (req, res, next) => {
  const userId = req.params.userId; // Assuming authenticated user

  // Fetch user with total activity points
  const user = await User.findById(userId).select("totalActivityPoints");

  // Get activity points breakdown
  const activityPointsBreakdown = await ActivityPoints.find({ student: userId })
    .populate({
      path: "event",
      select: "title",
    })
    .populate({
      path: "certificate",
      select: "certificateId",
    });

  // Count events and certificates
  const totalEventsRegistered = await Event.countDocuments({
    "participants.student": userId,
  });

  const eventsAttended = await Event.countDocuments({
    participants: {
      $elemMatch: {
        student: userId,
        attendance: true,
      },
    },
  });

  const totalCertificates = await Certificate.countDocuments({
    student: userId,
  });

  res.status(200).json({
    status: "success",
    data: {
      totalActivityPoints: user.totalActivityPoints,
      totalEventsRegistered,
      eventsAttended,
      totalCertificates,
      activityPointsBreakdown: activityPointsBreakdown.map((ap) => ({
        points: ap.points,
        event: ap.event ? ap.event.title : null,
        certificate: ap.certificate ? ap.certificate.certificateId : null,
        awardedDate: ap.awardedDate,
        remarks: ap.remarks,
      })),
    },
  });
});

module.exports = {
  getUserEvents,
  getUserStatistics,
};

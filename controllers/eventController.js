const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { Event } = require("../models/userModel");
const { Club } = require("../models/userModel");
const { User } = require("../models/userModel");
const { Certificate } = require("../models/userModel");
const PDFDocument = require("pdfkit");
const mongoose = require("mongoose");

exports.createEvent = catchAsync(async (req, res, next) => {
	// const createdBy = req.session.user?.id;

	const newEvent = await Event.create({
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
		participants: [],
	});

	res.status(200).json({
		status: "success",
		event: newEvent,
	});
});

// exports.participantRegister = catchAsync(async (req, res, next) => {
//   const eventId = req.params.eventId;
//   // const userId = req.session.user?.id;
//   const userId = req.params.userId;

//   const event = await Event.findById(eventId);
//   if (!event) {
//     return next(new AppError("Event not found", 404));
//   }

//   const isAlreadyRegistered = event.participants.some(
//     (participant) => participant.student.toString() === userId
//   );
//   if (isAlreadyRegistered) {
//     return next(new AppError("User is already registered for this event", 400));
//   }

//   const participantData = {
//     student: userId,
//     registrationData: req.body.registrationData,
//   };

//   if (event.participants.length >= event.maxParticipants) {
//     return next(new AppError("Maximum number of participants reached", 400));
//   }

//   event.participants.push(participantData);
//   await event.save();

//   res.status(200).json({
//     status: "success",
//     message: "Participant registered successfully",
//     event,
//   });
// });

exports.participantRegister = catchAsync(async (req, res, next) => {
	const { eventId, userId } = req.params;

	// Validate eventId and userId
	if (!eventId || !userId) {
		return next(new AppError("Event ID and User ID are required", 400));
	}

	// Check if the event exists
	const event = await Event.findById(eventId);
	if (!event) {
		return next(new AppError("Event not found", 404));
	}

	// Check if the user is already registered for the event
	const isAlreadyRegistered = event.participants.some(
		(participant) => participant.student.toString() === userId
	);
	if (isAlreadyRegistered) {
		return next(new AppError("User is already registered for this event", 400));
	}

	// Check if the event has reached the maximum number of participants
	if (event.participants.length >= event.maxParticipants) {
		return next(new AppError("Maximum number of participants reached", 400));
	}

	// Add the participant
	const participantData = {
		student: userId,
		registrationDate: new Date(),
		// registrationData: req.body.registrationData || {}, // Optional dynamic data
	};
	event.participants.push(participantData);

	// Save the event
	await event.save();

	res.status(200).json({
		status: "success",
		message: "Participant registered successfully",
		eventId: event._id,
		registeredParticipants: event.participants.length,
		participant: participantData,
	});
});

exports.getEvent = catchAsync(async (req, res, next) => {
	const event = await Event.findById(req.params.id)
		.populate("participants.student", "name email")
		.populate("createdBy", "name email")
		.populate("club", "name description");

	if (!event) {
		return next(new AppError("Event not found", 404));
	}

	res.status(200).json({
		status: "success",
		data: {
			event,
		},
	});
});

exports.getAllEvents = catchAsync(async (req, res, next) => {
	const events = await Event.find()
		.select(
			"title description club startDate endDate registrationDeadline maxParticipants activityPoints venue whatsappLink status createdBy"
		)
		.populate("createdBy", "name email")
		.populate("club", "name description");

	if (!events.length) {
		return next(new AppError("No events found", 404));
	}

	res.status(200).json({
		status: "success",
		data: {
			events,
		},
	});
});

exports.updateEventDetails = catchAsync(async (req, res, next) => {
	const allowedFields = [
		"title",
		"description",
		"startDate",
		"endDate",
		"maxParticipants",
		"venue",
		"whatsappLink",
		"registrationForm",
		"status",
		"activityPoints",
		"registrationDeadline",
	];
	const updateData = {};

	allowedFields.forEach((field) => {
		if (req.body[field]) {
			updateData[field] = req.body[field];
		}
	});

	const eventDetails = await Event.findByIdAndUpdate(
		req.params.id,
		updateData,
		{
			new: true,
			runValidators: true,
		}
	);

	if (!eventDetails) {
		return next(new AppError("Event not found", 404));
	}

	res.status(200).json({
		status: "success",
		event: eventDetails,
	});
});

exports.deleteEvent = catchAsync(async (req, res, next) => {
	const event = await Event.findByIdAndDelete(req.params.id);

	if (!event) {
		return next(new AppError("No event found", 404));
	}

	res.status(204).json({
		status: "success",
		data: null,
	});
});

exports.getParticipants = catchAsync(async (req, res) => {
	const eventId = req.params.eventId;
	const event = await Event.findById(eventId).populate(
		"participants.student",
		"name email"
	);

	if (!event) {
		return res.status(404).json({ message: "Event not found" });
	}

	res.status(200).json({ participants: event.participants });
});

exports.markAttendance = catchAsync(async (req, res) => {
	const { eventId, studentId } = req.params;

	const event = await Event.findById(eventId);
	if (!event) {
		return res.status(404).json({ message: "Event not found" });
	}

	const participant = event.participants.find(
		(p) => p.student.toString() === studentId
	);

	if (!participant) {
		return res.status(404).json({ message: "Participant not found" });
	}

	participant.attendance = !participant.attendance;

	await event.save();

	res
		.status(200)
		.json({ message: "Attendance marked successfully", participant });
});
exports.generateSpecificEventReport = async (req, res) => {
	try {
		const { clubId, eventId } = req.params;

		const club = await Club.findById(clubId).populate("coordinators");
		const event = await Event.findById(eventId).populate(
			"participants.student"
		);

		if (!club || !event) {
			return res.status(404).json({
				success: false,
				message: club ? "Event not found" : "Club not found",
			});
		}

		const doc = new PDFDocument({
			margin: 50, // Increased margin for better readability
			bufferPages: true, // Enable buffering for footer
		});
		const filename = `Club_${club.name}_Event_${event.title}_Report.pdf`;

		// Set headers
		res.setHeader("Content-Type", "application/pdf");
		res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

		// Pipe PDF to response
		doc.pipe(res);

		// Color Palette
		const colors = {
			primary: "#003366",
			secondary: "#0055a5",
			text: "#333333",
			background: "#F4F6F9",
		};

		// Header
		// doc
		//   .fillColor(colors.primary)
		//   .fontSize(24)
		//   .text("Event Management System", { align: "center" });
		// doc.moveDown(0.5);

		doc
			.fillColor(colors.secondary)
			.fontSize(18)
			.text(`Event Report`, { align: "center" });
		doc.moveDown(0.5);

		// Separator Line
		doc
			.strokeColor(colors.primary)
			.lineWidth(1)
			.moveTo(50, doc.y)
			.lineTo(doc.page.width - 50, doc.y)
			.stroke();
		doc.moveDown(1);

		// Event Header
		doc
			.fillColor(colors.primary)
			.fontSize(16)
			.text(event.title, { align: "center", underline: true });
		doc.moveDown(0.5);

		// Metadata Section
		doc
			.fillColor(colors.text)
			.fontSize(12)
			.text(`Generated on: ${new Date().toLocaleString()}`, { align: "right" });
		doc.moveDown(1);

		// Layout Helper Function
		const addSection = (title, details) => {
			doc
				.fillColor(colors.primary)
				.fontSize(14)
				.text(title, { underline: true });
			doc.moveDown(0.5);

			doc.fillColor(colors.text).fontSize(12);

			Object.entries(details).forEach(([key, value]) => {
				doc.text(`${key}: ${value || "N/A"}`, { continued: false });
			});

			doc.moveDown(1);
		};

		// Sections
		addSection("Club Details", {
			"Club Name": club.name,
			Description: club.description,
			Coordinators: club.coordinators.map((c) => c.name).join(", ") || "N/A",
		});

		addSection("Event Details", {
			Title: event.title,
			Description: event.description,
			"Start Date": event.startDate,
			"End Date": event.endDate,
			Venue: event.venue,
		});

		// Statistics Section
		const statistics = {
			"Total Registrations": event.participants.length,
			"Total Attendees": event.participants.filter((p) => p.attendance).length,
			"Certificates Issued": event.participants.filter(
				(p) => p.certificateIssued
			).length,
		};
		addSection("Event Statistics", statistics);

		// Participants Table
		// Participants Table with Colorful CSV-like Spacing and Proper Alignment
		if (event.participants.length > 0) {
			doc
				.fillColor(colors.primary)
				.fontSize(14)
				.text("Participants Details", { underline: true });
			doc.moveDown(0.5);

			// Define table properties
			const tableHeaders = ["Name", "Email", "Attendance"];
			const columnWidths = [200, 250, 150];

			let yPosition = doc.y;

			// Table Header
			doc.fillColor("#003366").fontSize(12).font("Helvetica-Bold");
			tableHeaders.forEach((header, i) => {
				doc.text(header, doc.x, yPosition, {
					width: columnWidths[i],
					align: "left",
				});
				doc.x += columnWidths[i];
			});
			yPosition += 20;

			doc.moveDown(0.5);

			// Alternating row colors for participants
			event.participants.forEach((p, index) => {
				const backgroundColor = index % 2 === 0 ? "#F0F4F8" : "#FFFFFF";

				doc
					.fillColor(backgroundColor)
					.rect(50, yPosition - 5, 500, 20) // Row background
					.fill();

				doc.fillColor(colors.text).fontSize(10).font("Helvetica");

				const rowValues = [
					p.student.name || "N/A",
					p.student.email || "N/A",
					p.attendance ? "Yes" : "No",
				];

				let xPos = 50;
				rowValues.forEach((value, idx) => {
					doc.text(value, xPos, yPosition, {
						width: columnWidths[idx],
						align: "left",
					});
					xPos += columnWidths[idx];
				});

				yPosition += 25;
			});
		} else {
			doc
				.fillColor(colors.text)
				.fontSize(12)
				.text("No participants registered.");
		}

		// Ensure Footer is Placed at the End of the PDF
		doc.moveDown(2);
		doc
			.fillColor("#666666")
			.fontSize(10)
			.font("Helvetica")
			.text("", { align: "center" });

		// End PDF stream
		doc.end();
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to generate event report",
			error: error.message,
		});
	}
};

// Helper: Fetch stats for events
const fetchEventStats = async (clubId) => {
	const events = await Event.find({ club: clubId }).populate("club");

	const stats = events.map((event) => {
		const totalRegistrations = event.participants.length;
		const totalAttendees = event.participants.filter(
			(p) => p.attendance
		).length;
		const certificatesIssued = event.participants.filter(
			(p) => p.certificateIssued
		).length;

		return {
			eventTitle: event.title,
			totalRegistrations,
			totalAttendees,
			certificatesIssued,
			activityPoints: event.activityPoints,
		};
	});

	return stats;
};

// Controller: Show stats for club events
exports.getClubEventStats = async (req, res) => {
	try {
		const { clubId } = req.params;
		const stats = await fetchEventStats(clubId);

		res.status(200).json({
			success: true,
			stats,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch club event stats",
			error: error.message,
		});
	}
};

// Controller: Fetch detailed stats for a specific event
exports.getEventDetails = async (req, res) => {
	try {
		const { eventId } = req.params;
		const event = await Event.findById(eventId)
			.populate("participants.student")
			.populate("club");

		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		const totalRegistrations = event.participants.length;
		const totalAttendees = event.participants.filter(
			(p) => p.attendance
		).length;
		const certificatesIssued = event.participants.filter(
			(p) => p.certificateIssued
		).length;

		res.status(200).json({
			success: true,
			eventDetails: {
				title: event.title,
				description: event.description,
				startDate: event.startDate,
				endDate: event.endDate,
				venue: event.venue,
				activityPoints: event.activityPoints,
				totalRegistrations,
				totalAttendees,
				certificatesIssued,
				participants: event.participants.map((p) => ({
					student: p.student ? p.student.name : null,
					registrationDate: p.registrationDate,
					attendance: p.attendance,
					certificateIssued: p.certificateIssued,
					//   registrationData: p.registrationData,
				})),
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch event details",
			error: error.message,
		});
	}
};

exports.getUserProfile = catchAsync(async (req, res, next) => {
	const { userId } = req.params;

	// Validate `userId`
	if (!mongoose.Types.ObjectId.isValid(userId)) {
		return next(new AppError("Invalid user ID", 400));
	}

	// Fetch User Details
	const user = await User.findById(userId)
		.select(
			"name email role department registrationNumber profileImage isActive phone totalActivityPoints"
		)
		.lean();

	if (!user) {
		return next(new AppError("User not found", 404));
	}

	// Fetch Events the user has participated in
	const participatedEvents = await Event.find({
		"participants.student": userId,
	})
		.select("title description startDate endDate activityPoints venue")
		.lean();

	// Add `certificateIssued` flag to events
	participatedEvents.forEach((event) => {
		const participant = event.participants.find(
			(p) => p.student.toString() === userId
		);
		event.certificateIssued = participant
			? participant.certificateIssued
			: false;
		delete event.participants;
	});

	// Fetch Certificates issued to the user
	const certificates = await Certificate.find({ student: userId })
		.populate("event", "title") // Populate event title
		.populate("club", "name") // Populate club name
		.select("certificateId issueDate certificateHash qrCode activityPoints")
		.lean();

	// Response
	res.status(200).json({
		status: "success",
		user,
		participatedEvents,
		certificates,
	});
});

exports.getUserProfile = async (req, res) => {
	try {
		// Get the user ID from the authenticated request
		// const userId = req.user.id; // Assuming you have authentication middleware
		const { userId } = req.params;

		// Fetch user profile information
		const user = await User.findById(userId).select(
			"name email role department registrationNumber profileImage isActive phone totalActivityPoints"
		);

		if (!user) {
			return res.status(404).json({
				status: "error",
				message: "User not found",
			});
		}

		// Fetch events the user has participated in
		const participatedEvents = await Event.find({
			"participants.student": userId,
			"participants.attendance": true,
		})
			.select("title description startDate endDate club status")
			.populate("club", "name");

		// Fetch certificates issued to the user
		const certificates = await Certificate.find({ student: userId })
			.select("certificateId event club issueDate activityPoints status")
			.populate("event", "title")
			.populate("club", "name");

		// Prepare the response object
		const userProfile = {
			personalInfo: {
				name: user.name,
				email: user.email,
				role: user.role,
				department: user.department,
				registrationNumber: user.registrationNumber,
				profileImage: user.profileImage,
				isActive: user.isActive,
				phone: user.phone,
				totalActivityPoints: user.totalActivityPoints,
			},
			participatedEvents: participatedEvents.map((event) => ({
				title: event.title,
				description: event.description,
				startDate: event.startDate,
				endDate: event.endDate,
				club: event.club.name,
				status: event.status,
			})),
			certificates: certificates.map((cert) => ({
				certificateId: cert.certificateId,
				event: cert.event.title,
				club: cert.club.name,
				issueDate: cert.issueDate,
				activityPoints: cert.activityPoints,
				status: cert.status,
			})),
		};

		res.status(200).json({
			status: "success",
			data: userProfile,
		});
	} catch (error) {
		console.error("Error fetching user profile:", error);
		res.status(500).json({
			status: "error",
			message: "Internal server error",
			error: error.message,
		});
	}
};

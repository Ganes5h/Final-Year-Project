const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { Event } = require("../models/userModel");

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
		registrationForm: req.body.registrationForm,
		status: req.body.status || "upcoming",
		createdBy: req.body.createdBy,
		participants: [],
	});

	res.status(200).json({
		status: "success",
		event: newEvent,
	});
});

exports.participantRegister = catchAsync(async (req, res, next) => {
	const eventId = req.params.eventId;
	// const userId = req.session.user?.id;
	const userId = req.params.userId;

	const event = await Event.findById(eventId);
	if (!event) {
		return next(new AppError("Event not found", 404));
	}

	const isAlreadyRegistered = event.participants.some(
		(participant) => participant.student.toString() === userId
	);
	if (isAlreadyRegistered) {
		return next(new AppError("User is already registered for this event", 400));
	}

	const participantData = {
		student: userId,
		registrationData: req.body.registrationData,
	};

	if (event.participants.length >= event.maxParticipants) {
		return next(new AppError("Maximum number of participants reached", 400));
	}

	event.participants.push(participantData);
	await event.save();

	res.status(200).json({
		status: "success",
		message: "Participant registered successfully",
		event,
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
		.populate("participants.student", "name email")
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

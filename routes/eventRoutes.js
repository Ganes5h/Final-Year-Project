const express = require("express");
const eventController = require("../controllers/eventController");

const router = express.Router();

router.route("/create").post(eventController.createEvent);
router.route("/register").post(eventController.participantRegister);
router.route("/eventDetails/:id").get(eventController.getEvent);
router.route("/allEvents").get(eventController.getAllEvents);
router.route("/updateEvent/:id").patch(eventController.updateEventDetails);
router.route("/deleteEvent/:id").delete(eventController.deleteEvent);

router
	.route("/participate/:eventId/:userId")
	.post(eventController.participantRegister);

router.route("/getParticipants/:eventId").get(eventController.getParticipants);

router
	.route("/markAttendance/:eventId/:studentId")
	.get(eventController.markAttendance);

module.exports = router;

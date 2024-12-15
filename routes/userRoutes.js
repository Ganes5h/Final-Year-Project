const express = require("express");
const eventController = require("../controllers/eventController");
const userController = require("../controllers/userController");

const router = express.Router();

router.route("/:userId/profile").get(eventController.getUserProfile);
router.route("/:userId/events").get(userController.getUserEvents);
router.route("/:userId/statistics").get(userController.getUserStatistics);

module.exports = router;

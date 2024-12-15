const express = require("express");
const eventController = require("../controllers/eventController");

const router = express.Router();

router.route("/:userId/profile").get(eventController.getUserProfile);

module.exports = router;

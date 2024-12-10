const express = require("express");
const certificateController = require("../controllers/certificateController");

const router = express.Router();

router
	.route("/generate-certificate")
	.post(certificateController.generateCertificate);

router
	.route("/verify-certificate/:certificateHash")
	.get(certificateController.verifyCertificate);

module.exports = router;

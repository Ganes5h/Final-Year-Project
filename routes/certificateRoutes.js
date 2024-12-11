const express = require("express");
const certificateController = require("../controllers/certificateController");

const router = express.Router();

router
	.route("/generate-certificate")
	.post(certificateController.bulkGenerateAndSend);

router
	.route("/verify-certificate/:certificateHash")
	.get(certificateController.verifyCertificate);

router
	.route("/revoke-certificate")
	.post(certificateController.revokeCertificate);

module.exports = router;

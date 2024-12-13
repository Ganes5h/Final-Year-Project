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
	.route("/getCertificateByEvents/:eventId")
	.get(certificateController.getCertificatesByEventId);

router
	.route("/revoke-certificate")
	.post(certificateController.revokeCertificate);

router
	.route("/getRevokeCertificate/:eventId")
	.get(certificateController.getRevokedCertificates);

module.exports = router;

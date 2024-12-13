const { Event } = require("../models/userModel");
const { Certificate } = require("../models/userModel");
const QRCode = require("qrcode");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const AES_KEY = Buffer.from(process.env.AES_KEY, "hex");
const AES_IV = Buffer.from(process.env.AES_IV, "hex");

const encryptAES256 = (data) => {
	const cipher = crypto.createCipheriv("aes-256-cbc", AES_KEY, AES_IV);
	let encrypted = cipher.update(data, "utf8", "hex");
	encrypted += cipher.final("hex");
	return encrypted;
};

const decryptAES256 = (encryptedData) => {
	const decipher = crypto.createDecipheriv("aes-256-cbc", AES_KEY, AES_IV);
	let decrypted = decipher.update(encryptedData, "hex", "utf8");
	decrypted += decipher.final("utf8");
	return decrypted;
};

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.SMTP_EMIAL,
		pass: process.env.SMTP_PASS,
	},
});

// Generate Certificate PDF
const generatePDF = async (certificateDetails, qrCodeImage) => {
	const templatePath = path.join(
		__dirname,
		"../uploads/templates/certificate.png"
	);
	const templateBytes = fs.readFileSync(templatePath);

	const pdfDoc = await PDFDocument.create();
	const page = pdfDoc.addPage([2000, 1414]);

	const templateImage = await pdfDoc.embedPng(templateBytes);
	page.drawImage(templateImage, { x: 0, y: 0, width: 2000, height: 1414 });

	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const studentName = certificateDetails.student.name;
	const usn = certificateDetails.student.registrationNumber;
	const eventName = certificateDetails.event.title;
	const activityPoints = certificateDetails.activityPoints;

	const text = `This Certificate is presented to ${studentName} bearing usn ${usn} of Computer Science and Engineering Department for his/her participation in the event ${eventName} organized by Rotaract Club of GIT on 28th November 2023 and is eligible to claim ${activityPoints} Activity Points prescribed by AICTE.`;

	// page.drawText(text, {
	// 	x: 100,
	// 	y: 700,
	// 	size: 40,
	// 	font,
	// 	color: rgb(0, 0, 0),
	// });

	const boxWidth = 1500;
	const boxHeight = 700;
	const x = 100; // X position
	const y = 600; // Y position

	// Define the font size (adjust based on content)
	const fontSize = 40;

	// Word wrap function to ensure text stays within box width
	const wrapText = (text, maxWidth, font) => {
		const words = text.split(" ");
		let lines = [];
		let currentLine = "";
		for (let word of words) {
			const testLine =
				currentLine + (currentLine.length === 0 ? "" : " ") + word;
			const testWidth = font.widthOfTextAtSize(testLine, fontSize);
			if (testWidth <= maxWidth) {
				currentLine = testLine;
			} else {
				if (currentLine.length > 0) {
					lines.push(currentLine);
				}
				currentLine = word;
			}
		}
		if (currentLine.length > 0) {
			lines.push(currentLine);
		}
		return lines;
	};

	const wrappedText = wrapText(text, boxWidth - 200, font); // Wrap the text
	const lineHeight = fontSize * 1.5;
	let textY = y;
	for (const line of wrappedText) {
		const lineWidth = font.widthOfTextAtSize(line, fontSize);
		const x = (boxWidth - lineWidth) / 2;
		page.drawText(line, {
			x: x + 250,
			y: textY,
			size: fontSize,
			font,
			color: rgb(0, 0, 0),
		});
		textY -= lineHeight;
	}

	const qrImage = await pdfDoc.embedPng(qrCodeImage);
	page.drawImage(qrImage, { x: 1800, y: 100, width: 150, height: 150 });

	return pdfDoc.save();
};

exports.bulkGenerateAndSend = catchAsync(async (req, res) => {
	const { eventId } = req.body;

	if (!eventId) {
		return res
			.status(400)
			.json({ status: "error", message: "Event ID is required." });
	}

	const event = await Event.findById(eventId).populate(
		"participants.student",
		"name email registrationNumber"
	);

	if (!event) {
		return res
			.status(404)
			.json({ status: "error", message: "Event not found." });
	}

	const attendees = event.participants.filter(
		(participant) => participant.attendance && !participant.certificateIssued
	);

	if (attendees.length === 0) {
		return res
			.status(400)
			.json({ status: "error", message: "No attendees to process." });
	}

	const certificatesDir = path.join(__dirname, "certificates");
	if (!fs.existsSync(certificatesDir)) {
		fs.mkdirSync(certificatesDir, { recursive: true });
	}

	const emailPromises = attendees.map(async (attendee) => {
		const { student } = attendee;
		try {
			const certificateId = crypto.randomUUID();
			const encryptedData = encryptAES256(
				JSON.stringify({ certificateId, eventId, student: student._id })
			);
			const qrCodeImage = await QRCode.toDataURL(
				`https://secureCertify.edu/verify/${encryptedData}`
			);

			const newCertificate = await Certificate.create({
				certificateId,
				event: eventId,
				student: student._id,
				club: event.club,
				certificateHash: encryptedData,
				qrCode: qrCodeImage,
				activityPoints: event.activityPoints,
			});

			const populatedCertificate = await Certificate.findById(
				newCertificate._id
			)
				.populate("student", "name email registrationNumber")
				.populate("event", "title activityPoints")
				.exec();

			const pdfBytes = await generatePDF(populatedCertificate, qrCodeImage);

			const pdfPath = path.join(
				certificatesDir,
				`certificate_${certificateId}.pdf`
			);

			await fs.promises.writeFile(pdfPath, pdfBytes);

			await transporter.sendMail({
				from: process.env.SMTP_EMAIL,
				to: student.email,
				subject: "Your Participation Certificate",
				text: `Dear ${student.name}, find your participation certificate attached.`,
				attachments: [
					{ filename: `certificate_${certificateId}.pdf`, path: pdfPath },
				],
			});

			await fs.promises.unlink(pdfPath);

			attendee.certificateIssued = true;
		} catch (error) {
			console.error(
				`Error processing attendee ${student.name} (${student.email}):`,
				error
			);
		}
	});

	await Promise.all(emailPromises);
	await event.save();

	res.status(200).json({
		status: "success",
		message: "Certificates generated and emailed successfully.",
	});
});

exports.verifyCertificate = catchAsync(async (req, res) => {
	const { certificateHash } = req.params;

	let decryptedData;
	try {
		decryptedData = decryptAES256(certificateHash);
	} catch (error) {
		return res.status(400).json({
			status: "error",
			message: "Invalid or tampered certificate data.",
		});
	}

	const parsedData = JSON.parse(decryptedData);

	const certificate = await Certificate.findOne({
		certificateId: parsedData.certificateId,
	})
		.populate("student", "name registrationNumber")
		.populate("event", "title activityPoints");

	if (!certificate) {
		return res.status(404).json({
			status: "error",
			message: "Certificate not found.",
		});
	}

	if (certificate.status === "revoked") {
		return res.status(400).json({
			status: "error",
			message: "This certificate has been revoked.",
			reason: certificate.revokedReason,
			revokedDate: certificate.revokedDate,
		});
	}

	res.status(200).json({
		status: "success",
		message: "Certificate is valid.",
		data: {
			certificateId: certificate.certificateId,
			studentName: certificate.student.name,
			usn: certificate.student.registrationNumber,
			eventName: certificate.event.title,
			activityPoints: certificate.activityPoints,
			issuedDate: certificate.issueDate,
		},
	});
});

exports.revokeCertificate = catchAsync(async (req, res) => {
	const { certificateId, reason, revokedById } = req.body;

	const certificate = await Certificate.findOne({ certificateId });
	if (!certificate) {
		return res.status(404).json({ message: "Certificate not found." });
	}

	if (certificate.status === "revoked") {
		return res.status(400).json({ message: "Certificate is already revoked." });
	}
	certificate.status = "revoked";
	certificate.revokedReason = reason;
	certificate.revokedDate = new Date();
	certificate.revokedBy = revokedById;

	await certificate.save();

	res.status(200).json({
		message: `Certificate ${certificateId} has been revoked.`,
		certificate,
	});
});

exports.getCertificatesByEventId = catchAsync(async (req, res) => {
	const { eventId } = req.params;

	const event = await Event.findById(eventId);
	if (!event) {
		return res.status(404).json({ message: "Event not found" });
	}

	const certificates = await Certificate.find({ event: eventId })
		.populate("student", "name email registrationNumber")
		.select("certificateId student");

	if (!certificates.length) {
		return res
			.status(404)
			.json({ message: "No certificates found for this event" });
	}

	res.status(200).json({
		message: "Certificates retrieved successfully",
		certificates,
	});
});

exports.getRevokedCertificates = catchAsync(async (req, res) => {
	const { eventId } = req.params;

	const event = await Event.findById(eventId).select("_id title");
	if (!event) {
		return res.status(404).json({ message: "Event not found" });
	}

	const revokedCertificates = await Certificate.find({
		event: eventId,
		status: "revoked",
	})
		.populate("student", "name email registrationNumber")
		.select("certificateId student");

	if (!revokedCertificates.length) {
		return res
			.status(404)
			.json({ message: "No revoked certificates found for this event" });
	}

	res.status(200).json({
		message: "Revoked certificates retrieved successfully",
		event: {
			eventId: event._id,
			eventTitle: event.title,
			revokedCertificates,
		},
	});
});

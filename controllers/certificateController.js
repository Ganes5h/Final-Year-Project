const { Event } = require("../models/userModel");
const { Certificate } = require("../models/userModel");
const QRCode = require("qrcode");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const catchAsync = require("../utils/catchAsync");

const AES_KEY = crypto.randomBytes(32);
const AES_IV = crypto.randomBytes(16);

const encryptAES256 = (data) => {
	const cipher = crypto.createCipheriv("aes-256-cbc", AES_KEY, AES_IV);
	let encrypted = cipher.update(data, "utf8", "hex");
	encrypted += cipher.final("hex");
	return encrypted;
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

// Bulk Generate and Send Certificates
exports.bulkGenerateAndSend = catchAsync(async (req, res) => {
	const { eventId } = req.body;

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
		(participant) =>
			participant.attendance === true && !participant.certificateIssued
	);

	if (attendees.length === 0) {
		return res
			.status(400)
			.json({ status: "error", message: "No attendees to process." });
	}

	for (const attendee of attendees) {
		const { student } = attendee;
		const certificateId = crypto.randomUUID();
		const encryptedData = encryptAES256(
			JSON.stringify({ certificateId, eventId, student: student._id })
		);
		const qrCodeImage = await QRCode.toDataURL(
			`https://yourdomain.com/verify/${encryptedData}`
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

		const populatedCertificate = await Certificate.findById(newCertificate._id)
			.populate("student", "name email registrationNumber")
			.populate("event", "title activityPoints")
			.exec();

		const pdfBytes = await generatePDF(populatedCertificate, qrCodeImage);
		// const pdfPath = `./certificates/certificate_${certificateId}.pdf`;

		const certificatesDir = path.join(__dirname, "certificates"); // Ensure the certificates folder exists
		if (!fs.existsSync(certificatesDir)) {
			fs.mkdirSync(certificatesDir, { recursive: true });
		}

		// Define the path for the PDF file
		const pdfPath = path.join(
			certificatesDir,
			`certificate_${certificateId}.pdf`
		);

		fs.writeFileSync(pdfPath, pdfBytes);

		await transporter.sendMail({
			from: process.env.SMTP_EMIAL,
			to: student.email,
			subject: "Your Participation Certificate",
			text: `Dear ${student.name}, find your participation certificate attached.`,
			attachments: [
				{ filename: `certificate_${certificateId}.pdf`, path: pdfPath },
			],
		});

		fs.unlinkSync(pdfPath);

		attendee.certificateIssued = true;
	}
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
		.populate("event", "name");

	if (!certificate) {
		return res.status(404).json({
			status: "error",
			message: "Certificate not found.",
		});
	}

	res.status(200).json({
		status: "success",
		message: "Certificate is valid.",
		data: {
			certificateId: certificate.certificateId,
			studentName: certificate.student.name,
			usn: certificate.student.registrationNumber,
			eventName: certificate.event.name,
			activityPoints: certificate.activityPoints,
			issuedDate: certificate.issueDate,
		},
	});
});

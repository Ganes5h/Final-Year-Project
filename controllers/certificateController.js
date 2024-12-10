// const { Certificate } = require("../models/userModel");
// const QRCode = require("qrcode");
// const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
// const fs = require("fs");
// const crypto = require("crypto");
// const mongoose = require("mongoose");
// const catchAsync = require("../utils/catchAsync");
// const path = require("path");

// exports.generateCertificate = catchAsync(async (req, res) => {
// 	const { eventId, studentId, clubId, activityPoints } = req.body;

// 	if (!eventId || !studentId || !clubId || !activityPoints) {
// 		return res.status(400).json({ error: "Missing required parameters" });
// 	}

// 	let eventObjectId, studentObjectId, clubObjectId;
// 	try {
// 		eventObjectId = mongoose.Types.ObjectId(eventId);
// 		studentObjectId = mongoose.Types.ObjectId(studentId);
// 		clubObjectId = mongoose.Types.ObjectId(clubId);
// 	} catch (error) {
// 		eventObjectId = eventId;
// 		studentObjectId = studentId;
// 		clubObjectId = clubId;
// 	}

// 	// Generate a unique certificate ID
// 	const certificateId = crypto.randomUUID();

// 	// Generate SHA-256 hash for the certificate
// 	const certificateHash = crypto
// 		.createHash("sha256")
// 		.update(certificateId + eventId + studentId + clubId)
// 		.digest("hex");

// 	// Generate QR code with verification URL
// 	const verificationUrl = `https://yourdomain.com/verify/${certificateHash}`;
// 	const qrCodeImage = await QRCode.toDataURL(verificationUrl);

// 	// Save certificate details to the database
// 	const newCertificate = new Certificate({
// 		certificateId,
// 		event: eventObjectId,
// 		student: studentObjectId,
// 		club: clubObjectId,
// 		certificateHash,
// 		qrCode: qrCodeImage,
// 		activityPoints,
// 	});

// 	await newCertificate.save();

// 	const certificateDetails = await Certificate.findOne({ certificateId })
// 		.populate("student", "name registrationNumber")
// 		.populate("event", "name")
// 		.exec();

// 	const studentName = certificateDetails.student.name;
// 	const usn = certificateDetails.student.registrationNumber;
// 	const eventName = certificateDetails.event.name;

// 	// Dynamically load the certificate template
// 	const templatePath = path.join(
// 		__dirname,
// 		"../uploads/templates/certificate.png"
// 	);
// 	const templateBytes = fs.readFileSync(templatePath);

// 	// Create a new PDF document
// 	const pdfDoc = await PDFDocument.create();
// 	const page = pdfDoc.addPage([2000, 1414]); // A4 size

// 	// Embed the certificate template
// 	const templateImage = await pdfDoc.embedPng(templateBytes);
// 	const { width, height } = templateImage.scale(1);
// 	page.drawImage(templateImage, {
// 		x: 0,
// 		y: 0,
// 		width,
// 		height,
// 	});

// 	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
// 	const text = `This Certificate is presented to ${studentName} bearing usn ${usn} of Computer Science and Engineering Department for his/her participation in the event ${eventName} organized by Rotaract Club of GIT on 28th November 2023 and is eligible to claim ${activityPoints} Activity Points prescribed by AICTE.`;

// 	// Define text box parameters (width, height, position)
// 	const boxWidth = 1500;
// 	const boxHeight = 700;
// 	const x = 100; // X position
// 	const y = 600; // Y position

// 	// Define the font size (adjust based on content)
// 	const fontSize = 40;

// 	// Word wrap function to ensure text stays within box width
// 	const wrapText = (text, maxWidth, font) => {
// 		const words = text.split(" ");
// 		let lines = [];
// 		let currentLine = "";
// 		for (let word of words) {
// 			const testLine =
// 				currentLine + (currentLine.length === 0 ? "" : " ") + word;
// 			const testWidth = font.widthOfTextAtSize(testLine, fontSize);
// 			if (testWidth <= maxWidth) {
// 				currentLine = testLine;
// 			} else {
// 				if (currentLine.length > 0) {
// 					lines.push(currentLine);
// 				}
// 				currentLine = word;
// 			}
// 		}
// 		if (currentLine.length > 0) {
// 			lines.push(currentLine);
// 		}
// 		return lines;
// 	};

// 	const wrappedText = wrapText(text, boxWidth - 200, font); // Wrap the text
// 	const lineHeight = fontSize * 1.5; // Line height

// 	// Draw text in the defined box, centered horizontally
// 	let textY = y;
// 	for (const line of wrappedText) {
// 		const lineWidth = font.widthOfTextAtSize(line, fontSize);
// 		const x = (boxWidth - lineWidth) / 2; // Centering the text
// 		page.drawText(line, {
// 			x: x + 250, // Position text horizontally inside the box
// 			y: textY,
// 			size: fontSize,
// 			font,
// 			color: rgb(0, 0, 0),
// 		});
// 		textY -= lineHeight; // Move to the next line
// 	}

// 	// Embed the QR code image
// 	const qrImage = await pdfDoc.embedPng(qrCodeImage);
// 	page.drawImage(qrImage, { x: 1800, y: 80, width: 150, height: 150 });

// 	const pdfBytes = await pdfDoc.save();
// 	res.set({
// 		"Content-Type": "application/pdf",
// 		"Content-Disposition": `attachment; filename=certificate_${certificateId}.pdf`,
// 	});
// 	res.end(pdfBytes);
// });

// exports.verifyCertificate = catchAsync(async (req, res) => {
// 	const { certificateHash } = req.params;

// 	const certificate = await Certificate.findOne({ certificateHash })
// 		.populate("student", "name registrationNumber")
// 		.populate("event", "name");

// 	if (!certificate) {
// 		return res.status(404).json({
// 			status: "error",
// 			message: "Invalid or non-existent certificate.",
// 		});
// 	}

// 	res.status(200).json({
// 		status: "success",
// 		message: "Certificate is valid.",
// 		data: {
// 			certificateId: certificate.certificateId,
// 			studentName: certificate.student.name,
// 			usn: certificate.student.registrationNumber,
// 			eventName: certificate.event.name,
// 			activityPoints: certificate.activityPoints,
// 			issuedDate: certificate.issueDate,
// 		},
// 	});
// });

const { Certificate } = require("../models/userModel");
const QRCode = require("qrcode");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const crypto = require("crypto");
const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const path = require("path");

// AES Key and IV generation
const AES_KEY = crypto.randomBytes(32); // 256-bit key
const AES_IV = crypto.randomBytes(16); // 128-bit IV

// AES Encryption Function
const encryptAES256 = (data) => {
	const cipher = crypto.createCipheriv("aes-256-cbc", AES_KEY, AES_IV);
	let encrypted = cipher.update(data, "utf8", "hex");
	encrypted += cipher.final("hex");
	return encrypted;
};

// AES Decryption Function
const decryptAES256 = (encryptedData) => {
	const decipher = crypto.createDecipheriv("aes-256-cbc", AES_KEY, AES_IV);
	let decrypted = decipher.update(encryptedData, "hex", "utf8");
	decrypted += decipher.final("utf8");
	return decrypted;
};

exports.generateCertificate = catchAsync(async (req, res) => {
	const { eventId, studentId, clubId, activityPoints } = req.body;

	if (!eventId || !studentId || !clubId || !activityPoints) {
		return res.status(400).json({ error: "Missing required parameters" });
	}

	// Validate IDs
	let eventObjectId, studentObjectId, clubObjectId;
	try {
		eventObjectId = mongoose.Types.ObjectId(eventId);
		studentObjectId = mongoose.Types.ObjectId(studentId);
		clubObjectId = mongoose.Types.ObjectId(clubId);
	} catch (error) {
		eventObjectId = eventId;
		studentObjectId = studentId;
		clubObjectId = clubId;
	}

	// Generate a unique certificate ID
	const certificateId = crypto.randomUUID();

	// Combine and encrypt certificate data
	const combinedData = JSON.stringify({
		certificateId,
		eventId,
		studentId,
		clubId,
	});
	const encryptedCertificateData = encryptAES256(combinedData);

	// Generate QR code with verification URL
	const verificationUrl = `https://yourdomain.com/verify/${encryptedCertificateData}`;
	const qrCodeImage = await QRCode.toDataURL(verificationUrl);

	// Save certificate details to the database
	const newCertificate = new Certificate({
		certificateId,
		event: eventObjectId,
		student: studentObjectId,
		club: clubObjectId,
		certificateHash: encryptedCertificateData,
		qrCode: qrCodeImage,
		activityPoints,
	});

	await newCertificate.save();

	const certificateDetails = await Certificate.findOne({ certificateId })
		.populate("student", "name registrationNumber")
		.populate("event", "name")
		.exec();

	const studentName = certificateDetails.student.name;
	const usn = certificateDetails.student.registrationNumber;
	const eventName = certificateDetails.event.name;

	// Dynamically load the certificate template
	const templatePath = path.join(
		__dirname,
		"../uploads/templates/certificate.png"
	);
	const templateBytes = fs.readFileSync(templatePath);

	// Create a new PDF document
	const pdfDoc = await PDFDocument.create();
	const page = pdfDoc.addPage([2000, 1414]); // A4 size

	// Embed the certificate template
	const templateImage = await pdfDoc.embedPng(templateBytes);
	const { width, height } = templateImage.scale(1);
	page.drawImage(templateImage, {
		x: 0,
		y: 0,
		width,
		height,
	});

	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const text = `This Certificate is presented to ${studentName} bearing usn ${usn} of Computer Science and Engineering Department for his/her participation in the event ${eventName} organized by Rotaract Club of GIT on 28th November 2023 and is eligible to claim ${activityPoints} Activity Points prescribed by AICTE.`;

	// Define text box parameters (width, height, position)
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
	const lineHeight = fontSize * 1.5; // Line height

	// Draw text in the defined box, centered horizontally
	let textY = y;
	for (const line of wrappedText) {
		const lineWidth = font.widthOfTextAtSize(line, fontSize);
		const x = (boxWidth - lineWidth) / 2; // Centering the text
		page.drawText(line, {
			x: x + 250, // Position text horizontally inside the box
			y: textY,
			size: fontSize,
			font,
			color: rgb(0, 0, 0),
		});
		textY -= lineHeight; // Move to the next line
	}

	// Embed the QR code image
	const qrImage = await pdfDoc.embedPng(qrCodeImage);
	page.drawImage(qrImage, { x: 1800, y: 80, width: 150, height: 150 });

	const pdfBytes = await pdfDoc.save();
	res.set({
		"Content-Type": "application/pdf",
		"Content-Disposition": `attachment; filename=certificate_${certificateId}.pdf`,
	});
	res.end(pdfBytes);
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

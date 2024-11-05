const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // Or any SMTP service provider
  auth: {
    user: process.env.SMTP_EMIAL,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendMail = async ({ to, subject, text }) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_EMIAL,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};

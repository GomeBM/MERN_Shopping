// backend/mailer.js
require("dotenv").config();
const nodemailer = require("nodemailer");

// Create a transporter object using your email service
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services or SMTP
  auth: {
    user: process.env.EMAIL_ADRESS, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
});

// Function to send an email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_ADRESS,
    to,
    subject,
    text,
  };

  return transporter
    .sendMail(mailOptions)
    .then((response) => {
      console.log("Email sent successfully:", response);
      return response;
    })
    .catch((error) => {
      console.error("Error sending email:", error);
      throw error; // Re-throw the error to be caught in the controller
    });
};

module.exports = { sendEmail };

// backend/controllers/emailController.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // We are using Gmail
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address from .env
    pass: process.env.EMAIL_PASS, // Your Gmail App Password from .env
  },
});

// @desc    Send contact form email
// @route   POST /api/email/contact
// @access  Public
const sendContactEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address (your Gmail)
      to: process.env.RECEIVING_EMAIL, // Receiver address (where you want to get messages)
      subject: `Crafted Whispers Contact Form: ${subject}`, // Email subject
      html: `
        <p>You have a new contact message from Crafted Whispers website:</p>
        <h3>Contact Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Subject:</strong> ${subject}</li>
        </ul>
        <h3>Message:</h3>
        <p>${message}</p>
      `,
      replyTo: email // Allows you to reply directly to the sender
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email. Please try again later.' });
  }
};

module.exports = { sendContactEmail };

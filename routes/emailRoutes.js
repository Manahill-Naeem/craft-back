// backend/routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../controllers/emailController');

// Define the route for sending contact emails
router.post('/contact', sendContactEmail);

module.exports = router;

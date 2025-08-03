// // backend/server.js
// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const productRoutes = require('./routes/productRoutes'); 
// const categoryRoutes = require('./routes/categoryRoutes'); 
// const orderRoutes = require('./routes/orderRoutes'); 
// const path = require('path');
// const cors = require('cors');
// const emailRoutes = require('./routes/emailRoutes');
// const saleRoutes = require('./routes/saleRoutes'); 

// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors()); // Enable CORS
// app.use(express.json()); // Body parser

// // Serve static images
// app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// // API Routes
// app.use('/api/products', productRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/orders', orderRoutes); 
// app.use('/api/email', emailRoutes);
// app.use('/api/sales', saleRoutes); 

// // ... (other routes or error handling)

// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));









// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors'); // cors import karein
const path = require('path');

// Route imports
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const emailRoutes = require('./routes/emailRoutes');
const saleRoutes = require('./routes/saleRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
// CORS ko specifically Vercel frontend URL ke liye configure karein
const corsOptions = {
  // Yahan aapke Vercel frontend project ka URL aayega
  origin: 'https://craft-website-4593em6h-manahill-naeems-projects.vercel.app',
  optionsSuccessStatus: 200 // For legacy browsers
};
app.use(cors(corsOptions));
app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }
};

// Serve static images from the 'public/images' directory
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Root route
app.get('/', (req, res) => {
  res.send('Backend Server is Running!');
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/sales', saleRoutes);

// Test Route
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: "Server is running and routes are connected." });
});

// Default route for unhandled requests (optional)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// `PORT` variable ko `8080` par hardcode karein.
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Connect to DB *after* the server has started
    connectDB();
});

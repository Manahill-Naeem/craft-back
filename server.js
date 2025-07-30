// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes'); 
const orderRoutes = require('./routes/orderRoutes'); 
const path = require('path');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');
const saleRoutes = require('./routes/saleRoutes'); 

dotenv.config();
connectDB();

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Body parser

// Serve static images
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes); 
app.use('/api/email', emailRoutes);
app.use('/api/sales', saleRoutes); 

// ... (other routes or error handling)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
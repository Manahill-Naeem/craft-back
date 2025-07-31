// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Assuming you have an Order model

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public (for now, can add auth later)
router.post('/', async (req, res) => {
  try {
    const { items, customerName, customerEmail, customerPhone, shippingAddress, totalAmount, paymentMethod } = req.body;

    // Basic validation
    if (!items || items.length === 0 || !customerName || !customerEmail || !customerPhone || !shippingAddress || !totalAmount || !paymentMethod) {
      return res.status(400).json({ message: 'Please provide all required order details.' });
    }

    // You might want to add more robust validation here,
    // e.g., checking if productIds in items are valid,
    // calculating totalAmount on the server side to prevent tampering.

    const newOrder = new Order({
      items,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      totalAmount,
      paymentMethod,
      status: 'Pending', // Default status
    });

    const createdOrder = await newOrder.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error while creating order' });
  }
});

// @desc    Get all orders (for admin/testing)
// @route   GET /api/orders
// @access  Public (for now, can add auth later)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// @desc    Get single order by ID (for admin/user)
// @route   GET /api/orders/:id
// @access  Public (for now, can add auth later)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
});

module.exports = router;

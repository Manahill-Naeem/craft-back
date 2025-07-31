// backend/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category'); // Adjust path as needed

// GET all active categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST a new category (for initial data population)
router.post('/', async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(400).json({ message: 'Error creating category', error: error.message });
  }
});

module.exports = router;
